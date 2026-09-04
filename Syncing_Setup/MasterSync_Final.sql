/* 
================================================================================
>>> RAPIIDO: MASTER SQL SYNCHRONIZATION ENGINE (V3.0 - FIX FOR MERGE & IDENTITY) <<<
================================================================================
FEATURES:
- NO MERGE: Uses safe IF EXISTS (UPDATE) ELSE (INSERT) to avoid IDENTITY_INSERT conflicts.
- CONFLICT-AWARE: Uses UpdateAt timestamps for smart conflict resolution.
- IDENTITY_INSERT: Dynamically handles IDENTITY columns over linked servers.
- SAFE TIMEOUTS: Replaced sp_testlinkedserver with a fast temporary table query to test connection without freezing.
- REPORTING TABLES: Optimized for the exact 22 tables required for Dashboards.
================================================================================
*/

USE [rapiido_majestic]; -- LOCAL SOURCE DATABASE
GO

SET NOCOUNT ON;

-- =============================================
-- PHASE 1: INFRASTRUCTURE (LINKED SERVER)
-- =============================================
PRINT '>>> Setting up Linked Server (localVamanLink)...';
IF NOT EXISTS (SELECT * FROM sys.servers WHERE name = 'localVamanLink')
BEGIN
    EXEC sp_addlinkedserver @server = 'localVamanLink', @srvproduct = '', @provider = 'SQLOLEDB', @datasrc = '66.165.248.146';
    EXEC sp_addlinkedsrvlogin @rmtsrvname = 'localVamanLink', @useself = 'false', @locallogin = NULL, @rmtuser = 'nazar', @rmtpassword = '$t&@\/\/bE&Ry';
    EXEC sp_serveroption 'localVamanLink', 'connect timeout', '5';
    EXEC sp_serveroption 'localVamanLink', 'rpc', 'true';
    EXEC sp_serveroption 'localVamanLink', 'rpc out', 'true';
END
GO

-- =============================================
-- PHASE 2: METADATA CONTROL TABLES
-- =============================================
PRINT '>>> Configuring Metadata Control Tables (Config & Logs)...';

IF OBJECT_ID('Sync_Config') IS NULL
CREATE TABLE Sync_Config (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TableName NVARCHAR(100) UNIQUE,
    PKColumn NVARCHAR(100),
    ExecutionOrder INT,
    IsActive BIT DEFAULT 1
);

