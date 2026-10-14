# Rapiido / Majestic POS - Complete Deployment & Setup Manual

Yeh document **Rapiido Printing App** ki complete deployment, setup aur troubleshooting guide hai. Agar aap kisi new client ke PC par fresh deployment kar rahe hain ya purani deployment mein naye printers add kar rahe hain, to is step-by-step guide ko follow karein.

---

## 1. System Architecture & Working Flow

```text
[ Cashier / Waiter POS ]
          │
          ▼
   (Order Saved)
          │
          ▼
 [ SQL Server (rapiido_majestic) ] ────► [ Service Broker Event ]
                                                  │
                                                  ▼
                                      [ PrintingApp.exe (Background Tray) ]
                                                  │
                                                  ├──────────────────────────────┐
                                                  ▼                              ▼
                                     [ Customer Bill Printer ]          [ Kitchen KOT Printer(s) ]
                                          (USB Connection)                   (LAN / IP Network)
                                       e.g. "BillPrinter"                 e.g. "Black Copper 80"
```

1. Cashier ya Waiter POS se order punch karta hai.
2. SQL Server ke `OrderMaster` table mein naya order insert/update hota hai.
3. SQL Server ka **Service Broker** foran `PrintingApp.exe` ko real-time event bhejta hai.
4. `PrintingApp.exe` bill generate karke **`BillPrinter` (USB)** par customer receipt nikalta hai.
5. Sath hi unprinted items ko category-wise filter karke respective **Kitchen / Bar Printers (LAN / IP)** par KOT bhejta hai aur database mein `IsPrinted = 1` update kar deta hai.

---

## 2. Prerequisites & System Requirements

- **Operating System:** Windows 10, Windows 11, ya Windows Server 2016/2019/2022.
- **Framework:** Microsoft .NET Framework **4.7.2** ya isse higher.
- **Database:** Microsoft SQL Server 2014, 2016, 2019, ya 2022 (Standard, Enterprise, ya Express).
- **Printers Supported:** 80mm (3-Inch) Thermal Receipt Printers (Black Copper, Rongta, Xprinter, Epson, POS-80, etc.).
- **Network Ports:** Port `9100` (RAW printing) client ke local network par open hona chahiye.

---

## 3. Database Configuration (SQL Server)

Deployment ke waqt client ke SQL Server par ye 3 queries run karni zaroori hain:

### Step 3.1: Enable Service Broker
SqlTableDependency real-time events ke liye Service Broker use karta hai. Isko check aur enable karein:

```sql
USE master;
GO

-- Check if Service Broker is enabled
SELECT name, is_broker_enabled FROM sys.databases WHERE name = 'rapiido_majestic';
GO

-- Agar is_broker_enabled = 0 hai, to ye command chalayein:
ALTER DATABASE [rapiido_majestic] SET ENABLE_BROKER WITH ROLLBACK IMMEDIATE;
GO
```

### Step 3.2: Enable Category-Wise KOT Routing
Agar restaurant mein Kitchen aur Bar ke alag printers hain, to `Config` table mein feature ON karein:

```sql
USE [rapiido_majestic];
GO

-- KOT Category Routing feature ON karein
UPDATE Config 
SET ConfigValue = 'Yes' 
WHERE ConfigName = 'PrintCategory';
GO
```

### Step 3.3: Map Categories to Printers (`PrinterCategory`)
Har food category ko uske printer ke sath map karein:

```sql
USE [rapiido_majestic];
GO

-- Check existing configuration
SELECT PC.Id, C.CategoryDesc, PC.PrinterName, PC.PrinterIP, PC.IsActive 
FROM PrinterCategory PC 
LEFT JOIN Category C ON PC.CategoryId = C.Id;
GO

-- Naya printer map karne ya update karne ka tareeqa:
-- CategoryId 1 = Appetizers, 4 = Breakfast, 5 = Main Course -> Kitchen Printer
UPDATE PrinterCategory 
SET PrinterName = 'Black Copper 80', 
    PrinterIP = '192.168.10.90', 
    IsActive = 1 
WHERE CategoryId IN (1, 4, 5);

-- CategoryId 2 = Beverages / Drinks -> Bar Printer
UPDATE PrinterCategory 
SET PrinterName = 'Black Copper BC-85AC', 
    PrinterIP = '192.168.1.100', 
    IsActive = 1 
WHERE CategoryId = 2;
GO
```

---

## 4. Printer Hardware & Windows Setup

Yeh application Windows Print Spooler ke zariye print karti hai. Is liye **Windows ke andar printer ka exact wahi Naam hona zaroori hai jo Database aur Config mein hai.**

### Option A: Automated Setup (Recommended - 1 Click)
Aapke deployment folder mein **`Setup-Printers.ps1`** script mojood hai:

