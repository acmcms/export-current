/****** Object:  Table [dbo].[c0ChartLog]    Script Date: 18.07.2006 23:53:09 ******/
CREATE TABLE [dbo].[c0ChartLog] (
	[itrDate] [datetime] NOT NULL ,
	[grpDate] [int] NOT NULL ,
	[itrDeath] [int] NOT NULL ,
	[itmType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itmGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itmFolder] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[itmParam] [nvarchar] (512) COLLATE Latin1_General_BIN NOT NULL ,
	[itrType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itrUser] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itrAddress] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itrLang] [nvarchar] (8) COLLATE Latin1_General_BIN NOT NULL ,
	[itrCountry] [nvarchar] (8) COLLATE Latin1_General_BIN NOT NULL ,
	[itrValue] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[cmLocks]    Script Date: 18.07.2006 23:53:10 ******/
CREATE TABLE [dbo].[cmLocks] (
	[lockType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockVersion] [int] NOT NULL ,
	[lockId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockDate] [datetime] NOT NULL ,
	[lockExpiration] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[cmShares]    Script Date: 18.07.2006 23:53:10 ******/
CREATE TABLE [dbo].[cmShares] (
	[path] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[alias] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[accessType] [int] NOT NULL ,
	[skinnerType] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[languageMode] [nvarchar] (8) COLLATE Latin1_General_BIN NOT NULL ,
	[commandMode] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Descriptions]    Script Date: 18.07.2006 23:53:10 ******/
CREATE TABLE [dbo].[d1Descriptions] (
	[itmCrc] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itmDescription] [image] NOT NULL ,
	[itmHidden] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Dictionary]    Script Date: 18.07.2006 23:53:10 ******/
