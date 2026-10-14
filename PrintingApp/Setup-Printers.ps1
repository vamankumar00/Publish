<#
=============================================================================================
  Rapiido / Majestic POS - Automated Printer Setup Script
  Purpose: Automatically creates Standard TCP/IP Ports and Installs/Configures Windows Printers
           to match the database (PrinterCategory / Config / App.config).
  Author: Majestic Engineering Team
  Usage: Run PowerShell as Administrator:
         powershell -ExecutionPolicy Bypass -File .\Setup-Printers.ps1
=============================================================================================
#>

# Ensure Script is running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "Note: Standard TCP/IP Port creation and Printer installation require Administrator privileges."
    Write-Warning "Please ensure you run this script in PowerShell as Administrator ('Run as administrator')."
    Write-Host ""
}

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  Rapiido / Majestic POS - Automated Printer Setup Utility   " -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================================
# 1. CONFIGURATION LIST: Add or Update Printers Here
# =============================================================================================
# Name: MUST EXACTLY match the name in DB (PrinterCategory.PrinterName) or App.config (PrinterName)
# Type: "LAN" (Network/Ethernet/WiFi) or "USB"
# IP:   Static IP of the LAN printer (e.g. 192.168.10.90)
# Port: 9100 (Default RAW port for ESC/POS thermal printers)
# =============================================================================================

$PrintersToSetup = @(
    @{
        Name        = "BillPrinter"
        Type        = "USB"                     # Main Cashier Counter Printer
        Description = "Main Customer Receipt & Bill Printer (USB)"
    },
    @{
        Name        = "Black Copper 80"
        Type        = "LAN"
        IP          = "192.168.10.90"           # Kitchen Printer (Appetizers, Breakfast, Maincourse)
        PortNumber  = 9100
        Description = "Kitchen KOT Printer 1 (LAN)"
    },
    @{
        Name        = "Black Copper BC-85AC"
        Type        = "LAN"
        IP          = "192.168.1.100"          # Secondary / Bar / BBQ Printer
        PortNumber  = 9100
        Description = "Kitchen / Bar KOT Printer 2 (LAN)"
    }
)

# =============================================================================================
# 2. DETECT AVAILABLE THERMAL DRIVER
# =============================================================================================
$AvailableDrivers = Get-PrinterDriver | Select-Object -ExpandProperty Name

# Priority list for thermal printer drivers
$PreferredDrivers = @("POS-80 11.3.0.1", "POS-80", "Generic / Text Only", "Black Copper BC-85AC", "Microsoft Software Printer Driver")
$SelectedDriver = $null

foreach ($driver in $PreferredDrivers) {
    if ($AvailableDrivers -contains $driver) {
        $SelectedDriver = $driver
        break
    }
}

if (-not $SelectedDriver) {
    # If no thermal driver found, check if any driver contains 'POS' or 'Thermal' or use Generic
    $fallback = $AvailableDrivers | Where-Object { $_ -like "*POS*" -or $_ -like "*Thermal*" -or $_ -like "*Copper*" } | Select-Object -First 1
    if ($fallback) {
        $SelectedDriver = $fallback
    } else {
        $SelectedDriver = "Generic / Text Only"
    }
}

Write-Host "-> Selected Thermal Printer Driver: '$SelectedDriver'" -ForegroundColor Green
Write-Host ""

# =============================================================================================
# 3. SETUP PRINTERS & PORTS
# =============================================================================================

foreach ($p in $PrintersToSetup) {
    $pName = $p.Name
    $pType = $p.Type
    $pDesc = $p.Description

    Write-Host "--------------------------------------------------------------" -ForegroundColor Gray
    Write-Host "Processing: [$pName] ($pDesc)" -ForegroundColor Yellow

    if ($pType -eq "LAN") {
        $pIP = $p.IP
        $pPortNum = if ($p.PortNumber) { $p.PortNumber } else { 9100 }
        $portName = "IP_$pIP"

        # Step 3.1: Check and Create TCP/IP Port
        $existingPort = Get-PrinterPort -Name $portName -ErrorAction SilentlyContinue
        if (-not $existingPort) {
            Write-Host "   -> Creating TCP/IP Port: $portName (IP: $pIP, Port: $pPortNum)..." -ForegroundColor White
            try {
                Add-PrinterPort -Name $portName -PrinterHostAddress $pIP -PortNumber $pPortNum -ErrorAction Stop
                Write-Host "   [OK] TCP/IP Port '$portName' created successfully." -ForegroundColor Green
            } catch {
                Write-Host "   [ERROR] Failed to create port: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   [OK] TCP/IP Port '$portName' already exists." -ForegroundColor Cyan
        }

        # Step 3.2: Test Network Connectivity (Ping)
        Write-Host "   -> Testing network connection to $pIP..." -NoNewline
        $pingResult = Test-Connection -ComputerName $pIP -Count 1 -Quiet -ErrorAction SilentlyContinue
        if ($pingResult) {
            Write-Host " ONLINE (Ping successful)" -ForegroundColor Green
        } else {
            Write-Host " OFFLINE / TIMEOUT (Ensure printer is powered on and connected to LAN)" -ForegroundColor Yellow
        }

        # Step 3.3: Check and Install Printer
        $existingPrinter = Get-Printer -Name $pName -ErrorAction SilentlyContinue
        if (-not $existingPrinter) {
            Write-Host "   -> Installing Windows Printer '$pName' on port '$portName'..." -ForegroundColor White
            try {
                Add-Printer -Name $pName -DriverName $SelectedDriver -PortName $portName -ErrorAction Stop
                Write-Host "   [OK] Printer '$pName' installed successfully!" -ForegroundColor Green
            } catch {
                Write-Host "   [ERROR] Could not install printer: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   -> Printer '$pName' already exists. Verifying port assignment..." -ForegroundColor White
            if ($existingPrinter.PortName -ne $portName) {
                Set-Printer -Name $pName -PortName $portName -ErrorAction SilentlyContinue
                Write-Host "   [UPDATED] Port updated to '$portName'." -ForegroundColor Green
            } else {
                Write-Host "   [OK] Printer '$pName' is already configured correctly on '$portName'." -ForegroundColor Cyan
            }
        }
    }
    elseif ($pType -eq "USB") {
        # Check USB Printer
        $existingPrinter = Get-Printer -Name $pName -ErrorAction SilentlyContinue
        if ($existingPrinter) {
            Write-Host "   [OK] USB Printer '$pName' is installed and ready (Port: $($existingPrinter.PortName))." -ForegroundColor Green
        } else {
            Write-Host "   [INFO] USB Printer '$pName' is not yet installed in Windows." -ForegroundColor Yellow
            Write-Host "          Please plug the USB cable in, install the POS-80 driver, and rename it to '$pName'." -ForegroundColor Yellow
        }
    }
}

Write-Host "--------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "               FINAL PRINTER CONFIGURATION SUMMARY             " -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan

Get-Printer | Where-Object { $PrintersToSetup.Name -contains $_.Name } | Select-Object Name, DriverName, PortName, PrinterStatus | Format-Table -AutoSize

Write-Host "Setup Completed Successfully!" -ForegroundColor Green
Write-Host "All printers are ready for Rapiido Printing App." -ForegroundColor Cyan
