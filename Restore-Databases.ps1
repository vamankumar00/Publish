# Requires Run as Administrator or SQL Sysadmin
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Rapiido Database Restore & Verification Script" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptPath = $PSScriptRoot
if (-not $scriptPath) { $scriptPath = Get-Location }

# 1. Detect SQL Server Instance
$instances = @(".", "localhost", "localhost\SQLEXPRESS", "127.0.0.1", "(local)")
$connectedInstance = $null

foreach ($inst in $instances) {
    try {
        $testConn = New-Object System.Data.SqlClient.SqlConnection("Server=$inst;Integrated Security=True;TrustServerCertificate=True;Connect Timeout=3;")
        $testConn.Open()
        $testConn.Close()
        $connectedInstance = $inst
        break
    } catch {
        # Continue trying
    }
}

if (-not $connectedInstance) {
    Write-Host "ERROR: Could not connect to any local SQL Server instance. Please make sure SQL Server is running." -ForegroundColor Red
    exit 1
}

Write-Host "Successfully connected to SQL Server instance: $connectedInstance" -ForegroundColor Green

# 2. Restore Databases from .bak if present, else .sql
$bakConDb = Join-Path $scriptPath "rapiido_ConDb.bak"
$bakMajestic = Join-Path $scriptPath "rapiido_majestic.bak"
$sqlConDb = Join-Path $scriptPath "rapiido_ConDb.sql"
$sqlMajestic = Join-Path $scriptPath "rapiido_majestic.sql"

function Restore-FromBakOrSql {
    param(
        [string]$Server,
        [string]$DbName,
        [string]$BakPath,
        [string]$SqlPath
    )

    $masterConn = New-Object System.Data.SqlClient.SqlConnection("Server=$Server;Database=master;Integrated Security=True;TrustServerCertificate=True;")
    $masterConn.Open()

    $restored = $false
    if (Test-Path $BakPath) {
        Write-Host "Restoring $DbName from backup: $BakPath..." -ForegroundColor Yellow
        try {
            # Kill existing connections
            $killCmd = $masterConn.CreateCommand()
            $killCmd.CommandText = "IF EXISTS (SELECT name FROM sys.databases WHERE name = '$DbName') BEGIN ALTER DATABASE [$DbName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE END"
            $killCmd.ExecuteNonQuery() | Out-Null

            # Get File list
            $fileListCmd = $masterConn.CreateCommand()
            $fileListCmd.CommandText = "RESTORE FILELISTONLY FROM DISK = N'$BakPath'"
            $reader = $fileListCmd.ExecuteReader()
            $moves = @()
            $defaultDataDir = $null
            while ($reader.Read()) {
                $logicalName = $reader["LogicalName"]
                $type = $reader["Type"]
                $ext = if ($type -eq "L") { "_log.ldf" } else { ".mdf" }
                $moves += "MOVE N'$logicalName' TO N'$scriptPath\$DbName$ext'"
            }
            $reader.Close()

            $moveClause = if ($moves.Count -gt 0) { ", " + ($moves -join ", ") } else { "" }
            $restoreCmd = $masterConn.CreateCommand()
            $restoreCmd.CommandTimeout = 300
            $restoreCmd.CommandText = "RESTORE DATABASE [$DbName] FROM DISK = N'$BakPath' WITH REPLACE $moveClause, RECOVERY"
            $restoreCmd.ExecuteNonQuery() | Out-Null

            $multiCmd = $masterConn.CreateCommand()
            $multiCmd.CommandText = "ALTER DATABASE [$DbName] SET MULTI_USER"
            $multiCmd.ExecuteNonQuery() | Out-Null

            Write-Host "SUCCESS: $DbName restored successfully from .bak!" -ForegroundColor Green
            $restored = $true
        } catch {
            Write-Host "Warning: .bak restore failed ($($_.Exception.Message)). Attempting .sql script..." -ForegroundColor DarkYellow
        }
    }

    if (-not $restored -and (Test-Path $SqlPath)) {
        Write-Host "Executing SQL script: $SqlPath for $DbName..." -ForegroundColor Yellow
        try {
            if (Get-Command sqlcmd -ErrorAction SilentlyContinue) {
                & sqlcmd -S $Server -i $SqlPath -b
            } else {
                # Execute in batches delimited by GO
                $sqlContent = Get-Content $SqlPath -Raw
                $batches = [System.Text.RegularExpressions.Regex]::Split($sqlContent, "^\s*GO\s*$", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Multiline)
                foreach ($batch in $batches) {
                    if ($batch.Trim()) {
                        $bCmd = $masterConn.CreateCommand()
                        $bCmd.CommandTimeout = 300
                        $bCmd.CommandText = $batch
                        $bCmd.ExecuteNonQuery() | Out-Null
                    }
                }
            }
            Write-Host "SUCCESS: $DbName created and populated from .sql script!" -ForegroundColor Green
        } catch {
            Write-Host "ERROR running $SqlPath : $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    $masterConn.Close()
}

# Run Restore
Restore-FromBakOrSql -Server $connectedInstance -DbName "rapiido_ConDb" -BakPath $bakConDb -SqlPath $sqlConDb
Restore-FromBakOrSql -Server $connectedInstance -DbName "rapiido_majestic" -BakPath $bakMajestic -SqlPath $sqlMajestic

# 3. Verification
Write-Host "`nVerifying Tables in rapiido_majestic..." -ForegroundColor Cyan
$majConn = New-Object System.Data.SqlClient.SqlConnection("Server=$connectedInstance;Database=rapiido_majestic;Integrated Security=True;TrustServerCertificate=True;")
try {
    $majConn.Open()
    $checkCmd = $majConn.CreateCommand()
    $checkCmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME IN ('Item', 'Category', 'SubCategory', 'ItemRate', 'ItemVeriation')"
    $count = [int]$checkCmd.ExecuteScalar()
    if ($count -ge 5) {
        Write-Host "SUCCESS: All core menu tables ('Item', 'Category', 'SubCategory', 'ItemRate', 'ItemVeriation') exist in rapiido_majestic!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Found only $count / 5 core tables in rapiido_majestic. Please verify database contents." -ForegroundColor Red
    }
    $majConn.Close()
} catch {
    Write-Host "Error verifying rapiido_majestic: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "Database restore and verification complete!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
