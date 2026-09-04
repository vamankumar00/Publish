$ErrorActionPreference = "Stop"
Import-Module WebAdministration

$scriptPath = $PSScriptRoot
$publishPath = $scriptPath

Write-Host "1. Installing IIS Features (if needed)..."
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-StaticContent, IIS-DefaultDocument, IIS-DirectoryBrowsing, IIS-HttpErrors, IIS-ApplicationDevelopment, IIS-ASPNET, IIS-NetFxExtensibility, IIS-ASPNET45, IIS-NetFxExtensibility45, IIS-ISAPIExtensions, IIS-ISAPIFilter, IIS-HealthAndDiagnostics, IIS-HttpLogging, IIS-RequestMonitor, IIS-Security, IIS-RequestFiltering, IIS-Performance, IIS-HttpCompressionStatic, IIS-WebServerManagementTools, IIS-ManagementConsole, WAS-WindowsActivationService, WAS-ProcessModel, WAS-NetFxEnvironment, WAS-ConfigurationAPI -All

Write-Host "2. Adding DNS entries to hosts file..."
$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$ip = "127.0.0.1"
$domains = @("apirapiido.majestic.com", "rapiido.majestic.com", "admin.rapiido.majestic.com")
$hostsContent = Get-Content $hostsPath -Raw
foreach ($domain in $domains) {
    if ($hostsContent -notmatch "(?m)^\s*$ip\s+$domain\s*$") {
        Write-Host "Adding $domain to hosts file..."
        Add-Content $hostsPath "$ip $domain"
    }
}

Write-Host "3. Creating Self-Signed Certificate for API (Secure Port)..."
$certName = "MajesticAPI_Cert"
$cert = Get-ChildItem "Cert:\LocalMachine\My" | Where-Object { $_.Subject -eq "CN=$certName" }
if (-not $cert) {
    Write-Host "Creating Self-Signed Certificate for $certName..."
    $cert = New-SelfSignedCertificate -DnsName "apirapiido.majestic.com" -CertStoreLocation "cert:\LocalMachine\My" -FriendlyName $certName
}

Write-Host "4. Setting up IIS App Pools and Sites..."
$sites = @(
    @{
        Name = "Majestic-API"
        HostName = "apirapiido.majestic.com"
        Port = 443
        Protocol = "https"
        Path = "$publishPath\Rapiido-API"
    },
    @{
        Name = "Majestic-WEB"
        HostName = "rapiido.majestic.com"
        Port = 8082
        Protocol = "http"
        Path = "$publishPath\Rapiido-WEB"
    },
    @{
        Name = "Majestic-Admin"
        HostName = "admin.rapiido.majestic.com"
        Port = 8083
        Protocol = "http"
        Path = "$publishPath\Rapiido-Admin"
    }
)

foreach ($site in $sites) {
    Write-Host "Setting up site $($site.Name)..."
    # App Pool
    if (-not (Test-Path "IIS:\AppPools\$($site.Name)")) {
        New-WebAppPool -Name $site.Name
        Set-ItemProperty -Path "IIS:\AppPools\$($site.Name)" -Name "managedRuntimeVersion" -Value "v4.0"
        Set-ItemProperty -Path "IIS:\AppPools\$($site.Name)" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
    }

    # Site
    if (Test-Path "IIS:\Sites\$($site.Name)") {
        Remove-WebSite -Name $site.Name
    }

    if ($site.Protocol -eq "https") {
        New-WebSite -Name $site.Name -PhysicalPath $site.Path -ApplicationPool $site.Name -Port $site.Port -HostHeader $site.HostName
        Get-WebBinding -Name $site.Name -Protocol "http" | Remove-WebBinding
        New-WebBinding -Name $site.Name -Protocol "https" -Port $site.Port -HostHeader $site.HostName
        
        $certPath = "Cert:\LocalMachine\My\$($cert.Thumbprint)"
        $bindingPath = "IIS:\SslBindings\*!$($site.Port)!$($site.HostName)"
        if (Test-Path $bindingPath) { Remove-Item $bindingPath }
        Get-Item $certPath | New-Item $bindingPath -SSLFlags 1
    } else {
        New-WebSite -Name $site.Name -Port $site.Port -HostHeader $site.HostName -PhysicalPath $site.Path -ApplicationPool $site.Name
    }
}

Write-Host "5. Setting up Watchdog for IIS (Scheduled Task)..."
$watchdogScriptPath = "$publishPath\IIS-Watchdog.ps1"
$watchdogContent = @"
Import-Module WebAdministration
if ((Get-Service -Name W3SVC).Status -ne 'Running') {
    Start-Service -Name W3SVC
}

Get-ChildItem -Path IIS:\AppPools | Where-Object { `$_.state -eq 'Stopped' } | Start-WebAppPool
Get-ChildItem -Path IIS:\Sites | Where-Object { `$_.state -eq 'Stopped' } | Start-WebSite
"@
Set-Content -Path $watchdogScriptPath -Value $watchdogContent

$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$watchdogScriptPath`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$task = New-ScheduledTask -Action $action -Principal $principal -Trigger $trigger

# Unregister if exists
if (Get-ScheduledTask -TaskName "Majestic_IIS_Watchdog" -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName "Majestic_IIS_Watchdog" -Confirm:$false
}

Register-ScheduledTask -TaskName "Majestic_IIS_Watchdog" -InputObject $task -Force

Write-Host "Deployment Setup Completed Successfully!"