1. `Setup-Printers.ps1` file par right-click karein aur **"Run with PowerShell"** (Run as Administrator) karein.
2. Script automatically:
   - Thermal driver detect karega.
   - Database ke mutabiq Standard TCP/IP Ports (`IP_192.168.10.90`, `IP_192.168.1.100`) bana dega.
   - Network connectivity (Ping) test karega.
   - Windows mein printers (`BillPrinter`, `Black Copper 80`, `Black Copper BC-85AC`) install aur map kar dega.

Agar naye client par IP ya Printer Name alag ho, to `Setup-Printers.ps1` ko Notepad mein open karke top par `$PrintersToSetup` array mein IP aur Name change kar lein.

---

### Option B: Manual Setup Guide

#### 1. Counter Bill Printer (USB Connection)
1. Printer ko USB cable se POS PC ke sath connect karein aur power ON karein.
2. Printer ka driver (e.g., `POS-80` ya `Black Copper`) install karein.
3. Windows `Printers & scanners` open karein.
4. Installed printer par click karein > `Printer properties`.
5. **General Tab:** Printer ka naam change karke **`BillPrinter`** rakh dein (Jo `App.config` mein define hai).
6. **Ports Tab:** Check karein ke `USB001` (ya jo bhi active USB port ho) selected hai.
7. Print Test Page bhej kar check karein.

#### 2. Kitchen / Bar KOT Printer (LAN / Ethernet / Wi-Fi IP Connection)
1. Kitchen printer ko Ethernet cable ke zariye restaurant ke Router / Switch se connect karein.
2. **Printer ka Static IP pata karein:**
   - Printer ka power OFF karein.
   - `FEED` button daba kar rakhein aur power ON karein. 3 second baad chhor dein.
   - Printer se Self-Test slip niklegi jispe printer ka current IP (e.g. `192.168.10.90`) likha hoga.
3. **Windows PC par TCP/IP Printer Add karein:**
   - Windows `Settings` > `Printers & scanners` > `Add device` > `Add manually`.
   - Select karein: **"Add a printer using an IP address or hostname"** > Next.
   - Device Type: **`TCP/IP Device`**.
   - Hostname or IP address: Printer ki IP dalein (e.g., `192.168.10.90`).
   - Port name automatically ban jayega. Next karein.
   - Driver mein thermal driver (`POS-80` ya manufacturer driver) choose karein.
   - **Printer Name:** Database ke `PrinterCategory.PrinterName` ke sath 100% exact match karein (e.g., **`Black Copper 80`**).
4. Windows Test Page print karke verify karein ke LAN over print aa raha hai.

---

## 5. Application Deployment & Files Configuration

