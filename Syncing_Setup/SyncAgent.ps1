param (
    [switch]$RunOnce = $false
)

$LocalConnString = "Server=localhost;Database=rapiido_majestic;Integrated Security=True;TrustServerCertificate=True;"
$LiveConnString = "Server=66.165.248.146;Database=rapiido_majestic;User Id=nazar;Password=`$t&@\/\/bE&Ry;TrustServerCertificate=True;Encrypt=True;"

function Log-Sync ($Message) {
    $DateStr = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$DateStr] $Message"
    # Optionally log to file
    # Add-Content -Path "C:\SyncLogs\SyncAgent.log" -Value "[$DateStr] $Message"
}

function Get-SqlData ($ConnString, $Query) {
    $conn = New-Object System.Data.SqlClient.SqlConnection($ConnString)
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $Query
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($cmd)
    $dt = New-Object System.Data.DataTable
    $adapter.Fill($dt) | Out-Null
    return ,$dt
}

function Execute-Sql ($ConnString, $Query) {
    $conn = New-Object System.Data.SqlClient.SqlConnection($ConnString)
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $Query
    $conn.Open()
    $rows = $cmd.ExecuteNonQuery()
    $conn.Close()
    return $rows
}

function Quote-SqlValue ($Value) {
    if ($null -eq $Value -or $Value -is [System.DBNull]) {
        return "NULL"
    }
    
    if ($Value -is [DateTime]) {
        return "'$($Value.ToString("yyyy-MM-dd HH:mm:ss.fff"))'"
    }
    
    if ($Value -is [bool]) {
        if ($Value) { return "1" } else { return "0" }
    }
    
    if ($Value -is [int] -or $Value -is [decimal] -or $Value -is [float] -or $Value -is [double]) {
        return $Value.ToString()
    }
    
    $escaped = $Value.ToString().Replace("'", "''")
    return "'$escaped'"
}

Log-Sync "Starting Majestic Sync Agent..."

while ($true) {
    try {
        # Check if tables exist
        $tablesDt = Get-SqlData $LocalConnString "SELECT TableName, PKColumn FROM Sync_Config WHERE IsActive = 1"
        Log-Sync "Tables found: $($tablesDt.Rows.Count)"
        
        foreach ($row in $tablesDt.Rows) {
            $tableName = $row.TableName
            if ([string]::IsNullOrWhiteSpace($tableName)) { continue }
            $pkCol = $row.PKColumn
            
            Log-Sync "Checking queue for table: $tableName"
            
            # Get pending queue items
            $queueQuery = "SELECT Id, RecordId, OperationType FROM [$($tableName)_SyncQueue] WHERE SyncStatus = 0"
            $queueDt = Get-SqlData $LocalConnString $queueQuery
            
            foreach ($qRow in $queueDt.Rows) {
                $qId = $qRow.Id
                $recordId = $qRow.RecordId
                $opType = $qRow.OperationType
                
                try {
                    if ($opType -eq 'DELETE') {
                        $delSql = "DELETE FROM [$tableName] WHERE [$pkCol] = '$recordId'"
                        Execute-Sql $LiveConnString $delSql | Out-Null
                    }
                    elseif ($opType -eq 'UPSERT') {
                        # Fetch local data
                        $localData = Get-SqlData $LocalConnString "SELECT * FROM [$tableName] WHERE [$pkCol] = '$recordId'"
                        if ($localData.Rows.Count -eq 0) {
                            # Skip if deleted locally
                            Execute-Sql $LocalConnString "UPDATE [$($tableName)_SyncQueue] SET SyncStatus = 1, LastSyncTime = GETDATE() WHERE Id = $qId" | Out-Null
                            continue
                        }
                        $lRow = $localData.Rows[0]
                        
                        # Check if exists on Live
                        $liveExists = Get-SqlData $LiveConnString "SELECT 1 FROM [$tableName] WHERE [$pkCol] = '$recordId'"
                        
                        $cols = @()
                        $vals = @()
                        $updates = @()
                        
                        foreach ($col in $localData.Columns) {
                            $cols += "[$($col.ColumnName)]"
                            $val = Quote-SqlValue $lRow[$col.ColumnName]
                            $vals += $val
                            if ($col.ColumnName -ne $pkCol -and $col.ColumnName -ne 'Id') {
                                $updates += "[$($col.ColumnName)] = $val"
                            }
                        }
                        
                        if ($liveExists.Rows.Count -gt 0) {
                            # UPDATE
                            $updStr = $updates -join ", "
                            if ($updStr.Length -gt 0) {
                                $liveSql = "UPDATE [$tableName] SET $updStr WHERE [$pkCol] = '$recordId'"
                                Execute-Sql $LiveConnString $liveSql | Out-Null
                            }
                        } else {
                            # INSERT
                            $colStr = $cols -join ", "
                            $valStr = $vals -join ", "
                            
                            # Check if table has identity
                            $hasIdent = Get-SqlData $LocalConnString "SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('$tableName') AND is_identity = 1"
                            
                            if ($hasIdent.Rows.Count -gt 0) {
                                $liveSql = "SET IDENTITY_INSERT [$tableName] ON; INSERT INTO [$tableName] ($colStr) VALUES ($valStr); SET IDENTITY_INSERT [$tableName] OFF;"
                            } else {
                                $liveSql = "INSERT INTO [$tableName] ($colStr) VALUES ($valStr);"
                            }
                            Execute-Sql $LiveConnString $liveSql | Out-Null
                        }
                    }
                    
                    # Mark success
                    Execute-Sql $LocalConnString "UPDATE [$($tableName)_SyncQueue] SET SyncStatus = 1, LastSyncTime = GETDATE() WHERE Id = $qId" | Out-Null
                    Log-Sync "Successfully synced $tableName Record $recordId"
                }
                catch {
                    Log-Sync "Error syncing $tableName Record $recordId : $($_.Exception.Message)"
                    Execute-Sql $LocalConnString "UPDATE [$($tableName)_SyncQueue] SET SyncTryCount = SyncTryCount + 1 WHERE Id = $qId" | Out-Null
                }
            }
        }
    }
    catch {
        Log-Sync "Global Error: $($_.Exception.Message). Will retry in 5 seconds."
    }
    
    if ($RunOnce) {
        break
    }
    Start-Sleep -Seconds 5
}
