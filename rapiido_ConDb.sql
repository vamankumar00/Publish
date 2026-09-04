/***************************************************************
 * Database Backup Script: rapiido_ConDb
 * Generated: 2026-09-04 21:17:04
 ***************************************************************/
USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'rapiido_ConDb')
BEGIN
    CREATE DATABASE [rapiido_ConDb];
END
GO

USE [rapiido_ConDb];
GO

---------------------------------------------------------------
-- Table: [AppVersion]
---------------------------------------------------------------
IF OBJECT_ID('[AppVersion]', 'U') IS NULL
BEGIN
CREATE TABLE [AppVersion] (
    [Id] int IDENTITY(1,1)  NOT NULL,
    [ResturantId] int   NULL,
    [CopyRights] varchar(500)   NULL,
    [DriverApp_Version] varchar(50)   NULL,
    [CustomerApp_Version] varchar(50)   NULL,
    [WebApp_Version] varchar(50)   NULL,
    [CreatedBy] int   NULL,
    [CreateDate] datetime   NULL,
    [IsActive] bit   NULL,
    [IsDeleted] bit   NULL,
    [CustomerApp_Version_Android] varchar(50)   NULL,
    [WaiterApp_Version] varchar(50)   NULL,
    [CustomerApp_Version_IOS] varchar(50)   NULL,
    CONSTRAINT [PK_AppVersion] PRIMARY KEY ([Id])
);
END
GO

SET IDENTITY_INSERT [AppVersion] ON;
GO
INSERT INTO [AppVersion] ([Id], [ResturantId], [CopyRights], [DriverApp_Version], [CustomerApp_Version], [WebApp_Version], [CreatedBy], [CreateDate], [IsActive], [IsDeleted], [CustomerApp_Version_Android], [WaiterApp_Version], [CustomerApp_Version_IOS]) VALUES (1, 1, N'Powered By Strawberry Solutions Pvt Ltd hi Rapiido', N'1.0.1', N'1.1.1', N'1.1.0', 1, '2021-11-04 00:00:00.000', 1, 0, N'2.0.4', N'2.1.6', N'2.0.0');
SET IDENTITY_INSERT [AppVersion] OFF;
GO

---------------------------------------------------------------
-- Table: [CustomerInfo]
---------------------------------------------------------------
IF OBJECT_ID('[CustomerInfo]', 'U') IS NULL
BEGIN
CREATE TABLE [CustomerInfo] (
    [Id] int IDENTITY(1,1)  NOT NULL,
    [CustomerName] varchar(50)   NULL,
    [ContactNo] varchar(50)   NULL,
    [DeviceId] varchar(MAX)   NULL,
    [CreatedDate] datetime  DEFAULT (getdate()) NULL,
    [UpdatedDate] datetime  DEFAULT (getdate()) NULL,
    [ReferralCode] varchar(MAX)   NULL,
    CONSTRAINT [PK_CustomerInfo] PRIMARY KEY ([Id])
);
END
GO