CREATE TABLE [dbo].[d1Dictionary] (
	[code] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[exact] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[word] [nvarchar] (80) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Known]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[d1Known] (
	[guid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[name] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Locks]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[d1Locks] (
	[lockType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockVersion] [int] NOT NULL ,
	[lockId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockDate] [datetime] NOT NULL ,
	[lockExpiration] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Queue]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[d1Queue] (
	[queLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[queFormation] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[queBusy] [datetime] NOT NULL ,
	[queQueued] [datetime] NOT NULL ,
	[queText] [image] NULL ,
	[queHint] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[queDelay] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1SourceHistory]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[d1SourceHistory] (
	[logDate] [datetime] NOT NULL ,
	[srcLuid] [int] NOT NULL ,
	[hstIdentity] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[srcHealth] [int] NOT NULL ,
	[srcReady] [int] NOT NULL ,
	[srcAlive] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Sources]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[d1Sources] (
	[srcLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[srcGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[srcHost] [nvarchar] (50) COLLATE Latin1_General_BIN NOT NULL ,
	[srcPort] [int] NOT NULL ,
	[idxHost] [nvarchar] (50) COLLATE Latin1_General_BIN NOT NULL ,
	[idxPort] [int] NOT NULL ,
	[srcCreated] [datetime] NOT NULL ,
	[srcMaintainer] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[srcChecked] [datetime] NOT NULL ,
	[srcIndex] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[srcActive] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[srcHealth] [int] NOT NULL ,
	[srcReady] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[l1Tasks]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[l1Tasks] (
	[taskGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[taskName] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[taskOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[taskCommon] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[taskLastRun] [datetime] NOT NULL ,
	[taskLastRunLength] [int] NOT NULL ,
	[taskLastResult] [image] NULL ,
	[taskRunner] [nvarchar] (50) COLLATE Latin1_General_BIN NOT NULL ,
	[taskRunnerSettings] [image] NULL ,
	[taskRunnerData] [image] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[m1Locks]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[m1Locks] (
	[lockType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockVersion] [int] NOT NULL ,
	[lockId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockDate] [datetime] NOT NULL ,
	[lockExpiration] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[m1Messages]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[m1Messages] (
	[msgId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgOwnerId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgDate] [datetime] NOT NULL ,
	[fcId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[fcDataType] [int] NOT NULL ,
	[fcData] [image] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Dictionary]    Script Date: 18.07.2006 23:53:11 ******/
CREATE TABLE [dbo].[s3Dictionary] (
	[code] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[exact] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[word] [nvarchar] (80) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Extra]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[s3Extra] (
	[recId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[recDate] [datetime] NOT NULL ,
	[recType] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[recBlob] [image] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Objects]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[s3Objects] (
	[objId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[vrId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[objTitle] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[objCreated] [datetime] NOT NULL ,
	[objDate] [datetime] NOT NULL ,
	[objOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[objType] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[objState] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[extLink] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[umAcls]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[umAcls] (
	[path] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[groupid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[inherit] [bit] NOT NULL ,
	[permissions] [ntext] COLLATE Latin1_General_BIN NOT NULL ,
	[ucounter] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[umGroups]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[umGroups] (
	[groupid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[title] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[description] [ntext] COLLATE Latin1_General_BIN NOT NULL ,
	[authLevel] [int] NOT NULL ,
	[data] [ntext] COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[umUserAccounts]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[umUserAccounts] (
	[UserID] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[login] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[email] [nvarchar] (255) COLLATE Latin1_General_BIN NULL ,
	[passhash] [int] NULL ,
	[passhighhash] [int] NULL ,
	[language] [nvarchar] (32) COLLATE Latin1_General_BIN NULL ,
	[type] [int] NOT NULL ,
	[added] [datetime] NULL ,
	[lastlogin] [datetime] NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[umUserGroups]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[umUserGroups] (
	[groupid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[userid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[ucounter] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[umUserProfiles]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[umUserProfiles] (
	[UserID] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[Scope] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[Checked] [datetime] NULL ,
	[LastAccess] [datetime] NULL ,
	[Profile] [ntext] COLLATE Latin1_General_BIN NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[v0Votes]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[v0Votes] (
	[vtDate] [datetime] NOT NULL ,
	[vtGroup] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[vtGroupFixed] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[vtName] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[vtNameFixed] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[vtAddress] [nvarchar] (50) COLLATE Latin1_General_BIN NOT NULL ,
	[vtLanguage] [nvarchar] (8) COLLATE Latin1_General_BIN NOT NULL ,
	[vtCountry] [nvarchar] (8) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Folders]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[d1Folders] (
	[fldLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[srcLuid] [int] NOT NULL ,
	[fldParentLuid] [int] NOT NULL ,
	[fldName] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[fldCreated] [datetime] NOT NULL ,
	[fldChecked] [datetime] NOT NULL ,
	[fldCrc] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1KnownAliases]    Script Date: 18.07.2006 23:53:12 ******/
CREATE TABLE [dbo].[d1KnownAliases] (
	[guid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[alias] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[m1Inbox]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[m1Inbox] (
	[msgLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[msgId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgUserId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgPriority] [int] NOT NULL ,
	[msgRead] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[msgTarget] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[m1Queue]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[m1Queue] (
	[msgLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[msgId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgQueued] [datetime] NOT NULL ,
	[msgExpire] [datetime] NOT NULL ,
	[msgFailCounter] [int] NOT NULL ,
	[msgPriority] [int] NOT NULL ,
	[msgInteractive] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[msgTarget] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[m1Sent]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[m1Sent] (
	[msgLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[msgId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgUserId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[msgProcessed] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[msgTarget] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Locks]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[s3Locks] (
	[lockType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockVersion] [int] NOT NULL ,
	[lockId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lockDate] [datetime] NOT NULL ,
	[lockExpiration] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ObjectHistory]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[s3ObjectHistory] (
	[hsId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[hsDate] [datetime] NOT NULL ,
	[objId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[vrId] [nvarchar] (32) COLLATE Latin1_General_BIN NULL ,
	[objTitle] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[objCreated] [datetime] NOT NULL ,
	[objDate] [datetime] NOT NULL ,
	[objOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[objType] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[objState] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[extLink] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ObjectVersions]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[s3ObjectVersions] (
	[vrId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[vrDate] [datetime] NOT NULL ,
	[vrParentId] [nvarchar] (32) COLLATE Latin1_General_BIN NULL ,
	[vrComment] [nvarchar] (255) COLLATE Latin1_General_BIN NULL ,
	[objId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[vrTitle] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[vrOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[vrType] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[extLink] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Tree]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[s3Tree] (
	[lnkId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lnkLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[cntLnkId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lnkName] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[lnkFolder] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[objId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Items]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[d1Items] (
	[itmGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itmLuid] [int] IDENTITY (1, 1) NOT FOR REPLICATION  NOT NULL ,
	[itmCrc] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[fldLuid] [int] NOT NULL ,
	[itmName] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[itmCreated] [datetime] NOT NULL ,
	[itmSize] [int] NOT NULL ,
	[itmDate] [datetime] NOT NULL ,
	[itmType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itmComment] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[itmPreview] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[itmSearchName] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[itmLevel1Name] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[itmLevel2Name] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL ,
	[itmLevel3Name] [nvarchar] (255) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Aliases]    Script Date: 18.07.2006 23:53:13 ******/
CREATE TABLE [dbo].[s3Aliases] (
	[alId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[alLnkId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ChangeQueue]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3ChangeQueue] (
	[evtId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtDate] [datetime] NOT NULL ,
	[evtSequence] [int] NOT NULL ,
	[evtOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdLuid] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ExtraLink]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3ExtraLink] (
	[objId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[fldId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[recId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Indexed]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3Indexed] (
	[luid] [int] NOT NULL ,
	[idxVersion] [int] NOT NULL ,
	[lnkIndexed] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Indices]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3Indices] (
	[code] [int] NOT NULL ,
	[luid] [int] NOT NULL ,
	[weight] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3Recycled]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3Recycled] (
	[delRootId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[delDate] [datetime] NOT NULL ,
	[delObjId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[delCntId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[delOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ScheduleLog]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3ScheduleLog] (
	[scheduleid] [nvarchar] (50) COLLATE Latin1_General_BIN NOT NULL ,
	[objectid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[systemid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[ownerid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[schedule] [datetime] NOT NULL ,
	[name] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[command] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[parameters] [image] NOT NULL ,
	[result] [int] NOT NULL ,
	[resultData] [image] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ScheduleQueue]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3ScheduleQueue] (
	[scheduleid] [nvarchar] (50) COLLATE Latin1_General_BIN NOT NULL ,
	[objectid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[systemid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[state] [int] NOT NULL ,
	[ownerid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[schedule] [datetime] NOT NULL ,
	[name] [nvarchar] (64) COLLATE Latin1_General_BIN NOT NULL ,
	[command] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[parameters] [image] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3TreeSync]    Script Date: 18.07.2006 23:53:14 ******/
CREATE TABLE [dbo].[s3TreeSync] (
	[lnkSrcId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lnkTgtId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1ChangeLog]    Script Date: 18.07.2006 23:53:15 ******/
CREATE TABLE [dbo].[d1ChangeLog] (
	[evtId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtDate] [datetime] NOT NULL ,
	[evtOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdLuid] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1ChangeQueue]    Script Date: 18.07.2006 23:53:15 ******/
CREATE TABLE [dbo].[d1ChangeQueue] (
	[evtId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtDate] [datetime] NOT NULL ,
	[evtSequence] [int] NOT NULL ,
	[evtOwner] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtCmdLuid] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Indexed]    Script Date: 18.07.2006 23:53:15 ******/
CREATE TABLE [dbo].[d1Indexed] (
	[luid] [int] NOT NULL ,
	[idxVersion] [int] NOT NULL ,
	[itmIndexed] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1Indices]    Script Date: 18.07.2006 23:53:15 ******/
CREATE TABLE [dbo].[d1Indices] (
	[code] [int] NOT NULL ,
	[luid] [int] NOT NULL ,
	[weight] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[d1ItemLinkage]    Script Date: 18.07.2006 23:53:15 ******/
CREATE TABLE [dbo].[d1ItemLinkage] (
	[itmGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[itmLink] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3RecycledTree]    Script Date: 18.07.2006 23:53:15 ******/
CREATE TABLE [dbo].[s3RecycledTree] (
	[lnkId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[delId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[cntLnkId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[lnkName] [nvarchar] (128) COLLATE Latin1_General_BIN NOT NULL ,
	[lnkFolder] [nchar] (1) COLLATE Latin1_General_BIN NOT NULL ,
	[objId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[cmLocks] WITH NOCHECK ADD
	CONSTRAINT [PK_cmLocks] PRIMARY KEY  CLUSTERED
	(
		[lockType],
		[lockVersion]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[cmShares] WITH NOCHECK ADD
	CONSTRAINT [PK_cmShares] PRIMARY KEY  CLUSTERED
	(
		[alias]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Descriptions] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Descriptions] PRIMARY KEY  CLUSTERED
	(
		[itmCrc]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Dictionary] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Dictionary] PRIMARY KEY  CLUSTERED
	(
		[word],
		[exact]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Known] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Known] PRIMARY KEY  CLUSTERED
	(
		[guid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Locks] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Locks] PRIMARY KEY  CLUSTERED
	(
		[lockType],
		[lockVersion]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Queue] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Queue] PRIMARY KEY  CLUSTERED
	(
		[queFormation]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Sources] WITH NOCHECK ADD
	CONSTRAINT [PK_o1Sources] PRIMARY KEY  CLUSTERED
	(
		[srcLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[m1Locks] WITH NOCHECK ADD
	CONSTRAINT [PK_m1Locks] PRIMARY KEY  CLUSTERED
	(
		[lockType],
		[lockVersion]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[m1Messages] WITH NOCHECK ADD
	CONSTRAINT [PK_m1Messages] PRIMARY KEY  CLUSTERED
	(
		[msgId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Dictionary] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Dictionary] PRIMARY KEY  CLUSTERED
	(
		[word],
		[exact]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Extra] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Data] PRIMARY KEY  CLUSTERED
	(
		[recId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Objects] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Objects] PRIMARY KEY  CLUSTERED
	(
		[objId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[umGroups] WITH NOCHECK ADD
	CONSTRAINT [PK_umGroups] PRIMARY KEY  CLUSTERED
	(
		[groupid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[umUserAccounts] WITH NOCHECK ADD
	CONSTRAINT [PK_umUserAccounts] PRIMARY KEY  CLUSTERED
	(
		[UserID]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[umUserProfiles] WITH NOCHECK ADD
	CONSTRAINT [PK_umUserProfiles] PRIMARY KEY  CLUSTERED
	(
		[UserID],
		[Scope]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Folders] WITH NOCHECK ADD
	CONSTRAINT [PK_o1Folders] PRIMARY KEY  CLUSTERED
	(
		[fldLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1KnownAliases] WITH NOCHECK ADD
	CONSTRAINT [PK_d1KnownAliases] PRIMARY KEY  CLUSTERED
	(
		[alias],
		[guid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[m1Inbox] WITH NOCHECK ADD
	CONSTRAINT [PK_m1Inbox] PRIMARY KEY  CLUSTERED
	(
		[msgLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[m1Queue] WITH NOCHECK ADD
	CONSTRAINT [PK_m1Queue] PRIMARY KEY  CLUSTERED
	(
		[msgLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[m1Sent] WITH NOCHECK ADD
	CONSTRAINT [PK_m1Sent] PRIMARY KEY  CLUSTERED
	(
		[msgLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Locks] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Locks] PRIMARY KEY  CLUSTERED
	(
		[lockType],
		[lockVersion]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ObjectHistory] WITH NOCHECK ADD
	CONSTRAINT [PK_s2ObjectHistory] PRIMARY KEY  CLUSTERED
	(
		[hsId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ObjectVersions] WITH NOCHECK ADD
	CONSTRAINT [PK_s2ObjectVersions] PRIMARY KEY  CLUSTERED
	(
		[vrId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Tree] WITH NOCHECK ADD
	CONSTRAINT [PK_s2TreeLinkage] PRIMARY KEY  CLUSTERED
	(
		[lnkId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Items] WITH NOCHECK ADD
	CONSTRAINT [PK_o1Items] PRIMARY KEY  CLUSTERED
	(
		[itmGuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Aliases] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Aliases] PRIMARY KEY  CLUSTERED
	(
		[alId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ChangeQueue] WITH NOCHECK ADD
	CONSTRAINT [PK_s2ChangeQueue] PRIMARY KEY  CLUSTERED
	(
		[evtId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ExtraLink] WITH NOCHECK ADD
	CONSTRAINT [PK_s2LinkExtra] PRIMARY KEY  CLUSTERED
	(
		[objId],
		[fldId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Indexed] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Indexed] PRIMARY KEY  CLUSTERED
	(
		[luid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Indices] WITH NOCHECK ADD
	CONSTRAINT [PK_s3Indices] PRIMARY KEY  CLUSTERED
	(
		[code],
		[luid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Recycled] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Recycled] PRIMARY KEY  CLUSTERED
	(
		[delRootId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ScheduleQueue] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Schedule] PRIMARY KEY  CLUSTERED
	(
		[scheduleid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3TreeSync] WITH NOCHECK ADD
	CONSTRAINT [PK_s2Sync] PRIMARY KEY  CLUSTERED
	(
		[lnkSrcId],
		[lnkTgtId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1ChangeQueue] WITH NOCHECK ADD
	CONSTRAINT [PK_d1ChangeQueue] PRIMARY KEY  CLUSTERED
	(
		[evtId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Indexed] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Indexed] PRIMARY KEY  CLUSTERED
	(
		[luid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Indices] WITH NOCHECK ADD
	CONSTRAINT [PK_d1Indices] PRIMARY KEY  CLUSTERED
	(
		[code],
		[luid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1ItemLinkage] WITH NOCHECK ADD
	CONSTRAINT [PK_d1ItemLinkage] PRIMARY KEY  CLUSTERED
	(
		[itmGuid],
		[itmLink]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3RecycledTree] WITH NOCHECK ADD
	CONSTRAINT [PK_s2RecycledTree] PRIMARY KEY  CLUSTERED
	(
		[lnkId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

CREATE  CLUSTERED  INDEX [c0ChartLog1] ON [dbo].[c0ChartLog]([itmType], [itrType]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

ALTER TABLE [dbo].[c0ChartLog] WITH NOCHECK ADD
	CONSTRAINT [DF_c0ChartLog_itrDate] DEFAULT (getdate()) FOR [itrDate],
	CONSTRAINT [DF_c0ChartLog_grpDate] DEFAULT (0) FOR [grpDate],
	CONSTRAINT [DF_c0ChartLog_itrDeath] DEFAULT (0) FOR [itrDeath],
	CONSTRAINT [DF_c0ChartLog_itmParam] DEFAULT (N'*') FOR [itmParam]
GO

ALTER TABLE [dbo].[cmShares] WITH NOCHECK ADD
	CONSTRAINT [DF_cmShares_languageMode] DEFAULT (N'*') FOR [languageMode],
	CONSTRAINT [DF_cmShares_commandMode] DEFAULT (N'N') FOR [commandMode]
GO

ALTER TABLE [dbo].[d1Descriptions] WITH NOCHECK ADD
	CONSTRAINT [DF_d1Descriptions_itmHidden] DEFAULT (N'N') FOR [itmHidden]
GO

ALTER TABLE [dbo].[d1Dictionary] WITH NOCHECK ADD
	CONSTRAINT [IX_d1Dictionary] UNIQUE  NONCLUSTERED
	(
		[code]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Queue] WITH NOCHECK ADD
	CONSTRAINT [DF_d1Queue_queHint] DEFAULT ('*') FOR [queHint],
	CONSTRAINT [DF_d1Queue_queDelay] DEFAULT (0) FOR [queDelay]
GO

ALTER TABLE [dbo].[l1Tasks] WITH NOCHECK ADD
	CONSTRAINT [DF_l1Tasks_taskOwner] DEFAULT (N'MyX') FOR [taskOwner],
	CONSTRAINT [DF_l1Tasks_taskCommon] DEFAULT (N'Y') FOR [taskCommon]
GO

ALTER TABLE [dbo].[s3Dictionary] WITH NOCHECK ADD
	CONSTRAINT [IX_s2Dictionary] UNIQUE  NONCLUSTERED
	(
		[code]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3Objects] WITH NOCHECK ADD
	CONSTRAINT [DF_s2Objects_vrId] DEFAULT (N'*') FOR [vrId],
	CONSTRAINT [DF_s2Objects_extLink] DEFAULT (N'-') FOR [extLink]
GO

ALTER TABLE [dbo].[umUserAccounts] WITH NOCHECK ADD
	CONSTRAINT [DF_umUserAccounts_type] DEFAULT (0) FOR [type]
GO

ALTER TABLE [dbo].[v0Votes] WITH NOCHECK ADD
	CONSTRAINT [DF_v0Votes_vtDate] DEFAULT (getdate()) FOR [vtDate]
GO

ALTER TABLE [dbo].[s3ObjectHistory] WITH NOCHECK ADD
	CONSTRAINT [DF_s2ObjectHistory_vrId] DEFAULT (N'*') FOR [vrId],
	CONSTRAINT [DF_s2ObjectHistory_extLink] DEFAULT (N'-') FOR [extLink]
GO

ALTER TABLE [dbo].[s3ObjectVersions] WITH NOCHECK ADD
	CONSTRAINT [DF_s2ObjectVersions_extLink] DEFAULT (N'-') FOR [extLink]
GO

ALTER TABLE [dbo].[s3Tree] WITH NOCHECK ADD
	CONSTRAINT [IX_s2LinkTree_luid] UNIQUE  NONCLUSTERED
	(
		[lnkLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY] ,
	CONSTRAINT [IX_s2TreeLinkage_NAMES] UNIQUE  NONCLUSTERED
	(
		[cntLnkId],
		[lnkName]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Items] WITH NOCHECK ADD
	CONSTRAINT [DF_d1Items_itmCrc] DEFAULT ('*') FOR [itmCrc],
	CONSTRAINT [DF_d1Items_itmPreview] DEFAULT (N'N') FOR [itmPreview],
	CONSTRAINT [DF_d1Items_itmSearchName] DEFAULT (N'*') FOR [itmSearchName],
	CONSTRAINT [DF_d1Items_itmLevel1Name] DEFAULT (N'*') FOR [itmLevel1Name],
	CONSTRAINT [DF_d1Items_itmLevel2Name] DEFAULT (N'*') FOR [itmLevel2Name],
	CONSTRAINT [DF_d1Items_itmLevel3Name] DEFAULT (N'*') FOR [itmLevel3Name],
	CONSTRAINT [IX_d1ItemLuid] UNIQUE  NONCLUSTERED
	(
		[itmLuid]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3RecycledTree] WITH NOCHECK ADD
	CONSTRAINT [IX_s2RecycledTree_NAMES] UNIQUE  NONCLUSTERED
	(
		[cntLnkId],
		[lnkName],
		[delId]
	) WITH  FILLFACTOR = 90  ON [PRIMARY]
GO

CREATE  UNIQUE  INDEX [IX_d1Known] ON [dbo].[d1Known]([name]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [s2Objects21] ON [dbo].[s3Objects]([objState], [objCreated]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1013578649_8A_1A_4A] ON [dbo].[s3Objects] ([objState], [objId], [objCreated]) ')
GO

CREATE  INDEX [s2Objects10] ON [dbo].[s3Objects]([objId], [objState]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  UNIQUE  INDEX [IX_d1Folders] ON [dbo].[d1Folders]([fldParentLuid], [fldName], [srcLuid]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_m1Inbox] ON [dbo].[m1Inbox]([msgId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_m1Inbox_1] ON [dbo].[m1Inbox]([msgUserId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_m1Queue] ON [dbo].[m1Queue]([msgId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2ObjectHistory] ON [dbo].[s3ObjectHistory]([objId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2ObjectVersions] ON [dbo].[s3ObjectVersions]([objId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [s2Tree18] ON [dbo].[s3Tree]([objId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1093578934_6A_2A] ON [dbo].[s3Tree] ([objId], [lnkLuid]) ')
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1093578934_6A_3A] ON [dbo].[s3Tree] ([objId], [cntLnkId]) ')
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1093578934_2A_6A] ON [dbo].[s3Tree] ([lnkLuid], [objId]) ')
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1093578934_1A_6A] ON [dbo].[s3Tree] ([lnkId], [objId]) ')
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1093578934_6A_1A_3A] ON [dbo].[s3Tree] ([objId], [lnkId], [cntLnkId]) ')
GO

/****** The index created by the following statement is for internal use only. ******/
/****** It is not a real index but exists as statistics only. ******/
if (@@microsoftversion > 0x07000000 )
EXEC ('CREATE STATISTICS [hind_1093578934_6A_1A_2A] ON [dbo].[s3Tree] ([objId], [lnkId], [lnkLuid]) ')
GO

CREATE  INDEX [s2Tree9] ON [dbo].[s3Tree]([objId], [lnkLuid]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  UNIQUE  INDEX [IX_d1Items] ON [dbo].[d1Items]([fldLuid], [itmName]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  UNIQUE  INDEX [IX_s2Aliases] ON [dbo].[s3Aliases]([alLnkId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2ChangeQueue] ON [dbo].[s3ChangeQueue]([evtDate]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2ExtraLink] ON [dbo].[s3ExtraLink]([recId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2Indexed] ON [dbo].[s3Indexed]([lnkIndexed]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [s2Indices2] ON [dbo].[s3Indices]([luid]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2ScheduleLog] ON [dbo].[s3ScheduleLog]([objectid]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2ScheduleQueue] ON [dbo].[s3ScheduleQueue]([schedule]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2SyncTree] ON [dbo].[s3TreeSync]([lnkTgtId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_d1ChangeQueue] ON [dbo].[d1ChangeQueue]([evtDate]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_d1Indexed] ON [dbo].[d1Indexed]([itmIndexed]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [d1Indices2] ON [dbo].[d1Indices]([luid]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_d1ItemLinkage] ON [dbo].[d1ItemLinkage]([itmLink]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

CREATE  INDEX [IX_s2RecycledTree] ON [dbo].[s3RecycledTree]([delId]) WITH  FILLFACTOR = 90 ON [PRIMARY]
GO

ALTER TABLE [dbo].[d1Folders] ADD
	CONSTRAINT [FK_d1Folders_d1Folders] FOREIGN KEY
	(
		[fldParentLuid]
	) REFERENCES [dbo].[d1Folders] (
		[fldLuid]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_o1Folders_o1Sources] FOREIGN KEY
	(
		[srcLuid]
	) REFERENCES [dbo].[d1Sources] (
		[srcLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[d1Folders] nocheck constraint [FK_d1Folders_d1Folders]
GO

ALTER TABLE [dbo].[d1KnownAliases] ADD
	CONSTRAINT [FK_d1KnownAliases_d1Known] FOREIGN KEY
	(
		[guid]
	) REFERENCES [dbo].[d1Known] (
		[guid]
	)
GO

ALTER TABLE [dbo].[m1Inbox] ADD
	CONSTRAINT [FK_m1Inbox_m1Messages] FOREIGN KEY
	(
		[msgId]
	) REFERENCES [dbo].[m1Messages] (
		[msgId]
	) NOT FOR REPLICATION
GO

ALTER TABLE [dbo].[m1Queue] ADD
	CONSTRAINT [FK_m1Queue_m1Messages] FOREIGN KEY
	(
		[msgId]
	) REFERENCES [dbo].[m1Messages] (
		[msgId]
	) NOT FOR REPLICATION
GO

ALTER TABLE [dbo].[m1Sent] ADD
	CONSTRAINT [FK_m1Sent_m1Messages] FOREIGN KEY
	(
		[msgId]
	) REFERENCES [dbo].[m1Messages] (
		[msgId]
	) NOT FOR REPLICATION
GO

ALTER TABLE [dbo].[s3Locks] ADD
	CONSTRAINT [FK_s2Locks_s2Objects] FOREIGN KEY
	(
		[lockType]
	) REFERENCES [dbo].[s3Objects] (
		[objId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3Locks] nocheck constraint [FK_s2Locks_s2Objects]
GO

ALTER TABLE [dbo].[s3ObjectHistory] ADD
	CONSTRAINT [FK_s2ObjectHistory_s2Objects] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3Objects] (
		[objId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3ObjectHistory] nocheck constraint [FK_s2ObjectHistory_s2Objects]
GO

ALTER TABLE [dbo].[s3ObjectVersions] ADD
	CONSTRAINT [FK_s2ObjectVersions_s2ObjectVersions] FOREIGN KEY
	(
		[vrParentId]
	) REFERENCES [dbo].[s3ObjectVersions] (
		[vrId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2ObjectVersions_s2Objects] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3Objects] (
		[objId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3ObjectVersions] nocheck constraint [FK_s2ObjectVersions_s2ObjectVersions]
GO

alter table [dbo].[s3ObjectVersions] nocheck constraint [FK_s2ObjectVersions_s2Objects]
GO

ALTER TABLE [dbo].[s3Tree] ADD
	CONSTRAINT [FK_s2Tree_s2Objects] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3Objects] (
		[objId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2Tree_s2Tree] FOREIGN KEY
	(
		[cntLnkId]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3Tree] nocheck constraint [FK_s2Tree_s2Objects]
GO

alter table [dbo].[s3Tree] nocheck constraint [FK_s2Tree_s2Tree]
GO

ALTER TABLE [dbo].[d1Items] ADD
	CONSTRAINT [FK_d1Items_d1Queue] FOREIGN KEY
	(
		[itmLevel1Name]
	) REFERENCES [dbo].[d1Queue] (
		[queFormation]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_o1Items_o1Folders] FOREIGN KEY
	(
		[fldLuid]
	) REFERENCES [dbo].[d1Folders] (
		[fldLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[d1Items] nocheck constraint [FK_d1Items_d1Queue]
GO

ALTER TABLE [dbo].[s3Aliases] ADD
	CONSTRAINT [FK_s2Aliases_s2Tree] FOREIGN KEY
	(
		[alLnkId]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3Aliases] nocheck constraint [FK_s2Aliases_s2Tree]
GO

ALTER TABLE [dbo].[s3ChangeQueue] ADD
	CONSTRAINT [FK_s2ChangeQueue_s2Tree] FOREIGN KEY
	(
		[evtCmdLuid]
	) REFERENCES [dbo].[s3Tree] (
		[lnkLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3ChangeQueue] nocheck constraint [FK_s2ChangeQueue_s2Tree]
GO

ALTER TABLE [dbo].[s3ExtraLink] ADD
	CONSTRAINT [FK_s2ExtraLink_s2Extra] FOREIGN KEY
	(
		[recId]
	) REFERENCES [dbo].[s3Extra] (
		[recId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2ExtraLink_s2ObjectHistory] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3ObjectHistory] (
		[hsId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2ExtraLink_s2ObjectVersions] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3ObjectVersions] (
		[vrId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2ExtraLink_s2Objects] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3Objects] (
		[objId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3ExtraLink] nocheck constraint [FK_s2ExtraLink_s2Extra]
GO

alter table [dbo].[s3ExtraLink] nocheck constraint [FK_s2ExtraLink_s2ObjectHistory]
GO

alter table [dbo].[s3ExtraLink] nocheck constraint [FK_s2ExtraLink_s2ObjectVersions]
GO

alter table [dbo].[s3ExtraLink] nocheck constraint [FK_s2ExtraLink_s2Objects]
GO

ALTER TABLE [dbo].[s3Indexed] ADD
	CONSTRAINT [FK_s2Indexed_s2Tree] FOREIGN KEY
	(
		[luid]
	) REFERENCES [dbo].[s3Tree] (
		[lnkLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3Indexed] nocheck constraint [FK_s2Indexed_s2Tree]
GO

ALTER TABLE [dbo].[s3Indices] ADD
	CONSTRAINT [FK_s2Indices_s2Dictionary] FOREIGN KEY
	(
		[code]
	) REFERENCES [dbo].[s3Dictionary] (
		[code]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2Indices_s2Tree] FOREIGN KEY
	(
		[luid]
	) REFERENCES [dbo].[s3Tree] (
		[lnkLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3Indices] nocheck constraint [FK_s2Indices_s2Dictionary]
GO

alter table [dbo].[s3Indices] nocheck constraint [FK_s2Indices_s2Tree]
GO

ALTER TABLE [dbo].[s3Recycled] ADD
	CONSTRAINT [FK_s2Recycled_s2Tree] FOREIGN KEY
	(
		[delCntId]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3Recycled] nocheck constraint [FK_s2Recycled_s2Tree]
GO

ALTER TABLE [dbo].[s3ScheduleLog] ADD
	CONSTRAINT [FK_s2ScheduleLog_s2Tree] FOREIGN KEY
	(
		[objectid]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3ScheduleLog] nocheck constraint [FK_s2ScheduleLog_s2Tree]
GO

ALTER TABLE [dbo].[s3ScheduleQueue] ADD
	CONSTRAINT [FK_s2ScheduleQueue_s2Tree] FOREIGN KEY
	(
		[objectid]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3ScheduleQueue] nocheck constraint [FK_s2ScheduleQueue_s2Tree]
GO

ALTER TABLE [dbo].[s3TreeSync] ADD
	CONSTRAINT [FK_s2TreeSync_s2Tree] FOREIGN KEY
	(
		[lnkSrcId]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2TreeSync_s2Tree1] FOREIGN KEY
	(
		[lnkTgtId]
	) REFERENCES [dbo].[s3Tree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3TreeSync] nocheck constraint [FK_s2TreeSync_s2Tree]
GO

alter table [dbo].[s3TreeSync] nocheck constraint [FK_s2TreeSync_s2Tree1]
GO

ALTER TABLE [dbo].[d1ChangeLog] ADD
	CONSTRAINT [FK_d1ChangeLog_d1Items] FOREIGN KEY
	(
		[evtCmdLuid]
	) REFERENCES [dbo].[d1Items] (
		[itmLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[d1ChangeLog] nocheck constraint [FK_d1ChangeLog_d1Items]
GO

ALTER TABLE [dbo].[d1ChangeQueue] ADD
	CONSTRAINT [FK_d1ChangeQueue_d1Items] FOREIGN KEY
	(
		[evtCmdLuid]
	) REFERENCES [dbo].[d1Items] (
		[itmLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[d1ChangeQueue] nocheck constraint [FK_d1ChangeQueue_d1Items]
GO

ALTER TABLE [dbo].[d1Indexed] ADD
	CONSTRAINT [FK_d1Indexed_d1Items] FOREIGN KEY
	(
		[luid]
	) REFERENCES [dbo].[d1Items] (
		[itmLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[d1Indexed] nocheck constraint [FK_d1Indexed_d1Items]
GO

ALTER TABLE [dbo].[d1Indices] ADD
	CONSTRAINT [FK_d1Indices_d1Items] FOREIGN KEY
	(
		[luid]
	) REFERENCES [dbo].[d1Items] (
		[itmLuid]
	) NOT FOR REPLICATION
GO

alter table [dbo].[d1Indices] nocheck constraint [FK_d1Indices_d1Items]
GO

ALTER TABLE [dbo].[d1ItemLinkage] ADD
	CONSTRAINT [FK_d1ItemLinkage_d1Items] FOREIGN KEY
	(
		[itmGuid]
	) REFERENCES [dbo].[d1Items] (
		[itmGuid]
	),
	CONSTRAINT [FK_d1ItemLinkage_d1Known] FOREIGN KEY
	(
		[itmLink]
	) REFERENCES [dbo].[d1Known] (
		[guid]
	)
GO

ALTER TABLE [dbo].[s3RecycledTree] ADD
	CONSTRAINT [FK_s2RecycledTree_s2Objects] FOREIGN KEY
	(
		[objId]
	) REFERENCES [dbo].[s3Objects] (
		[objId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2RecycledTree_s2Recycled] FOREIGN KEY
	(
		[lnkId]
	) REFERENCES [dbo].[s3Recycled] (
		[delRootId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2RecycledTree_s2Recycled1] FOREIGN KEY
	(
		[delId]
	) REFERENCES [dbo].[s3Recycled] (
		[delRootId]
	) NOT FOR REPLICATION ,
	CONSTRAINT [FK_s2RecycledTree_s2RecycledTree] FOREIGN KEY
	(
		[cntLnkId]
	) REFERENCES [dbo].[s3RecycledTree] (
		[lnkId]
	) NOT FOR REPLICATION
GO

alter table [dbo].[s3RecycledTree] nocheck constraint [FK_s2RecycledTree_s2Objects]
GO

alter table [dbo].[s3RecycledTree] nocheck constraint [FK_s2RecycledTree_s2Recycled]
GO

alter table [dbo].[s3RecycledTree] nocheck constraint [FK_s2RecycledTree_s2Recycled1]
GO

alter table [dbo].[s3RecycledTree] nocheck constraint [FK_s2RecycledTree_s2RecycledTree]
GO


/****** Object:  Table [dbo].[s3ChangeInfo]    Script Date: 24.07.2006 0:22:40 ******/
CREATE TABLE [dbo].[s3ChangeInfo] (
	[evtTarget] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtType] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtGuid] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[evtDate] [datetime] NOT NULL ,
	[evtExpire] [datetime] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[s3ChangePeer]    Script Date: 24.07.2006 0:22:41 ******/
CREATE TABLE [dbo].[s3ChangePeer] (
	[peerId] [nvarchar] (32) COLLATE Latin1_General_BIN NOT NULL ,
	[peerDate] [datetime] NOT NULL ,
	[peerExpire] [datetime] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ChangeInfo] WITH NOCHECK ADD
	CONSTRAINT [PK_s3ChangeInfo] PRIMARY KEY  CLUSTERED
	(
		[evtTarget],
		[evtId]
	)  ON [PRIMARY]
GO

ALTER TABLE [dbo].[s3ChangePeer] WITH NOCHECK ADD
	CONSTRAINT [PK_s3ChangePeer] PRIMARY KEY  CLUSTERED
	(
		[peerId]
	)  ON [PRIMARY]
GO