### Folder Structure
Publish folder ko client PC par copy karein (Recommended path: `D:\Projects\Majestic\Publish\PrintingApp\` ya `C:\Rapiido\PrintingApp\`):

```text
PrintingApp\
├── PrintingApp.exe              # Main background executable
├── PrintingApp.exe.config       # Main configuration file (XML)
├── PrintingConfig.json          # Receipt toggles (JSON)
├── Setup-Printers.ps1           # 1-Click printer configuration script
├── logo.jpg                     # Bill header logo
├── sms.ico                      # System tray icon
├── TableDependency.SqlClient.dll
├── Dapper.dll
├── QRCoder.dll
├── Encrypt_Utils.dll
└── SqlServerTypes\              # Native SQL spatial DLLs (x86 & x64)
```

### 1. `PrintingApp.exe.config` Settings
Notepad mein open karke zaroorat ke mutabiq edit karein:

```xml
<appSettings>
    <!-- Default counter bill printer name in Windows -->
    <add key="PrinterName" value="BillPrinter"/>

    <!-- Logs directory -->
    <add key="LogFilePath" value="D:\\PrintingAppLog\\"/>

    <!-- Bill font sizes -->
    <add key="FontSize" value="9"/>
    <add key="HeaderFontSize" value="14"/>
    <add key="TitleFontSize" value="11"/>
    <add key="LineSpacing" value="15"/>

    <!-- Restaurant logo path -->
    <add key="LogoPath" value="D:\Projects\Majestic\Publish\PrintingApp\logo.jpg"/>

    <!-- Sindh Revenue Board QR prefix -->
    <add key="SrbQrUrlPrefix" value="https://srb.gos.pk/invoice?id="/>

    <!-- Customer receipt duplicate copy (true = 2 copies, false = 1 copy) -->
    <add key="PrintReceiptDuplicate" value="true"/>
</appSettings>

<connectionStrings>
    <!-- Encrypted SQL Server connection string -->
    <!-- Decrypted format: Data Source=localhost; Initial Catalog=rapiido_majestic; Integrated Security=True; -->
    <add name="Connection" connectionString="7pfzi3uBus26axx0sSkO3Bh9RW6QS7/VUMRYXnNGm1s0aVZiBxVnSfbnGtPs6eMua3f2gpPyQP49fkGv8Q0wbl8FPr+/43nQl4ET4U4mepxdIT7k65Xs9DwAgj1AZDjD"/>
</connectionStrings>
```

### 2. `PrintingConfig.json` Settings
Is file se aap receipt ke kisi bhi section ko live ON ya OFF kar sakte hain:

```json
{
  "ShowRestaurantName": true,
  "ShowRestaurantAddress": true,
  "ShowRestaurantPhone": true,
  "ShowOrderNo": true,
  "ShowOrderDate": true,
  "ShowCustomerName": true,
  "ShowOrderType": true,
  "ShowTableNo": true,
  "ShowWaiterName": true,
  "ShowDiscount": true,
  "ShowTax": true,
  "ShowSrbQrCode": true,
  "ShowFooter": true
}
```

---

## 6. Auto-Start on Windows Boot (Automated Startup)

Taake computer restart hone par Printing App khud ba khud background mein start ho jaye:

### Method 1: Windows Startup Folder (Easiest)
1. Keyboard par `Win + R` press karein.
2. Type karein: `shell:startup` aur Enter dabayein.
3. Startup folder open ho jayega.
4. `PrintingApp.exe` par right-click karein > `Create shortcut`.
5. Us shortcut ko is Startup folder ke andar paste kar dein.

### Method 2: Task Scheduler (Recommended for Servers / POS Terminals)
1. Windows Task Scheduler open karein (`taskschd.msc`).
2. **Create Task** par click karein:
   - **General:** Name: `RapiidoPrintingApp`, check `Run with highest privileges`.
   - **Triggers:** New > Begin the task: `At log on`.
   - **Actions:** New > Action: `Start a program` > Browse to `PrintingApp.exe`.
   - **Start in (optional):** Set to `D:\Projects\Majestic\Publish\PrintingApp\` (Zaroori hai taake relative files mil sakein).
3. Save karein. Ab system boot par app silently chalegi.

---

## 7. Verification & Testing Checklist

Deployment complete hone ke baad ye checks karein:

- [ ] **System Tray Icon:** Windows ke taskbar tray (bottom-right corner) mein blue SMS icon (`sms.ico`) nazar aana chahiye.
- [ ] **Log File Check:** `D:\PrintingAppLog\Log-MM-dd-yyyy.txt` open karein. Usme ye entry honi chahiye:
  ```text
  [2026-10-14 21:45:00.000] Printing App Service Initializing...
  [2026-10-14 21:45:01.000] Table Watcher configured successfully.
  [2026-10-14 21:45:01.500] SqlTableDependency started listening on OrderMaster.
  ```
- [ ] **Test Order 1 (Counter / Dine-in Paid):** POS se order place karein. Customer bill par 2 copies nikalni chahiye (Original + `*** DUPLICATE COPY ***`).
- [ ] **Test Order 2 (Kitchen KOT):** Appetizers ya Main course ka order punch karein. Kitchen printer par KOT slip print honi chahiye.

---

## 8. Troubleshooting & FAQ

### Issue 1: "Connectivity Error / Cannot open database"
- **Wajah:** SQL Server service band hai ya Connection String mein database ka naam/server ghalat hai.
- **Solution:** Windows Services mein ja kar `SQL Server (MSSQLSERVER)` ko check karein ke Running hai.

### Issue 2: Order banta hai lekin koi print nahi nikalta
- **Wajah 1:** Service Broker database mein disable hai.
  - **Solution:** Run karein: `ALTER DATABASE [rapiido_majestic] SET ENABLE_BROKER WITH ROLLBACK IMMEDIATE;`
- **Wajah 2:** Windows mein printer ka naam aur `App.config` / Database ka naam match nahi kar raha.
  - **Solution:** Check karein ke Windows mein printer ka naam exact `BillPrinter` ya `Black Copper 80` hai (Case-sensitive nahi hai lekin spelling exact honi chahiye).

### Issue 3: Kitchen printer par print nahi jata (Network Offline)
- **Wajah:** Kitchen printer ka IP change ho gaya hai ya network cable loose hai.
- **Solution:** 
  1. Command prompt par ping karein: `ping 192.168.10.90`
  2. Agar reply nahi aa raha, printer ki self-test slip nikal kar check karein ke IP router ke subnet mein hai ya nahi.
  3. Router mein printer ki MAC address bind karke static DHCP reservation kar dein taake IP kabhi change na ho.

### Issue 4: Receipt par dish ka naam cut raha hai?
- Naye build mein auto-wrapping feature enable hai. 16 characters se lamba naam automatically agli line par indent ho kar poora print hota hai.

---

**Manual Version:** 2.0 (Updated with Multi-Line Wrapping, GDI Fixes, and TCP/IP Automation)  
**Maintained by:** Majestic Technical Team