SET IDENTITY_INSERT [CustomerInfo] ON;
GO
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (1, N'Syed Nazar Muhammad', N'03432147612', N'QZWxLL5cjVMcQScdoqJklQ==', NULL, '2025-08-16 15:23:29.750', N'873BB6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (15, N'zargham', N'03333123428', N'f4KEqe4RRoSM1jqcDi1kFN:APA91bGX76L92p1abOrD2K4OxrtAfMMBcbJy-OM0CmNiTSujZ7uDgFyoWBNavs5PopKMZw74mLyHz', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (16, N'Asad', N'03462768432', N'f37qEZOrTSuHarGngBczHh:APA91bHpYnKeYQ1RIzePkkQm7GSG92iddO4OGInNzphg0ZDCN77OWyAxRBSW64A0jX5rnoMtjUJamoG3a5fxPUyiJqaE0rOgUM2mN91U_xKf7d34dXkKFlM', NULL, '2024-10-25 06:13:14.923', N'32A31B');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (21, N'Arifullah Qureshi', N'03000301536', N'fpJMi3GWSeKnfxW79kPwrA:APA91bFBVBZgMwxU9HpNN4eKY1oes8xf2nw_ZqUbWy6hn__A8ukaySlHIRUsMQLm2MUXCq3yG5dZXzl803r4ltYc2k-DSsPq_907fMdbKS5qELWggTrk6b4dtyGc2kit92-ppN54_n_Y', NULL, '2024-07-25 09:47:53.370', N'0AD200');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (22, N'Arifullah Qureshi', N'03000301536', N'fpJMi3GWSeKnfxW79kPwrA:APA91bFBVBZgMwxU9HpNN4eKY1oes8xf2nw_ZqUbWy6hn__A8ukaySlHIRUsMQLm2MUXCq3yG5dZXzl803r4ltYc2k-DSsPq_907fMdbKS5qELWggTrk6b4dtyGc2kit92-ppN54_n_Y', NULL, '2024-07-25 09:47:53.370', N'0AD200');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (52, N'Rameez', N'03443559134', N'fx17pGf3Th-6DnxHpp2mAQ:APA91bH1KjuKy8S5b94upI0ZokVym1Udq2wZvhiIPm9V-CwZdxnWLGIYSbt-9010Tam4TJvAewYA9nHF_VDc5XfIeDs6gS1EaGahJe-TgAqEGXXDEkL2-rvzokXBTCr2QRoR19KcKzuB', NULL, '2024-08-10 12:36:20.880', N'1B59E6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (81, N'Shahmeer', N'03242817741', N'cbmcI0RCTi6L0qxVMEoUdS:APA91bFBIPKV5ntf9eUmADsYhH68UMWvHVq5nYI7vhrcp1mhTOERMC1JExSUDZW1q16K3upYxa2T4', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (92, N'Muhammad Adil', N'03212479849', N'eJ0Oi5zpLE1SokNy3Exn_h:APA91bHt8JzmrqLa9CZ1uPGDjeQy69S6huNFUaYXxWetg1-m6f3lqNn-mW-ORMJP-ZE-f0lQKym-cZuY63BVDtLZK5WAVp4vjqpfCMf1o_mAe9Q1fgPiBTfDDIwkRaQVK5EdL1kYIuVA', NULL, '2024-08-14 15:43:29.927', N'2443E6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (116, N'Zulqarnan', N'03432117733', N'flixsNCh1kuPgr5FQIazfa:APA91bGWzT5my8TC_zHznNHvHhurKcNoMYBZOVZsLL4VDh4jbJ1DYNboZzwi4ydKpQuTJtJD9CJrk', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (130, N'wajid', N'03432147002', N'fevPbtfgSKmzQbEZziiw-b:APA91bEWtlR1ITac2Em10XAt3p6U_SFTYWhQjp_p6ml45zzFRXB0JeWkTymLLeDJESgoCHceIVYbe', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (138, N'Usama Qureshi', N'03212813797', N'd17tl1-eCUHziAWnVmaWzH:APA91bHQUwfcpQrpmyPu9B9HdSHwR1l_P5bw0d0Ul9YrftinRwjeMQbANDLIFQaYD6lU6NwKBS_rL', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (139, N'Sohail', N'03213772571', N'fYBCWeXOUkr3qWj_wa-tKP:APA91bE6OIvQApM5Nc9lAhZf9Kd0gYVpeH-7wg4By_8u8N9U-zXugxY9mMbVosMD5ye--ZP8rGEfY', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (140, N'Hasan jahangir ', N'03406887186', NULL, NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (141, N'Fahad khan', N'03420978146', N'ci4KX423S2qZnjaPtCx2ox:APA91bG4H_vwYRz9qbvd-_G1SFMRu-ag_DnoTHK1wEdrBEiWOp_ccDjGRZapg1e_iZ-RTYOgwdLdG', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (142, N'Abdullah', N'03208282100', N'cTx82i7qVU48slqGTbSggM:APA91bF9IX6xuZCAZi-2N0ogfi95NnmSt-4m7ZomDH5wJ2mmrzVQD_kRkIcbiDxjmUkHaTqXaRUZA', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (143, N'Abdullah', N'03452730274', N'dgGeZv_IRKiH7SaSzVHLjj:APA91bHfWCUCW6CQm8iHnJX7-IYLwdq4suRrDvssjfmCj4Rsh1jFy1qZ9Ons-Vebq-5kg4GvQscbl', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (144, N'Hasan', N'03406887186', NULL, NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (145, N'Nas', N'03123333992', N'cjnqc7uy8kb3msu7dI6qpc:APA91bEUJwAB4SMptyZE-9c9S4aDX0OdiV_d1HTAKUJnvvWkVVot7sqN-jj361cX-pa8fVrZ5x9AC', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (151, N'Sehrish Amjad', N'03082222523', N'dq307u8sGk2kmLDJoHs0i6:APA91bEDms9OjE-OI0cKyHeC5cHoH3Cr1MhaFyBwwIJW7V8CjMPtiOxZvwMxyJuZK0pVVSehKXr6Z', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (152, N'Sehrish', N'03472222523', N'eXAa2z0CQ0P5ljqYwvlbWU:APA91bHQzWcC24mDrKF8KzXvfnSCFwIeMVXr_A2AkN3vX6mB8kqPm1wJ9X-TYkFBH_-VqdfHzrfTd', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (153, N'jehangir', N'03001333551', N'c3FBSRSJQXGlZC8ATBmMlx:APA91bFRjidhLM2AJhgfTXt8IpzAd58RPWRMI_o_kfSwmDHyi7bNpV2HLwti6Q1V3ZEGcihnhx6JN', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (154, N'Sehrish Amjad', N'03082222523', N'edf62DFHQ0CgiBTAyyZvhI:APA91bGiDR1PzvmsYp7hd7jGB_PZ3W6hN14EbA-fIBKlC9_6lm9zMwWMzcjQC5k2mg4AqVBOTzgNA', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (161, N'wasif', N'03352666368', N'dpscOmy-TSqEiBc_Q1ZfWa:APA91bGIyHu4339cXxJRPa5Fxr__hXbZuZqjBBN8Kw79ddh6kWxgqtScM-nZ2C1F_K9ZpnP4NJ9L6', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (164, N'syed ebad mazhar', N'03451391179', N'c_MqnanxTta1mOYlrC0D6W:APA91bFJw4hD9eRNbIKh0YeGEdOUJj0AhBsBTXBOy0Ve8hLjoVlX606rSaDI-kJ-U9JC-y_ababov', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (170, N'Fahad ', N'03218222327', N'c_O343AsCkEYkf31kbZ-XQ:APA91bGRuPYnbHolRvevAntwGzGv-2sbeWPGttLIKJYkyv8nAAMzZ-zfw50_P-mB3y6O63e-1D4rh', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (172, N'samar abrar', N'03342874552', N'f4mVDQ4vSXiCwRQdBKxDsr:APA91bF1DGfYZ69aPJtCMGiMLC9D998KMSg68aOWvYofAUlK2gwKBN6OiZM4Rdx5hlOZNpO0XSeoJ', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (173, N'Sajid Baloch', N'03361574839', N'enn6zAuGFUxyj787DQlY7H:APA91bGv61uZPTwXfSvdEEKVGiXPWxQUc0m_MqIFPZK-kNnG1AWhVvNozXjBFeS6t4M93pKUW18Cz', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (175, N'Hassan', N'03476600203', N'c5fev7wVS1mpFpTzSZq5pv:APA91bEb2vwFkbPv17ATevzzfSsiZpTdMNGMdzr-RvXE6Zs62xG--loweZJSYZq5J4HB-2orslz5V', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (182, N'Abdullah Aijaz ', N'03003201051', N'e7r_DWdgB0eCoCCq3qTDwi:APA91bE-aBvoZPjo5_0z8D0rsBe6YB4xyN-4leueiVhWKLJHLzxwO7cXgXjfZaKB3vtZcGrgYD2HL', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (183, N'Jn', N'03214358843', N'ce5LT0Ic2ksejX7tlpCMXr:APA91bFof9YoYoxPbAxYCzQF98lQ8QPUyhCP7lO1dxaM__WaH3Up-KIfigE1rovTDcPmk3ouFz7aI', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (184, N'Tawassul ', N'03033379393', N'cd00N6ZmPEonhtcOPKvZYb:APA91bG2R680HwQdmhvQwqkWpguNgyRJoQxiMcHE8mibs2LHE829gbXgIA6iD7LJl3MuoUUMjroVo', NULL, '2024-02-18 19:48:53.867', N'D53597');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (188, N'Ameen', N'03332633666', N'fVV9TwhjBUNZmZRCv3qAxC:APA91bGhtYFhtm7F-6RCKjokXBn4Mx7H2L-sPOIGjyd0bXJoYVo649AkuQ1kW__yu1OO2mowaYJUy', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (190, N'Sobia Hamdani', N'03332102900', N'cRV99g_RLUw8koUaPVXV-W:APA91bEM658OAn88EnI2mq4iGrgu6_2ldwwHcOLAamaBr1Ytp_UFwuEOmqKdftZ8bbYLt-KqVeGa-', NULL, NULL, NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (191, N'Fatima', N'03138228115', N'dW5Tb0eyE0u0jzql7tuDUd:APA91bHp-RuCcX641oli9nyjINy38bkkX5ho7VAPL14u7-vRClEo18D75zQtBLkKUtM1jylzXL7eK', '2024-02-04 14:52:22.983', '2024-02-04 14:52:22.983', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (192, N'ali', N'03312343039', N'cVNoQyOSQROT5ie5dbvTNE:APA91bGx0D8NwvFj03DwSSRRlqS30_zA2mnaIvESKcMinedymLUftFFanEoddYW4vwy4G7hLolDe9', '2024-02-09 18:37:18.973', '2024-02-09 18:37:18.973', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (193, N'Usman', N'03332372026', N'f_hudOf7dUVsvfLSsRONLo:APA91bFWrmVoeJ_cvFNi3L0TuqrYsnZ2HdimnWvZiaXZzohOsEMdGpfscpYjcVzwrjaKnJMMfCrxW', '2024-02-09 20:09:42.783', '2024-02-09 20:09:42.783', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (194, N'Liaquat Sagheer Chishty ', N'03322288972', N'cUN0-4HgS0-m1WKM1yNW4C:APA91bFGAksHSYTmzmM398HBK-BnG2PAo-L48oXHqBF1u3GcdnDrMEzJNDc9amuHLjsXez_H13ZFT', '2024-02-09 20:45:10.063', '2024-02-09 20:45:10.063', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (195, N'Uneeb ', N'03202409229', N'd_H74k1PQ074kP2rzQZfCQ:APA91bGh1XJ9c9atAcLICITxFWqPTKqRGioMwziiQHNHNXg4OjFyvlubBqzk4d0_ZR1nvhRLbiJAs', '2024-02-10 08:32:20.287', '2024-02-12 11:15:30.837', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (196, N'aysha', N'03353111584', N'ey5SI27CrEkYtGmctswEfs:APA91bHHoWL5dI6vHIWq5MykslO9_wWpzpp6n7vnVjljIfABkUUwQncySmjp2Bwn9EAMz8uvF0QYF', '2024-02-10 18:05:35.577', '2024-02-10 18:05:35.577', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (197, N'Famia khan', N'03323494033', N'eHrKLUNt4EYGq7JYnmtUkW:APA91bE7QEOZ3f0g7BL_SrHDocKSN_035ENx5x3VEIQX7uYZyClEOno5dWxvVLJ0879IPFxWU5JII', '2024-02-11 22:28:28.330', '2024-02-11 22:28:28.330', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (198, N'Syed', N'03432147614', NULL, '2024-02-15 13:31:02.407', '2024-02-15 13:31:02.407', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (199, N'Zeeshan Raza', N'03315580203', N'cV42Eb-4z09ykdrQ-B981T:APA91bH2c0-sPg0aFK-5IDFkxm3AW2KbKHab3ad6iVbVt8JqA0v-HXJgjWVhRoW8qH_GuYH6fquUh', '2024-02-15 20:57:59.940', '2024-02-15 20:57:59.940', NULL);
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (200, N'Farhan', N'03097900000', N'fQBVM2_CXEaIrfTaftVZV6:APA91bFf3nCPXkzVCLSB54OtDsiOzMPl_6SpmMpAr1NiG1bRcLL3PnuwqtZIUZ-457OLDimcEGaKD', '2024-02-19 11:58:21.457', '2024-02-19 11:58:21.457', N'5E0D67');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (201, N'Rafay', N'03432589632', N'dr6GFUDPiEqVmgIFRwzWra:APA91bErmhQG2RonjVU3lj4WDctpap4vFTZPMczWn-XQ6lWMGkpqh-SCqqFR7jegI4uH4Sa7AcoZY', '2024-02-19 15:25:34.247', '2024-02-19 15:25:34.247', N'07BB41');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (202, N'Farah', N'03432139870', N'dr6GFUDPiEqVmgIFRwzWra:APA91bErmhQG2RonjVU3lj4WDctpap4vFTZPMczWn-XQ6lWMGkpqh-SCqqFR7jegI4uH4Sa7AcoZY', '2024-02-19 15:27:25.140', '2024-02-19 15:27:25.140', N'5F1B4E');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (203, N'Paras', N'03432147999', N'c90yBWVBEkV0qFkpK3eyPT:APA91bHhSCEv4N4EDF2kBXyYyqkhCroYPfoMTg2Uuh1V32Bt7TYcl2Lim8Qf8AtqzMd5usHlTlv5x', '2024-02-19 15:34:08.310', '2024-02-19 15:34:08.310', N'C5499E');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (204, N'M.Ahmed', N'3333094438', N'dNdUE0txpkpnucoPowsPZh:APA91bFiUl13YxiqBykanPz4Wc3VeIhs5c6dumGYkeWvHa21uMIrerOfR6YOrmslkTdMpCkWRvo82', '2024-02-21 10:11:02.480', '2024-02-21 10:11:02.480', N'ED4707');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (205, N'aabi', N'03331233924', N'dbBRtp8USSycwHMsBaS9j2:APA91bGXwMW0fpCsaPEP0SDPZVQ2itUStFn6V_h8QKtYEnZt6-ly-iavd47p6V4Ahy-DNLc6iw_uY', '2024-02-25 00:53:43.063', '2024-02-25 00:53:43.063', N'FE3E11');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (206, N'minahil ', N'03370686816', N'dnZP1r4hSku_4fwO4nEKou:APA91bFo4JVSSJPF12Og0wt9ZApryV5msw-Tx2ZnPhkl75ctuCw2hZlyxXSvMpQ5ycJ1qN4b6zj6Q', '2024-02-26 09:21:56.263', '2024-02-26 09:21:56.263', N'842714');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (207, N'sana', N'03333549366', N'fJIpK3SWSDiPBVNp_u7B-N:APA91bFXf5YhJsM_CG5DYKh61bGiscmRoxKDxn33P9_1ciULOJcZ1ytLKWgbQWxIH2KD1nWmQs967', '2024-02-27 10:55:45.820', '2024-02-27 10:55:45.820', N'76E9D3');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (208, N'Muhammad Zarar Khan', N'03158859849', N'eqVXDs2gT05VsSZ5StnEcL:APA91bEl_cIawCms6RYNTkqSwIZ7eiuj2WPmkUBr73C1lEyD_QGRTTus0wMbBV9zaxMCtRFYppfn8', '2024-02-28 23:46:25.327', '2024-02-28 23:46:25.327', N'2FFBDA');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (209, N'Rahim', N'03000933401', N'eB8hWhcTDki8rYyxHZPNRr:APA91bEp0AykLc2CjrLNLs26_74u65yzdVjhmjkeyriol6JXWFNI0j_Mfz-JGTdF2x8vOz5x_wu_5', '2024-02-29 03:06:50.790', '2024-02-29 03:06:50.790', N'655E31');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (210, N'Areeb', N'03202209561', N'erpldOV5QfSCYGRHxjsBnT:APA91bGyFe3w9j4FNgKR4EE3ihBkt_xdjbmpjKaD7b4dZzPPuuLwzV-9cOYJo2cKoS0mRmCy3JM87ObgouWUFTL5I4Nx1_XKmNzQBkd466vVNMP7fJVl7kw', '2024-03-03 16:21:11.237', '2024-12-19 11:59:21.007', N'43BF1E');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (211, N'Aamir', N'03468222000', N'cHOfMrgcLEEkr0NKOj6hXJ:APA91bFP3C2D9GlyuzRDQZH4CgGbPAhGd0HRKIZZzyC7yU7KEVHwO3gYTm0qbPll-o5X65NNv5E96TasGgG44HRAVvtv9fETiRRp4KUqBTeP-FTNiGlLmEPNMTZqyJCnyNGuZ5z-_Rbj', '2024-03-05 20:37:11.550', '2024-03-05 20:37:11.550', N'E07D77');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (212, N'Sana aamir', N'03218222000', N'dDAruL28gkXjtOOl-VmRWB:APA91bG4gBa-XuNY0A_tM7oLW2wjIzwFAF3sSUXWQA_Kwadszkr0TP7pXJCdx2nkhQa7l4nMMtIvA457VKTvNXoRHCOoa0Zzx7BSEKW7aWpWYG9cXS3qPPZGWhtL92q4BNGew9x23P8c', '2024-03-05 23:18:27.843', '2024-03-05 23:18:27.843', N'3E5FA8');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (213, N'hammad ', N'03343638959', N'fYRJOXtMRc2FwCYaA3s6O9:APA91bELWFJflzkTt754nl0RfznWlPPoBCk86rw2YHKwpix-8vH4ctTJFeKl3ogWeYzeP2GK1wYXU7JI2yuUIsIAfzY_eEIdU-sVhf8xEJEXtkEZkaVp8xTWCJWT8MnR7Kg6_jZ2_lvb', '2024-03-26 19:39:56.177', '2024-03-26 19:39:56.177', N'E95CCF');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (214, N'Mir Shaharyar Jakhrani', N'03153179243', N'f0EUb5QB3UPziX8tod6dgp:APA91bHT8BZj2Aw38USRLxcmCSjTrPh2udcb7UPEtydg7AsnkQBDXX918SoTtd_h5X9nbRF6tvp4Pdl7FoIbLpnbGnZMVSIDimQpUkCstcEjcWxCSWyIMaI4RWtbKCMvJ14MyeBnDElm', '2024-03-28 18:49:34.740', '2024-03-28 18:49:34.740', N'0F7D6A');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (215, N'Aditi', N'03003401213', N'dzPMXS5FmkS4iD4qhI03Zq:APA91bGmVjXwdngctGBna2YDJSOTCBlTrIXf2IiXga-ty8XPRU4Q3zMP7S8kCW0s3XZqjk9mEcALA_6tmY9GJeInMjqgMF7kA0ERxgaANxXdfccfsXzggE1v4k6cpi13pna4_4H7PXSH', '2024-04-06 15:30:41.860', '2024-04-06 15:30:41.860', N'DC529C');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (216, N'Yahya', N'03335211706', N'dYaDNF6RQ2aMfw1HwNUi8T:APA91bHV4FWZIIko661-iRtsZ3jCFBef36Ks8E4UgMpaBvZLy4EmZ4aMm85uwpKGcFnmQZpWDBH-McI1YuW9mmI4figVUVPtUuzSNQXKMJM3WTXS2udYKJqtVxJ9jT-OR7au1FjxbIF3', '2024-04-07 02:22:26.237', '2024-04-07 02:22:26.237', N'60E382');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (217, N'Bilal Hussain', N'03313188536', N'cchZ1yEVw0Bxlce3uVc9vh:APA91bH7GkjnTTZ1tkisBRt7WIGZ5i5QiUy-oRCrO1xOV066L6YCGVtcDNIV48wHAgvw1ORRpWhJ2RsqdpXICLG7qK9zLfx4DUJ-3T0toWOm06JkNMTL4kJsfBfL-xciYSKLIBBQ3G7l', '2024-04-25 15:45:39.740', '2024-04-25 15:45:39.740', N'33C525');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (218, N'Mareyum', N'03341177700', N'cIkv-OhcHkYLjW_DvhZVrF:APA91bE644LCu1T5s1fs_VwKrVE3EudMd1SS0l8TqjP1eEX-Md6T9D61iDocR1Gp32WnsEbXn8CIwXWRPpVi7fIJoRfLMWXYnwiBUNExgWIrxTV6AnTxWZITq-BBWhgaZg52UMM_ndbd', '2024-04-26 01:55:01.457', '2024-04-26 01:55:01.457', N'97E066');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (219, N'Nasir usdin', N'03002945873', N'cz17cuK-TJS4uVnXse2A9s:APA91bF6OIYOx2rB7aVAruOpy2L3LtDsTW94-oRZEIqDaEqNrno1NDAcBeKeW87etTaNwyE9SM4RbyJVqKur1_2bKSnZa1G0QstigYxjetriF3E2meCpY32N19EhVZFBk1lk76ocrPFN', '2024-04-27 09:26:30.250', '2024-04-27 09:26:30.250', N'479CD4');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (220, N'Ayesha ', N'03333637991', N'fvbkLK-wB00BvJdXpRK1c-:APA91bHAx1r0pGkW-Bx7Cmyw6uLmOyJv7Ua90ATyurtq7VPAl3a4v7DBXnXW9g7yejNj21JII3aISGAsaWXPHY-bt-lltXNhdTYBc7ZL-F1P9_DK9XoKWRCY5iLT1lnCbk6RORPu_fPm', '2024-04-29 06:46:16.233', '2024-04-29 06:46:16.233', N'43C2BF');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (221, N'Ayesha', N'03328947957', N'fQs9k6jVzEQ1jegUzfqY6G:APA91bEUizIHhxkNVZbChj09m0KQ8gruRwUEonNatjI8-zaZ7O2pkEAPQKVu8u-u1W7Tvl2brnS7w8B7r-KFG8p6_5AbSyQiPAn32xrwyO53hBpdhf14h_DcQiWXrJto_M2ZRO71cNwG', '2024-04-29 22:59:36.123', '2024-04-29 22:59:36.123', N'93DBAE');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (222, N'Farheen Siddiqui ', N'03212929050', N'cv3SzhRPFEyMogtViBUNv-:APA91bEyRvkR61d0Adror74AlYqMtDYUrL8j2x7qeJ1kIqY7SGyNoKw5oAr52jfxdT3hzK2w0cmZ4exxKO8Oh1LHARdvJHrjveFfgwXYpZZVClvH7LKTZD31RrIDzM-RZSMdpaXt_nXG', '2024-05-01 04:40:59.970', '2024-05-01 04:40:59.970', N'1F21A6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (223, N'Qandeel', N'03363087694', N'dDipewXexk9ot_c6jheuUJ:APA91bGyGi9P1y65Dru-gOfhbzS8WdTAxdNRzblVKxUoOLDVbqushbrCeQBSBhgEyRg5Na54WRiLuCpseKC7swndZgaNZoxO51Humg0NmkHLO-76zMXpFmQH8o4plWR5ra4qkmwqow80', '2024-05-01 06:32:16.350', '2024-05-01 06:32:16.350', N'6B81F0');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (224, N'Abdullah', N'03222857199', N'ezv5C03skE4opUikCLZJh-:APA91bHn5TLYWgqwm-5iKso4PLVTzw4Pa00BTVBCBOrqvcAyHR5aWx5FP28wJgA5jCqdZIgZbIfq4w6eP6SGNSNT1yP9XQ09C_LBCY0pt78ZiF3iirB08H_DHy20GXHWN9XVNxualnq2', '2024-05-02 02:10:10.220', '2024-05-02 02:10:10.220', N'77F63D');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (225, N'Faraz Baig', N'03212837551', N'eA_HnrnaF0ebuBRqETf6n3:APA91bFFba_0t0_weVXw0Xju4ujrTkQA6jK_cWMsgS0j3q94j3hRhwy1S2ms921NdTap11LTj259sHASMVOviFdZ0XbNYq7s8fMpL1UBMaN9cK62DIgLeb9GXVsO-pAjGYV-aHCSrj_z', '2024-05-05 00:38:55.610', '2024-05-05 00:38:55.610', N'6CC52E');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (226, N'Habiba', N'03072349006', N'fZDb7LiTfkzwtGcJ1TrCrr:APA91bFI0QG_IcLk9M_VfXxRbrVL53TLig0Q-HuZpMDecAcgFiyW3CpLsDrURqnjAoZLEKhplZvzbvECYi1zusyeRRCXf2v9LYu43IauukSAmgv1B1vctE2F_w2sf7OUhNdAnQeMYt4A', '2024-05-10 13:11:46.620', '2024-05-10 13:11:46.620', N'C886C0');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (227, N'Nasimaqsar ', N'0321820778', N'ckUHpbEdBkpKqap4DkpDZl:APA91bH4YsxnYc15OQWsKZWxICdk3PkvK6d5nlnlAJjxxpUpaDtf3HpQQrtkLng6SQjgy7naVuR1wrebxYyHteTVAlu65WO4tyI4di_0vrC3hZTAPhsAKEBwR1TH9K0h5laNlkGeS-99', '2024-05-10 14:04:02.680', '2024-05-10 14:04:02.680', N'3104FF');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (228, N'Test Saleem', N'03432123456', N'fBwYmjiiRSGomwygPCrfsa:APA91bGYr7fcK0W7d1YufuJNFeL98Y2PiOCy0pLFrYxlNTAZzKW_WdBZS0vVk4sKa77BAhijLURU3348x5Ok0r6OLup5pZApITHMymjeEzdnbOPZanLNxC31ZW_qPfQhGOEaqB8jkIgp', '2024-05-15 04:04:16.990', '2024-05-15 05:42:55.023', N'C47B0D');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (229, N'Test Wajahat', N'03432012345', NULL, '2024-05-15 06:19:41.260', '2024-05-15 06:19:41.260', N'183A94');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (230, N'Mir Nauroze', N'03332778841', N'dh8shcB1wED8qJ7hfjdbah:APA91bG0fyoDsIi7ugWI3teMS1dxfYwCyIF8tnGAGqNNTHs8fjwyZr1beBWij6DreKXFrdHic5ouxXouEpN8sZDoi2taq9Zj_KbO4D73VnXp7QSVZ_PnR9X1ygCM6bn-F4W8nhppxUut', '2024-05-18 08:02:51.613', '2024-05-18 08:02:51.613', N'DD01D2');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (231, N'Daniya Ghazi', N'03232457629', N'ehroBABNrUl7nonc6Je9w4:APA91bFeJb4XiDIyB7GpOxN1hptOJJ-IkcwgfmhwP2vmk0mi7247Yz_s8Lg5YN4UUW-EKw3LqrseICj-3eva-9XW74dOIZ7QHZz3fWh4vqdLexys4Q1zHVF5LLiERaENY90xWntpAmlt', '2024-05-20 17:27:45.837', '2024-05-20 17:27:45.837', N'D78547');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (232, N'Ibrahim ', N'03262375701', N'doUjW_YYQUyLnEEHYNPjb0:APA91bG7iGEKmr22Q0n03IwlOQGsie9vdnR-5gWLosA7Ghf5JMJGL6qow7Ry3TCSLfR5ZZcCPXUSxseT2Rlkuq1NNmFjF13aRXPPLN0leFvCegv-RjA8cuJ_PgVfDKyw8yGIPzIrythZ', '2024-05-23 08:39:54.050', '2024-05-23 08:39:54.050', N'AC2337');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (233, N'Anoosha ', N'03332001425', N'cl6RJMopJ07HqTC4jMP-WR:APA91bGvR90rBW8NdY27lxTMT_kKkcya3XT0igMHb2oefyo3zR6_IiHuKMCO8_mOGW5aGqQdaSvnz339EFEDkbjgxjRdQ3lqi-xqH8ggvOPccO-aCuNSGuNOn_dmHUAtvS0GgQKC_TnJ', '2024-05-27 06:48:12.817', '2024-05-27 11:11:29.473', N'A16ED0');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (234, N'Farina', N'03002761688', N'd_BtY6CoqUwSo4mSk3Tb1S:APA91bEdb9Zpph9aeaiWLAgC4TlgmNls09JcAglGcC-yjtILBhulJ9RHXjuVx-o095_OqB7GQzfF_gTIqFZcyQsYRwoP3Sq839e4jHZJgB1WqJZALMwNJQlXuUuuRPd21oxt1f0sEhFL', '2024-06-01 09:06:44.140', '2024-06-01 09:06:44.140', N'F6008A');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (235, N'Fozia Parveen', N'03337017844', N'fyyZcLoXTmSVRFmm9dcxWZ:APA91bHx_MPg1Po5gkEWsGNItiqdHs9zhu9VQOf5keMIVUPuEFq8yK_EsQedwim1kuYIL3mGQzlUsbaA0G2hfAP7vZnOs6myhDfGys12KQk01DrLAKg_-rNAbKGOEB39tuMJqV2V-rkl', '2024-06-02 00:37:28.930', '2024-06-02 00:37:28.930', N'ED2297');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (236, N'LIU SHUAI', N'03128866666', N'e0mhi0N7RWG7bOrf_E9EUk:APA91bECfFMnVOINzpmyT1uJb75a_jtHNm08tQRXp40-_rGe2QRCMIaW5p6MVGK3bNqWNUrbC8vE1Hj6nJvjeUqaRpCY43k49cjGC76lAg8fkBlElfutTLQDjUzcdxZoYc39hj0rhRfC', '2024-06-02 06:25:57.547', '2024-06-02 06:25:57.547', N'0F8E60');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (237, N'Maryam', N'03353119858', N'fn4SCyDSZkGXtjDHmnmATR:APA91bFL1E0-mgZz4B6y4nuYqMurd9tWmGjWJHv8_5wBxZKl6LLCKFQp3tkYt2Bo3J1KDgPx_HYyXuGGHnAskb52OzYcOBwDUARw5OibWQWQfg4F3z_evNd_wq-zolEUmqlCa3PHqofe', '2024-06-07 13:46:45.470', '2024-06-07 13:46:45.470', N'E451D9');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (238, N'Ali Hassnain Memon ', N'03312426999', N'dGGuabKYTemg-Iov28Cret:APA91bHvvJhNgB7oud6hj9sov485YpN_nqVm4b0IgvJNbKp4gpmLcXEuFuYikHrki7oJ3FDiAcYv1YickJp8EnERGjeuVtIvb0AxvWpsWEp_hdVaEV6L8mXKkBSjiimkgomQSkx26eSH', '2024-06-27 00:14:03.430', '2024-06-27 00:14:03.430', N'44F177');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (239, N'Ali', N'03313609559', N'cWgdNVCOUkdSlAC2lOjdag:APA91bF1y6PPLz1Pc5Mjx-Yf2EcCBqDI5Hkd9zWAO7w96Bkmhd4ZBSNKHq65KcBr_PsUgZ_mWgQVekYzMC4Tdi2uFW0j-51x89aziI8NQ1-ynwf_MPWZm2bVZWGjVrjzAz7EVDyNQtvD', '2024-07-02 10:00:49.147', '2024-07-02 10:00:49.147', N'EE1CC3');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (240, N'Adeena Shaikh', N'03362808615', N'fI6X62a_sUDrnpxUHQmsIC:APA91bH_rceWYNNiWt_-KtadbJ0SoX_8wSCZ76sVDGPd126YRxfV-Ep8PuDqA1NmtnkV9lSj2FXZ4kHHf2SviA4verVgbDTb7OldbX9vFW6Ptgnr_rqcLL-YEoaG0WgCD2peaVR8rOiH', '2024-07-02 10:52:47.890', '2024-07-02 10:52:47.890', N'ADE3A5');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (241, N'Rahul', N'03337253762', N'cLTjKyTOjkzGhEqtaSaPJs:APA91bHmVs9kkJoMgnI4VDAHUBD8_fPxSksItfEZApFxlIz8k5mtfTa4qVnC5G9zFZsq9mbzeQIWKA4lNTsnLcsZCuF8dS-ue4g39hw2LqiGWAXdyIu-fK9Xx8TagczWLls_0NwPK9kw', '2024-07-10 16:30:46.273', '2024-07-10 16:30:46.273', N'B45AB4');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (242, N'Imran', N'03212420146', N'exc3MyiPjEyKiT5QhpVChO:APA91bGE_WO7HWepPPlyMg8FkuvyDPHM4RA70W3bFifH9W7bNfT6SktWxi1epaJ6tIilIXQmxq_vzqxIj0eJ8_lymW1GgoR4YOYsZW6zz-aXEgONJb91HUevxYsHaoAiFg0OYLtqdGrX', '2024-07-15 08:44:48.157', '2024-07-15 08:44:48.157', N'F704B2');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (243, N'Rehan', N'03362847278', N'fVGmJ-e4iEvNuQfPcXiSZF:APA91bFIsB6lYLToqdLLJ9bVu1_1XtijGz1fQxMMxN3-ZpRQmVGt_6PszecLLnJ8vKGsscscImlJiLT3VWPl9XDw-18E7XUP5nM7lNCFt2UfcK1wJDLQ-syD2s6cSAC12RJ-nJm_O7Ye', '2024-07-19 04:51:35.083', '2024-07-19 04:51:35.083', N'E94488');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (244, N'rana owais', N'03342538521', NULL, '2024-07-21 10:26:06.767', '2024-07-21 10:26:06.767', N'A8ECC6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (245, N'Abdul Moiz', N'03059475274', N'f4zqlZiKTRuSzdVvWR685E:APA91bEiLwfUbJdwXGKWq9tVrQPupKC79UoHau753vk8Fn-b8Q56M3WXd0bfU4J8F3fWVjsyS2-33D7YKQcN2Gr4dyOX1803UbnSdwbRB3_OeKf6EikUSLGbXQ6Mx5DqyjdWUxlIERuT', '2024-07-21 10:34:21.987', '2024-07-21 10:34:21.987', N'EEB34C');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (246, N'Omer Jahangir', N'03224025555', N'do7xKE9RTP-_LLsG9rVOrI:APA91bHO4EMg3vYr5ojof38EPI8ehdr4HB0aj8Fx-t_7DOKwX8l0rDFjccQHSUiBMkmlPPb9VDJIDWePCrUlmPZnx4L3FUVkRgrDlA9V0VJQskLD7pWm4Gprk92P0UyC7lgeWxo85l0d', '2024-07-23 01:36:05.637', '2024-07-23 01:36:05.637', N'9FEA69');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (247, N'Zuhaib Khan ', N'03171066866', N'd0nai9BRTSm0-un_F-lji6:APA91bFA4u_40ZNCI-S1C6gBvKeWqJPquvFl53UV7cgMM8nvqfqtw7ilXjPdZQK0VxtgFCxUc-Srspy9iMZ3rZqNN5dcMBwUI6CNq5aYvGNy3aQ0Wvca5BL5m3LNvwkpNn0wkxrzILg1', '2024-07-24 02:54:51.887', '2024-07-24 02:54:51.887', N'ECF057');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (248, N'Misbah', N'03002344555', N'fLn6n574GEDSrA7JOl6xOH:APA91bHjOb0q103wlUN2ZM1uq4RGeOrYKlmlvxVCEkiOrNZR3ENw00vrqBlkieKVjTFbt9fHnLkRqrrD56HwJ4AIxNPr9QCcvN6YUVxv9zkeqX3Neigq5icS6oUqTOFKxoOOlUy4FaDN', '2024-07-26 06:18:58.870', '2024-07-26 06:18:58.870', N'49586C');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (249, N'Abdul jabbar', N'03209269400', N'dxx8cdhXQGmxPOIbmUstWV:APA91bEFybJJlwGjP6-pEiKASuPJmZSz5cHOfb5kUHj0EWKxNFjBy0B2VrseqspaQ9TR08yWIBZf9Jkc5C1MQIvAu_1RobM4KHyw8OpA5DTJwiZ7LN3x6kWIpf4lpPEIXCLm984_pORA', '2024-08-09 00:03:55.130', '2024-08-09 00:03:55.130', N'F3B206');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (250, N'hammad', N'03002005519', N'e54XeMXYSRa2JOTq3mbL7F:APA91bGlgMn7S36cz04UVssAoOFQa6f6ydWIFNNC_NaCMjEdVN5XDFZsukXF_xReqHgkEOkOmuzEcKwMG9uCNDs9SrVY82JdDh50IbBOjre40ky1ZV75lQMvWR_nmQnBCkdJF4Dul06U', '2024-08-11 05:50:35.807', '2024-08-11 05:50:35.807', N'8B50D6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (251, N'Shoaib', N'03327872652', N'dgiUNwF7TQK4tN3gx341Ud:APA91bEe6HR5tLMx9Rgb9Hd0oLNa4A4LL-kI8IrVuRqdroxZQUiSJS4cGvokW0_jDNLQaK9zfPH1KaT87llRnctg32ZQ590ug1oeDD9RESJF3URlBxZb1c0c6sxpd8_Kn28oxQSNetxK', '2024-08-15 04:00:09.693', '2024-08-15 04:00:09.693', N'0566AF');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (252, N'Abbas', N'03330131866', N'exZAPPMp3kHBgw4ykS8aqG:APA91bG7vn388C8AT1wqLHQruYSyMEj2Xr6h47GJF7EKYB5QV8804ojUFKTuYE6z3cUrKWltcGt8J5vNs0e8HriV1lkmyh_1lBdNvy82BvHcQulYuTv2XX0u9TNN1Sd7_BCB_S1CAYKQ', '2024-08-18 10:10:18.547', '2024-08-18 10:10:18.547', N'E3D6DE');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (253, N'Faisal Hafeez', N'03323483285', N'ebvwcB21R3G3ZNKKET6qr_:APA91bF3WwmJlyulUc0RMaW-imxmtJfKuNaDW7_-6l3Q97KsWuhPdCatktisfhofuO0LnhTVoH1fFsXjAW_YjSJ_rDi_1oEqokbuiVgDCUC8ntDRJ3QpBB3LLHODHd4ie6sbjeDL5XRD', '2024-08-21 09:28:11.787', '2024-08-21 09:28:11.787', N'DCF175');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (254, N'Muhammad Usman', N'03212166287', N'epxYZNZqCEmoqz6JFSTbmL:APA91bFjM0VbfuYZg4rinB7ecRomVLqK9GsgAntVy5Kx4fbE0f_xo1z97gbYOoZUeDRNS6UPRpkYq_6-2D7PhHBII4xUFQkm0L3PjdVl-Vuq35xhnxS3Q8AHPxyqRxW8kjSRWZce8MIb', '2024-09-03 17:35:56.273', '2024-09-03 17:35:56.273', N'EA1B39');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (255, N'Iraj ', N'03243385623', N'eWuDGkKT4UTJnTb20A-hE5:APA91bFpN69wQZTzy3SRAS-QkclXt6lOZu9x1krY8-cPdMYCyKdmYb-_akkKZX6Jjaup9iwgdwyrfGKXX46C_8jiyAdmeVK5qo977m1tDP3DW9gzLSZ9QjUquGRWxbIdi86iiua5OA9z', '2024-09-05 13:13:52.153', '2024-09-05 13:13:52.153', N'B0CD21');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (256, N'zulfiqar ', N'03212410524', N'ed8VlfLoSueGxEL5YEfrnq:APA91bG957jQTj8lWocnKAaka-jsz45gqUWiGToNGnmv3alj48p93UpHUrLUrZZUf11H_CPBJIgPC4LiYKL--NEMww_Hyj7z17KpC_uC0F9wkV02nTjl3F2NhFCNKSAVb-ZNZxX0ZSGz', '2024-09-07 10:03:39.133', '2024-09-07 10:03:39.133', N'D88CFB');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (257, N'test user', N'03432158094', NULL, '2024-09-12 11:10:40.687', '2024-09-12 11:10:40.687', N'8C4616');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (258, N'UserTest', N'03343146464', N'dPPCKcKeS5aAt8pwW0Ipzn:APA91bG0gaLu4JxKCcypLhU-Ub_XEerw2w2DbirxRCDXk5yia3h0Tw3YPY7n-JN86UnZ3GgWhw1CutJ8oc5-K5E-SE8SGyL6qNRSkDtpGbQQEDJygeJS5Iv-VBqgCvmmAztAdUxMtibC', '2024-09-12 11:15:37.027', '2024-09-12 11:15:37.027', N'42EC22');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (259, N'Test Nazar Test', N'03432147615', NULL, '2024-09-12 11:23:52.823', '2024-09-12 11:23:52.823', N'1C9BF3');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (260, N'Uzair ', N'03463161984', N'fZ6We4hRQnKNYrQCqUpzYk:APA91bEvbNRyPJwWFgQtyoEMD6I13Y4ofS2bd9TD4c9ijJbLsy7vMea-WBHuJje-v07Dt-VKWZX6ymaI9uOmniwI8_HKfZTEy3bKz74eZeKwhGjolY1gJt3oe2i9DTVc-DOdF2oc2ZIj', '2024-09-14 14:43:18.863', '2024-09-14 14:43:18.863', N'DF75E4');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (261, N'kashif', N'03152847553', N'c657ppQcQV-n3nK3tTeF_T:APA91bHXrEbYgbJin8JexqovdVI8Aut6BuvbcGlwS-1yF3HEeP7LdqWM56Bso43Vw7oq_9MJszS3fQp9Hr9t0rRt6zOd7faZ3x_B4pV8Sp8OnF48Oq7NhAkVlKbzrHYqC9qj2lckTHXY', '2024-09-15 11:57:26.617', '2024-09-15 11:57:26.617', N'18B8B1');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (262, N'Moiz Shaikh', N'03403526400', N'd2-SR7IdTQmOjkhRIKJahy:APA91bFFyjY5bsp4EyxCJcbdD8M1QGtCQWYZDUGnnHNXaJMxIU_pYjfr9kWOk4vP9pfvdeVOC9G6en0i3kp5AtN5fbHmBXfX6-kQ0K6VaIGbV7vmuIVdZw2q9gGq4_hLY1Gmcfd8xwSG', '2024-09-21 07:13:37.263', '2024-09-21 07:13:37.263', N'51BA4F');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (263, N'umer', N'03213051639', N'dSmSaixGQ8yCkkGIwjfluy:APA91bHjqTyO2MOcxgVTi7sb7vvT7PrDoqllKoWgu2_PVg88MOxo3Ii92wWAGHv3SLp8Cmj7UeB-dOFG9S2rNa7FTDwZtgWPaYBTiwdR-YNXjYk2ALc0wqgwNz343Fjt3E7u8tot1V5p', '2024-10-03 10:15:18.357', '2024-10-03 10:15:18.357', N'2D119A');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (264, N'Salman Memon', N'03215549111', N'eRAOKJpaSZy3onTSjgWiix:APA91bFmadw357WlIjnA2VNJQvDEmOt7bktTqEU7hLMG0-gCUUXuvfdJbN49UPBZzQjv7ctXdxv6_ASY1uHM_Hw0x2M60fGH5kmJDpKsPrADRqIVAaCfgtQtQKFJjrrV_uBiMjWY8yUg', '2024-10-07 13:12:07.957', '2024-10-07 13:12:07.957', N'5E340B');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (265, N'sumaira', N'03212021096', N'cgOHyb7JcUwKpiqJ3wgOgT:APA91bEOjgkihLgGwTBMfIUPHDrRPqoWIyCXhE4vPKcbQBMDBBuNCRbndzQLGhywuatBUEzdl5CEqPUr-fTr0ATWf4rDGigU5aswodD_c-IpSjeFOnIKyg3Gw-X4L5HmL2VwqBddnX0X', '2024-10-08 05:15:38.570', '2024-10-08 05:15:38.570', N'C56FD0');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (266, N'Azeem Ahmed', N'03032354720', N'eErOSloORIqPJrXt68bFXr:APA91bEsP8MUKZtqhEJvBIkM_7LarDmhRMRXlDF6PNUpPP0wTGUdZCr3nFI7Pg14tMeaNOnKHTCHkXy1IRJ88N_GmbkAgX0teAQhRa0pfSQoSJtZSTBglskqMQNfKICIfzKUQEBrBDPr', '2024-10-20 09:38:35.877', '2024-10-20 09:38:35.877', N'BE86B6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (267, N'Shehryarhyat', N'03343823824', N'exN50FSdskWKuFgz5B9KjW:APA91bF0pydRODw-eWtrVeosVNQG-XB9j-UtjJvYnUb62ChmAYmwTgklJkOTe0mw-MaPCkMTnrq7sH-nCq_PB7WEpx9BlwjMPHdsiKKrwsVoEvPVYs0YRDE', '2024-11-03 16:33:16.423', '2024-11-03 16:33:16.423', N'8DCDE5');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (268, N'Junaid khan', N'03002704035', N'd1PNn-5HEEAVtHVWm0WkY-:APA91bHm5I7JFV0HrM68TpvakfEAhWENBwyE3MKJC9GuFXEnir0K4LJ6VSrM7xEPFGzRYLcnDNIT1AtmzXteZjgatvUdpS5bt5EfI8xzvX01xtoDlRzd_k4', '2024-11-04 04:52:38.310', '2024-11-04 04:52:38.310', N'51EA21');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (269, N'Haris', N'03432017610', N'fm1wwpa-TWK-oDlgXlh9MY:APA91bFq9daaYOB4Uwfty22lHnroSl0yM6lpRBpE5lLdHkWDfITZYAdqbmx8HAFkgsFU58xSn5h49L4yvi0f8cyrTxFGGgnpyq2YdwTB3s-EyK0PLMyMu2w', '2024-11-14 11:26:37.710', '2024-11-14 11:26:37.710', N'D8A6BC');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (270, N'rekha jagdesh', N'030024098604', N'ej1VH131TEWIly8waGLvLb:APA91bHD3wp14E4Gg_9iNXu7QLLdpEJ8lm28tsuTfMQJWybTaemRuGw9u9stCRhMOph2RrFzAbGVEFvp354zFbtsIokJRufNDxOVIDPtx_ErnCeHqVv382E', '2024-12-02 12:42:03.737', '2024-12-02 12:42:03.737', N'D24D12');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (271, N'Faisal Test User', N'03432141112', N'efAdwUcwTkElsmJmgn3BeE:APA91bF9IZSMSpos4QQFXBlRLPdHCHUEv0kDtEVOgw8WZMcWl2ihRqUbmgPNLcMAwjmLvN0kw_-LpC1GZiodlKJ6dFtqmfKjlbaHfSX9dsvThrmlYp6aMUo', '2024-12-06 13:52:13.417', '2024-12-06 13:52:13.417', N'4748FD');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (272, N'Test User 1000', N'03452121212', N'fhgzzHTDrkXDtS8L9B-Ofb:APA91bHrE6pT0g-Q4CHuyXe7hEQcjda4_zqwiVPHZq9tUY4hwdoJcccpgtwsk8ce-x0nEgUvm5yBytcNg0q-TPDeac7U7zcEg-lIaZHQ-emCTgr6LzgL4do', '2024-12-06 13:58:37.020', '2024-12-06 13:58:37.020', N'32A6D0');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (273, N'Test User 1001', N'03431212121', N'eBnGVwnWHEAukEydKIxt3n:APA91bH-0nm0WAVnldb9htvdFYLiaFUawAhUwc3nM5Bjv8vUH0YE3qa8gw-MOL0n8FqMq4d9PIsiEPDBsqlCOg7vC96Z7M7AhZfWbxYIMnLNJ7LTTC8SjDA', '2024-12-06 14:09:18.350', '2024-12-06 14:12:06.853', N'DCF4B6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (274, N'Test User 1002', N'03431212101', N'eBnGVwnWHEAukEydKIxt3n:APA91bH-0nm0WAVnldb9htvdFYLiaFUawAhUwc3nM5Bjv8vUH0YE3qa8gw-MOL0n8FqMq4d9PIsiEPDBsqlCOg7vC96Z7M7AhZfWbxYIMnLNJ7LTTC8SjDA', '2024-12-06 14:10:05.350', '2024-12-06 14:10:05.350', N'77F847');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (275, N'Test Userssssss', N'03452101012', N'doBKB2dYTxKzalp5tQWnnP:APA91bHLb2AzJFwkQhrDs7l123BDulgKa4X4H9VUv64HWY9JFHlpJ6Th2yvsZg4KqcAAALTdsb47KRe1AUYfEs4-_gftiYrPmpFYdEhY-9b5B4HjMnKEmbE', '2024-12-06 14:18:02.687', '2024-12-06 14:18:02.687', N'C2D827');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (276, N'jahanzaib ', N'03069143857', N'cJmtJdc0TsahX54FfHzq5W:APA91bFHKCcCmBdMULRz-1aRopCo_QKa5CSiTERPR3MXfT0u2N0APUU6Bq-EYf1e6N9r5z3NGRwpzDGSnZTWdFUtJ5K3xeANM2UexW8xsKsHQEbBhRPsOJM', '2024-12-06 16:50:53.113', '2024-12-06 16:50:53.113', N'A804AB');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (277, N'test user', N'917013900280', N'exMpEQV3SpW-i3dl9ObO2G:APA91bFaDku847L8Xw0iwmdhjlflQmPk3pqgwh7Z81vZFxE0OuSJ_djAL5oe3cxAKc_ntmivBjY7LqzoTZyuiHMAY03gA7OAfi1Kl7SDPhdVYTkOorW7u6k', '2025-01-07 10:50:17.157', '2025-01-07 10:50:17.157', N'4F99A3');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (278, N'Lewis', N'03432147619', NULL, '2025-01-28 17:21:50.520', '2025-01-28 17:22:17.410', N'ACD050');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (279, N'Warner', N'03452580147', NULL, '2025-01-28 17:28:31.650', '2025-01-28 17:28:31.650', N'C3085F');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (280, N'Boucher', N'03332580147', N'280', '2025-01-28 17:34:52.980', '2025-01-28 17:42:43.953', N'E487C6');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (281, N'Syed', N'03432147613', N'wRUffBsI8NW4UJEDLLusHg==', '2025-05-17 01:43:16.457', '2025-06-10 05:05:32.417', N'FD0C0F');
INSERT INTO [CustomerInfo] ([Id], [CustomerName], [ContactNo], [DeviceId], [CreatedDate], [UpdatedDate], [ReferralCode]) VALUES (282, N'MJ_100', N'MJ_100', N'test', '2026-06-28 01:18:19.410', '2026-06-28 01:31:45.207', N'A3DDC4');
SET IDENTITY_INSERT [CustomerInfo] OFF;
GO

---------------------------------------------------------------
-- Table: [DBString]
---------------------------------------------------------------
IF OBJECT_ID('[DBString]', 'U') IS NULL
BEGIN
CREATE TABLE [DBString] (
    [Id] int   NOT NULL,
    [Default_ClientCode] varchar(50)   NOT NULL,
    [ResturantName] varchar(5000)   NULL,
    [ConnectionString] varchar(5000)   NULL,
    [IsActive] bit   NULL,
    [AppImageUrl] varchar(500)   NULL,
    [Rating] decimal(16,2)   NULL,
    [RestaurantType] varchar(50)   NULL,
    [IsTableBooking] bit  DEFAULT ((0)) NULL,
    CONSTRAINT [PK_DBString] PRIMARY KEY ([Default_ClientCode])
);
END
GO

INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (7, N'AU_786_I', N'DEUTSCHES CAFÉ', N'tfy/eitK0weM8BWA40hxbw/YjbHaT0OQXlPy81CN+lKzZ7awMDSX5D/GCRnL6ijebnrzO6WCtp/H7+3jNCMc0cwF0gb+XwfRhk3xiEPorGqCcwwxULwvk/9yiiZ48vxl', 1, N'http://172.16.16.2:8010/Images/CuisineImages/fastfood1.jpg', 5.00, N'Fast Food', NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (9, N'CM_100_I', N'STRAWBERRY CAFE', N'tfy/eitK0weM8BWA40hxbw/YjbHaT0OQXlPy81CN+lKzZ7awMDSX5D/GCRnL6ijeSIwqr7rlhYCJByZ5GI1hFOHbHw13OMufK8r5xmVGWaoKiP9h0v8l8Qw417vYOhYZ', 1, N'http://172.16.16.2:8010/Images/CuisineImages/desicuisine2.jpg', 5.00, N'Multi Cuisine', NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (6, N'GP_100', N'AURUM FOOD STUDIO', N'9+Iy8SfLZHnSPvf+vp2ayiTgV2JbqWzPdOcr1OCy2arQy7Dgis9Gl/bJ4FdfPB1SArY3AXLBXQOoT2hMod9a0l59QyXdiCTcWpFuQ5yoeMq/focFuW5cm8ZqmL6CBWFKgdXLvE+ZqCxQyvcGY7ZcRZmbnRXqQdgysXtAhc8yexw=', 0, NULL, NULL, NULL, NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (2, N'KF_986', N'KARACHI FOOD', N'xmB2b1pWc12FWRd5gM+WZvEsOePL+owrbZ6tgNvt5WNlomPAN1vi1tSpCJxfB5KuN1TN37tslofTLhbwuiFLzKeTDCMa959dkyRLIIgdVng=', 0, NULL, NULL, NULL, NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (3, N'KF_987', N'STRAWBERRY CAFE', N'tfy/eitK0weM8BWA40hxbw/YjbHaT0OQXlPy81CN+lKzZ7awMDSX5D/GCRnL6ijemun2TiSLzScBnr712DBLvmv7soL9iSUC/U/Eileh3foLe0dXqzQz41ZLBV0a8Xc7', 1, N'http://172.16.16.2:8010/Images/CuisineImages/fastfood2.jpg', 5.00, N'Multi Cuisine', 1);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (8, N'MJ_100', N'MAJESTIC', N'7pfzi3uBus26axx0sSkO3Bh9RW6QS7/VUMRYXnNGm1s0aVZiBxVnSfbnGtPs6eMua3f2gpPyQP49fkGv8Q0wbl8FPr+/43nQl4ET4U4mepxdIT7k65Xs9DwAgj1AZDjD
', 1, N'http://172.16.16.2:8010/Images/CuisineImages/c4.jpg', 5.00, N'Multi Cuisine', NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (4, N'SC_101', N'SOUTH CITY HOSPITAL', N'', 1, N'http://172.16.16.2:8010/Images/CuisineImages/multicuisine.jpg', 5.00, N'Multi Cuisine', NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (1, N'SH_154', N'SAHAB SHINWARI', N'xmB2b1pWc12FWRd5gM+WZq435o4kFoGRe2y4DqffcTSefVmNFZBlqgUCFxakvEGyH9jC9E2Ym9XgMlC99ctMXP51NAUQ9tayXnWAC+Uc5/o=', 0, NULL, NULL, NULL, NULL);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (10, N'SJ_445', N'SUJING', N'', 1, N'http://172.16.16.2:8010/Images/CuisineImages/multiC3.jpg', 5.00, N'Chinese', 0);
INSERT INTO [DBString] ([Id], [Default_ClientCode], [ResturantName], [ConnectionString], [IsActive], [AppImageUrl], [Rating], [RestaurantType], [IsTableBooking]) VALUES (5, N'SM_100', N'SKY MAJESTIC', N'', 1, N'http://172.16.16.2:8010/Images/CuisineImages/multiC3.jpg', 5.00, N'Multi Cuisine', NULL);
GO

-- Stored Procedure: [SP_GetAppVersion]
IF OBJECT_ID('[SP_GetAppVersion]', 'P') IS NOT NULL DROP PROCEDURE [SP_GetAppVersion];
GO
Create Procedure [dbo].[SP_GetAppVersion]
As
Begin
	Select * from AppVersion
End

GO

-- Stored Procedure: [SP_GetConnectionString]
IF OBJECT_ID('[SP_GetConnectionString]', 'P') IS NOT NULL DROP PROCEDURE [SP_GetConnectionString];
GO

Create Procedure [dbo].[SP_GetConnectionString]
@Default_ClientCode varchar(50)
As
Begin
Select * from dbstring Where Default_ClientCode = @Default_ClientCode And IsActive = 1
End

GO

-- Stored Procedure: [SP_GetCustomerDetail]
IF OBJECT_ID('[SP_GetCustomerDetail]', 'P') IS NOT NULL DROP PROCEDURE [SP_GetCustomerDetail];
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[SP_GetCustomerDetail]
	@deviceid as nvarchar(100)

AS
BEGIN

select Id as Id,CustomerName as Fname,ContactNo as TelephoneNo,DeviceId,ReferralCode from CustomerInfo where (DeviceId = @deviceid OR Id = @deviceid)

END

GO

-- Stored Procedure: [SP_GetReferralToken]
IF OBJECT_ID('[SP_GetReferralToken]', 'P') IS NOT NULL DROP PROCEDURE [SP_GetReferralToken];
GO

  
CREATE Procedure [dbo].[SP_GetReferralToken]  
@ReferralCode varchar(100)
As  
Begin  

	Declare @deviceId varchar(MAX)  
	Select @deviceId = DeviceId from CustomerInfo Where ReferralCode = @ReferralCode  

	Select @deviceId FCMToken  
End  


GO

-- Stored Procedure: [SP_GetReferralTokenByCustomerID]
IF OBJECT_ID('[SP_GetReferralTokenByCustomerID]', 'P') IS NOT NULL DROP PROCEDURE [SP_GetReferralTokenByCustomerID];
GO
CREATE Procedure [dbo].[SP_GetReferralTokenByCustomerID]    
@Id varchar(100)  
As    
Begin    
  
 Declare @deviceId varchar(MAX)    
 Select @deviceId = DeviceId from CustomerInfo Where Id = @Id    
  
 Select @deviceId FCMToken    
End 

GO

-- Stored Procedure: [SP_Restaurant_All]
IF OBJECT_ID('[SP_Restaurant_All]', 'P') IS NOT NULL DROP PROCEDURE [SP_Restaurant_All];
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[SP_Restaurant_All]
	
AS
BEGIN
	select Id as RestaurantId ,Default_ClientCode as ClientCode , ResturantName as RestaurantName, RestaurantType, AppImageUrl, Rating 
	from DBString where isactive = 1
END

GO

-- Stored Procedure: [SP_SetCustomerInfo]
IF OBJECT_ID('[SP_SetCustomerInfo]', 'P') IS NOT NULL DROP PROCEDURE [SP_SetCustomerInfo];
GO
-- =============================================  
-- Author:  <Author,,Name>  
-- Create date: <Create Date,,>  
-- Description: <Description,,>  
-- =============================================  
CREATE PROCEDURE [dbo].[SP_SetCustomerInfo]  
   
 @customername as varchar(100),  
 @contactnumber as varchar(20),  
 @deviceid as varchar(MAX),  
 @NewCustomerId int out  
  
AS  
BEGIN  

Declare @CustomerId int

Select @CustomerId = Id From [CustomerInfo] where ContactNo = @contactnumber

DECLARE @ReferralCode varchar(6)
-- Generate a random referral code with a maximum length of 6 characters
SET @ReferralCode = SUBSTRING(CONVERT(varchar(255), NEWID()), 0, 7)

	IF(@CustomerId IS NULL)
	BEGIN
		INSERT INTO [dbo].[CustomerInfo]  
				   ([CustomerName]  
				   ,[ContactNo]  
				   ,[DeviceId]
				   ,[CreatedDate]
				   ,[ReferralCode])  
			 VALUES  
					(@customername,  
					 @contactnumber,  
					 @deviceid, 
					 getdate(),
					 @ReferralCode)  
  
		  set  @NewcustomerId = (select @@IDENTITY)  
  
		  select @NewCustomerId  
	END
	ELSE
		Update [CustomerInfo] SET CustomerName = @customername, [DeviceId] = @deviceid, [UpdatedDate] = getdate(), [ReferralCode]=@ReferralCode
		Where [ContactNo] = @contactnumber
		 
		set  @NewcustomerId = @CustomerId  
  
		select @NewCustomerId 
  
END  

GO

-- Stored Procedure: [SP_UpdateCustomerDeviceId]
IF OBJECT_ID('[SP_UpdateCustomerDeviceId]', 'P') IS NOT NULL DROP PROCEDURE [SP_UpdateCustomerDeviceId];
GO

Create Procedure [dbo].[SP_UpdateCustomerDeviceId]
@DeviceID			Varchar(max),
@Id					int
As
Begin
Update CustomerInfo Set DeviceID =@DeviceID Where Id = @Id
End

GO

