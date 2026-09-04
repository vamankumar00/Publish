# Majestic Live Sync Agent - Setup Guide

This guide explains how to install or remove the **Majestic Sync Agent** (`SyncAgent.ps1`) on any local POS machine so that it runs automatically in the background, keeping the POS data synchronized with the live server.

## 1. How the Agent Works
The agent is a PowerShell script (`d:\Projects\Majestic\SyncAgent.ps1`) that runs continuously in the background. It reads the local `Sync_Config` and `_SyncQueue` tables and pushes any pending `UPSERT` or `DELETE` operations to the live Plesk server securely. If the internet disconnects, it waits silently and retries when the connection is restored.

---

## 2. Setting it up on a New Client PC (Auto-Start)

To make the script run automatically every time the PC starts (and hide the black console window), we will use **Windows Task Scheduler**.

1. Open **PowerShell as Administrator** on the client PC.
2. Copy and paste the following command and press Enter:

```powershell
$Action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -WindowStyle Hidden -File "d:\Projects\Majestic\Syncing_Setup\SyncAgent.ps1"'
$Trigger = New-ScheduledTaskTrigger -AtStartup
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "MajesticSyncAgent" -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Force
```

3. **Start it immediately (without restarting):**
```powershell
Start-ScheduledTask -TaskName "MajesticSyncAgent"
```

> [!TIP]
> The agent is now running silently in the background as the `SYSTEM` user. It will start automatically on all future reboots!

---

## 3. How to Stop and Remove the Agent

If you ever need to stop syncing or remove the agent completely from a PC, run the following commands in **PowerShell as Administrator**:

1. **Stop the running agent:**
```powershell
Stop-ScheduledTask -TaskName "MajesticSyncAgent"
```

2. **Remove the auto-start task:**
```powershell
Unregister-ScheduledTask -TaskName "MajesticSyncAgent" -Confirm:$false
```

> [!NOTE]
> This only removes the auto-start schedule. The `SyncAgent.ps1` file will remain in `d:\Projects\Majestic` in case you want to set it up again later.
