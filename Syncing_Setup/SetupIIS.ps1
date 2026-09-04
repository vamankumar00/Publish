# Requires Run as Administrator
if (-Not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Please run this script as Administrator!"
    exit
}

Write-Host "Installing IIS and ASP.NET 4.7..."
dism /online /enable-feature /featurename:IIS-WebServerRole /all /NoRestart
dism /online /enable-feature /featurename:IIS-ASPNET45 /all /NoRestart

Import-Module WebAdministration

Write-Host "Configuring IIS App Pools..."
# Create App Pool for Majestic
$appPoolName = "MajesticAppPool"
if (-Not (Test-Path "IIS:\AppPools\$appPoolName")) {
    New-WebAppPool -Name $appPoolName
}
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "managedRuntimeVersion" -Value "v4.0"
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "enable32BitAppOnWin64" -Value $true

Write-Host "Deploying Sites..."
# Stop default website if running
if (Get-Website -Name "Default Web Site" -ErrorAction SilentlyContinue) {
    Stop-Website -Name "Default Web Site"
}

# Rapiido-API on Port 8081
if (Get-Website -Name "Rapiido-API" -ErrorAction SilentlyContinue) { Remove-Website -Name "Rapiido-API" }
New-Website -Name "Rapiido-API" -Port 8081 -PhysicalPath "D:\Projects\Majestic\Publish\Rapiido-API" -ApplicationPool $appPoolName

# Rapiido-Admin on Port 8082
if (Get-Website -Name "Rapiido-Admin" -ErrorAction SilentlyContinue) { Remove-Website -Name "Rapiido-Admin" }
New-Website -Name "Rapiido-Admin" -Port 8082 -PhysicalPath "D:\Projects\Majestic\Publish\Rapiido-Admin" -ApplicationPool $appPoolName

# Rapiido-WEB on Port 8083
if (Get-Website -Name "Rapiido-WEB" -ErrorAction SilentlyContinue) { Remove-Website -Name "Rapiido-WEB" }
New-Website -Name "Rapiido-WEB" -Port 8083 -PhysicalPath "D:\Projects\Majestic\Publish\Rapiido-WEB" -ApplicationPool $appPoolName

Write-Host "IIS Setup Complete! Sites are running on ports 8081 (API), 8082 (Admin), and 8083 (Web)."