IF OBJECT_ID('Sync_Log') IS NULL
CREATE TABLE Sync_Log (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TableName NVARCHAR(100),
    Status VARCHAR(20),
    Message NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- PHASE 3: CONFIGURATION (22 DASHBOARD TABLES)
-- =============================================
PRINT '>>> Initializing 22-Table Configuration...';
TRUNCATE TABLE Sync_Config;
INSERT INTO Sync_Config (TableName, PKColumn, ExecutionOrder) VALUES
('AssignTable','Id',1), ('Bank','Id',2), ('BankBin','Id',3), ('Category','Id',4),
('Customer','Id',5), ('CustomerFeedBack','Id',6), ('DeliveryDetails','Id',7), ('Department','DepartmentId',8),
('DriverDetail','Id',9), ('FlightCustomerBanks','Id',10), ('FlightDetails','Id',11), ('Item','Id',12),
('ItemRate','Id',13), ('OrderMaster','Id',14), ('OrderDetail','Id',15), ('OrderStatus','Id',16),
('OrderType','OrderTypeId',17), ('PrinterCategory','Id',18), ('Restaurant','Id',19), ('TablesNos','Id',20),
('UserDetail','Id',21), ('Waiter','Id',22);
GO


-- =============================================
-- PHASE 4: AUTO-INFRASTRUCTURE GENERATOR
-- =============================================
PRINT '>>> Generating 22 Queues and Triggers (State-Machine Architecture)...';
DECLARE @TName NVARCHAR(100), @PK NVARCHAR(100), @Sql NVARCHAR(MAX);
DECLARE cur_infra CURSOR FOR SELECT TableName, PKColumn FROM Sync_Config;
OPEN cur_infra; FETCH NEXT FROM cur_infra INTO @TName, @PK;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- 1. Ensure UpdateAt Exists
    SET @Sql = 'IF COL_LENGTH(''' + @TName + ''',''UpdatedAt'') IS NULL AND OBJECT_ID(''' + @TName + ''') IS NOT NULL ALTER TABLE [' + @TName + '] ADD UpdatedAt DATETIME DEFAULT GETDATE()';
    EXEC sp_executesql @Sql;

    -- 2. Ensure Queue Table Exists
    SET @Sql = 'IF OBJECT_ID(''' + @TName + '_SyncQueue'') IS NULL ' +
               'CREATE TABLE [' + @TName + '_SyncQueue] (Id INT IDENTITY(1,1), RecordId NVARCHAR(100), OperationType VARCHAR(10), SyncStatus INT DEFAULT 0, SyncTryCount INT DEFAULT 0, LastSyncTime DATETIME NULL)';
    EXEC sp_executesql @Sql;

    -- 3. Resilient Trigger
    SET @Sql = 'IF OBJECT_ID(''' + @TName + ''') IS NOT NULL BEGIN EXEC(''CREATE OR ALTER TRIGGER [trg_' + @TName + '_Sync] ON [' + @TName + '] AFTER INSERT, UPDATE, DELETE AS BEGIN ' +
               'SET NOCOUNT ON; ' +
               'IF (SELECT COUNT(*) FROM inserted) > 0 BEGIN ' +
               'INSERT INTO [' + @TName + '_SyncQueue] (RecordId, OperationType) ' +
               'SELECT CAST(i.[' + @PK + '] AS NVARCHAR(100)), ''''UPSERT'''' FROM inserted i ' +
               'WHERE NOT EXISTS (SELECT 1 FROM [' + @TName + '_SyncQueue] Q WHERE Q.RecordId = CAST(i.[' + @PK + '] AS NVARCHAR(100)) AND Q.SyncStatus = 0 AND Q.OperationType = ''''UPSERT''''); ' +
               'IF NOT UPDATE(UpdatedAt) UPDATE t SET UpdatedAt = GETDATE() FROM [' + @TName + '] t INNER JOIN inserted i ON t.[' + @PK + '] = i.[' + @PK + ']; END ' +
               'ELSE IF (SELECT COUNT(*) FROM deleted) > 0 BEGIN ' +
               'INSERT INTO [' + @TName + '_SyncQueue] (RecordId, OperationType) ' +
               'SELECT CAST(d.[' + @PK + '] AS NVARCHAR(100)), ''''DELETE'''' FROM deleted d ' +
               'WHERE NOT EXISTS (SELECT 1 FROM [' + @TName + '_SyncQueue] Q WHERE Q.RecordId = CAST(d.[' + @PK + '] AS NVARCHAR(100)) AND Q.SyncStatus = 0 AND Q.OperationType = ''''DELETE''''); END END'') END';
    EXEC sp_executesql @Sql;

    FETCH NEXT FROM cur_infra INTO @TName, @PK;
END
CLOSE cur_infra; DEALLOCATE cur_infra;
GO

-- =============================================
-- PHASE 5: DYNAMIC SYNC CORE PROCEDURE
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[SP_DynamicSync]
    @TableName NVARCHAR(100),
    @PKColumn NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @RemoteTable NVARCHAR(500) = '[localVamanLink].[rapiido_majestic].[dbo].[' + @TableName + ']';
    DECLARE @ColumnList NVARCHAR(MAX);
    DECLARE @ValueList NVARCHAR(MAX);
    DECLARE @UpdateSet NVARCHAR(MAX);
    DECLARE @Sql NVARCHAR(MAX);
    
    -- Check if table has identity
    DECLARE @HasIdentity BIT = 0;
    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(@TableName) AND is_identity = 1)
        SET @HasIdentity = 1;

    BEGIN TRY
        IF OBJECT_ID(@TableName) IS NULL RETURN; -- Skip if local table doesn't exist

        -- 1. Get Column Metadata
        SELECT @ColumnList = STRING_AGG(QUOTENAME(COLUMN_NAME), ','),
               @ValueList = STRING_AGG('S.' + QUOTENAME(COLUMN_NAME), ','),
               @UpdateSet = STRING_AGG(CASE WHEN COLUMN_NAME NOT IN (@PKColumn, 'Id', 'UpdatedAt') THEN QUOTENAME(COLUMN_NAME) + ' = S.' + QUOTENAME(COLUMN_NAME) ELSE NULL END, ',')
        FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @TableName;
        
        -- Add UpdatedAt to UpdateSet manually to ensure it triggers remote updates properly
        SET @UpdateSet = @UpdateSet + ', [UpdatedAt] = S.[UpdatedAt]';

        -- 2. Execute UPDATE for existing records via Linked Server
        SET @Sql = 'UPDATE T SET ' + @UpdateSet + ' FROM ' + @RemoteTable + ' T INNER JOIN [' + @TableName + '] S ON T.[' + @PKColumn + '] = S.[' + @PKColumn + '] INNER JOIN [' + @TableName + '_SyncQueue] Q ON S.[' + @PKColumn + '] = Q.RecordId WHERE Q.SyncStatus = 0 AND Q.OperationType = ''UPSERT'' AND S.UpdatedAt > ISNULL(T.UpdatedAt, ''1900-01-01'');';
        EXEC sp_executesql @Sql;

        -- 3. Execute INSERT for new records via Linked Server (Handling Identity)
        IF @HasIdentity = 1 SET @Sql = 'SET IDENTITY_INSERT ' + @RemoteTable + ' ON; '; ELSE SET @Sql = '';
        SET @Sql = @Sql + 'INSERT INTO ' + @RemoteTable + ' (' + @ColumnList + ') SELECT ' + @ValueList + ' FROM [' + @TableName + '] S INNER JOIN [' + @TableName + '_SyncQueue] Q ON CAST(S.[' + @PKColumn + '] AS NVARCHAR(100)) = Q.RecordId WHERE Q.SyncStatus = 0 AND Q.OperationType = ''UPSERT'' AND NOT EXISTS (SELECT 1 FROM ' + @RemoteTable + ' T2 WHERE T2.[' + @PKColumn + '] = S.[' + @PKColumn + ']);';
        IF @HasIdentity = 1 SET @Sql = @Sql + ' SET IDENTITY_INSERT ' + @RemoteTable + ' OFF;';
        EXEC sp_executesql @Sql;

        -- 4. Execute Remote DELETE
        SET @Sql = 'DELETE T FROM ' + @RemoteTable + ' T INNER JOIN [' + @TableName + '_SyncQueue] Q ON T.[' + @PKColumn + '] = Q.RecordId WHERE Q.SyncStatus = 0 AND Q.OperationType = ''DELETE'';';
        EXEC sp_executesql @Sql;

        -- 5. Mark Local Success
        SET @Sql = 'UPDATE [' + @TableName + '_SyncQueue] SET SyncStatus = 1, LastSyncTime = GETDATE() WHERE SyncStatus = 0;';
        EXEC sp_executesql @Sql;

        INSERT INTO Sync_Log (TableName, Status, Message) VALUES (@TableName, 'SUCCESS', 'Batch Synced');

    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(MAX) = ERROR_MESSAGE();
        SET @Sql = 'UPDATE [' + @TableName + '_SyncQueue] SET SyncTryCount = SyncTryCount + 1 WHERE SyncStatus = 0;';
        EXEC sp_executesql @Sql;
        INSERT INTO Sync_Log (TableName, Status, Message) VALUES (@TableName, 'FAILED', @ErrMsg);
    END CATCH
END
GO

-- =============================================
-- PHASE 6: MASTER WRAPPER (RESILIENT)
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[SP_MasterSync]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Fast Connectivity Guard (Uses lightweight query instead of sp_testlinkedserver)
    BEGIN TRY
        EXEC('SELECT TOP 1 1 FROM [localVamanLink].[rapiido_majestic].[dbo].[Sync_Log] WITH (NOLOCK)');
    END TRY
    BEGIN CATCH
        INSERT INTO Sync_Log (TableName, Status, Message) VALUES ('GLOBAL', 'OFFLINE', 'Cloud connection check failed.');
        RETURN;
    END CATCH

    DECLARE @TName NVARCHAR(100), @PK NVARCHAR(100);
    DECLARE cur CURSOR FOR SELECT TableName, PKColumn FROM Sync_Config WHERE IsActive = 1 ORDER BY ExecutionOrder;
    OPEN cur; FETCH NEXT FROM cur INTO @TName, @PK;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        EXEC SP_DynamicSync @TName, @PK;
        FETCH NEXT FROM cur INTO @TName, @PK;
    END
    CLOSE cur; DEALLOCATE cur;
END
GO
