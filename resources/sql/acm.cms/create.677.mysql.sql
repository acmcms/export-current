#
# Structure for the `c0chartlog` table :
#
 
CREATE TABLE `c0chartlog` (
  `itrDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `grpDate` int(11) NOT NULL default '0',
  `itrDeath` int(11) NOT NULL default '0',
  `itmType` varchar(32) NOT NULL default '',
  `itmGuid` varchar(32) NOT NULL default '',
  `itmFolder` varchar(64) NOT NULL default '',
  `itmParam` text NOT NULL,
  `itrType` varchar(32) NOT NULL default '',
  `itrUser` varchar(32) NOT NULL default '',
  `itrAddress` varchar(32) NOT NULL default '',
  `itrLang` varchar(8) NOT NULL default '',
  `itrCountry` varchar(8) NOT NULL default '',
  `itrValue` int(11) NOT NULL default '0',
  KEY `c0ChartLog1` (`itmType`,`itrType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `cmlocks` table :
#
 
CREATE TABLE `cmlocks` (
  `lockType` varchar(32) NOT NULL default '',
  `lockVersion` int(11) NOT NULL default '0',
  `lockId` varchar(32) NOT NULL default '',
  `lockDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `lockExpiration` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`lockType`,`lockVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `cmshares` table :
#
 
CREATE TABLE `cmshares` (
  `path` varchar(255) NOT NULL default '',
  `alias` varchar(255) NOT NULL default '',
  `accessType` int(11) NOT NULL default '0',
  `skinnerType` varchar(128) NOT NULL default '',
  `languageMode` varchar(8) NOT NULL default 'N''*''',
  `commandMode` char(1) NOT NULL default '',
  PRIMARY KEY  (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1descriptions` table :
#
 
CREATE TABLE `d1descriptions` (
  `itmCrc` varchar(32) NOT NULL default '',
  `itmDescription` longblob NOT NULL,
  `itmHidden` char(1) NOT NULL default '',
  PRIMARY KEY  (`itmCrc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1folders` table :
#
 
CREATE TABLE `d1folders` (
  `fldLuid` int(11) NOT NULL auto_increment,
  `srcLuid` int(11) NOT NULL default '0',
  `fldParentLuid` int(11) NOT NULL default '0',
  `fldName` varchar(128) NOT NULL default '',
  `fldCreated` datetime NOT NULL default '0000-00-00 00:00:00',
  `fldChecked` datetime NOT NULL default '0000-00-00 00:00:00',
  `fldCrc` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`fldLuid`),
  UNIQUE KEY `IX_d1Folders` (`fldParentLuid`,`fldName`,`srcLuid`),
  KEY `srcLuid` (`srcLuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1itemlinkage` table :
#
 
CREATE TABLE `d1itemlinkage` (
  `itmGuid` varchar(32) NOT NULL default '',
  `itmLink` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`itmGuid`,`itmLink`),
  KEY `IX_d1ItemLinkage` (`itmLink`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1items` table :
#
 
CREATE TABLE `d1items` (
  `itmGuid` varchar(32) NOT NULL default '',
  `itmCrc` varchar(32) NOT NULL default '*',
  `fldLuid` int(11) NOT NULL default '0',
  `itmName` varchar(255) NOT NULL default '',
  `itmCreated` datetime NOT NULL default '0000-00-00 00:00:00',
  `itmSize` int(11) NOT NULL default '0',
  `itmDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `itmType` varchar(32) NOT NULL default '',
  `itmComment` varchar(128) NOT NULL default '',
  `itmPreview` char(1) NOT NULL default '',
  `itmSearchName` varchar(255) NOT NULL default 'N''*''',
  `itmLevel1Name` varchar(255) NOT NULL default 'N''*''',
  `itmLevel2Name` varchar(255) NOT NULL default 'N''*''',
  `itmLevel3Name` varchar(255) NOT NULL default 'N''*''',
  PRIMARY KEY  (`itmGuid`),
  UNIQUE KEY `IX_d1Items` (`fldLuid`,`itmName`),
  KEY `itmLevel1Name` (`itmLevel1Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1known` table :
#
 
CREATE TABLE `d1known` (
  `guid` varchar(32) NOT NULL default '',
  `name` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`guid`),
  UNIQUE KEY `IX_d1Known` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1knownaliases` table :
#
 
CREATE TABLE `d1knownaliases` (
  `guid` varchar(32) NOT NULL default '',
  `alias` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`alias`,`guid`),
  KEY `guid` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1locks` table :
#
 
CREATE TABLE `d1locks` (
  `lockType` varchar(32) NOT NULL default '',
  `lockVersion` int(11) NOT NULL default '0',
  `lockId` varchar(32) NOT NULL default '',
  `lockDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `lockExpiration` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`lockType`,`lockVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1queue` table :
#
 
CREATE TABLE `d1queue` (
  `queLuid` int(11) NOT NULL auto_increment,
  `queFormation` varchar(255) NOT NULL default '',
  `queBusy` datetime NOT NULL default '0000-00-00 00:00:00',
  `queQueued` datetime NOT NULL default '0000-00-00 00:00:00',
  `queText` longblob,
  `queHint` varchar(64) NOT NULL default '*',
  `queDelay` int(11) NOT NULL default '0',
  PRIMARY KEY  (`queFormation`),
  KEY `queLuid` (`queLuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1sourcehistory` table :
#
 
CREATE TABLE `d1sourcehistory` (
  `logDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `srcLuid` int(11) NOT NULL default '0',
  `hstIdentity` varchar(32) NOT NULL default '',
  `srcHealth` int(11) NOT NULL default '0',
  `srcReady` int(11) NOT NULL default '0',
  `srcAlive` char(1) NOT NULL default ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `d1sources` table :
#
 
CREATE TABLE `d1sources` (
  `srcLuid` int(11) NOT NULL auto_increment,
  `srcGuid` varchar(32) NOT NULL default '',
  `srcHost` varchar(50) NOT NULL default '',
  `srcPort` int(11) NOT NULL default '0',
  `idxHost` varchar(50) NOT NULL default '',
  `idxPort` int(11) NOT NULL default '0',
  `srcCreated` datetime NOT NULL default '0000-00-00 00:00:00',
  `srcMaintainer` varchar(32) NOT NULL default '',
  `srcChecked` datetime NOT NULL default '0000-00-00 00:00:00',
  `srcIndex` char(1) NOT NULL default '',
  `srcActive` char(1) NOT NULL default '',
  `srcHealth` int(11) NOT NULL default '0',
  `srcReady` int(11) NOT NULL default '0',
  PRIMARY KEY  (`srcLuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `l1tasks` table :
#
 
CREATE TABLE `l1tasks` (
  `taskGuid` varchar(32) NOT NULL default '',
  `taskName` varchar(255) NOT NULL default '',
  `taskOwner` varchar(32) NOT NULL default 'N''MyX''',
  `taskCommon` char(1) NOT NULL default '',
  `taskLastRun` datetime NOT NULL default '0000-00-00 00:00:00',
  `taskLastRunLength` int(11) NOT NULL default '0',
  `taskLastResult` longblob,
  `taskRunner` varchar(50) NOT NULL default '',
  `taskRunnerSettings` longblob,
  `taskRunnerData` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `m1inbox` table :
#
 
CREATE TABLE `m1inbox` (
  `msgLuid` int(11) NOT NULL auto_increment,
  `msgId` varchar(32) NOT NULL default '',
  `msgUserId` varchar(32) NOT NULL default '',
  `msgPriority` int(11) NOT NULL default '0',
  `msgRead` char(1) NOT NULL default '',
  `msgTarget` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`msgLuid`),
  KEY `IX_m1Inbox` (`msgId`),
  KEY `IX_m1Inbox_1` (`msgUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `m1locks` table :
#
 
CREATE TABLE `m1locks` (
  `lockType` varchar(32) NOT NULL default '',
  `lockVersion` int(11) NOT NULL default '0',
  `lockId` varchar(32) NOT NULL default '',
  `lockDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `lockExpiration` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`lockType`,`lockVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `m1messages` table :
#
 
CREATE TABLE `m1messages` (
  `msgId` varchar(32) NOT NULL default '',
  `msgOwnerId` varchar(32) NOT NULL default '',
  `msgDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `fcId` varchar(32) NOT NULL default '',
  `fcDataType` int(11) NOT NULL default '0',
  `fcData` longblob NOT NULL,
  PRIMARY KEY  (`msgId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `m1queue` table :
#
 
CREATE TABLE `m1queue` (
  `msgLuid` int(11) NOT NULL auto_increment,
  `msgId` varchar(32) NOT NULL default '',
  `msgQueued` datetime NOT NULL default '0000-00-00 00:00:00',
  `msgExpire` datetime NOT NULL default '0000-00-00 00:00:00',
  `msgFailCounter` int(11) NOT NULL default '0',
  `msgPriority` int(11) NOT NULL default '0',
  `msgInteractive` char(1) NOT NULL default '',
  `msgTarget` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`msgLuid`),
  KEY `IX_m1Queue` (`msgId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `m1sent` table :
#
 
CREATE TABLE `m1sent` (
  `msgLuid` int(11) NOT NULL auto_increment,
  `msgId` varchar(32) NOT NULL default '',
  `msgUserId` varchar(32) NOT NULL default '',
  `msgProcessed` char(1) NOT NULL default '',
  `msgTarget` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`msgLuid`),
  KEY `msgId` (`msgId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3aliases` table :
#
 
CREATE TABLE `s3aliases` (
  `alId` varchar(32) NOT NULL default '',
  `alLnkId` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`alId`),
  UNIQUE KEY `IX_s3Aliases` (`alLnkId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3changeinfo` table :
#
 
CREATE TABLE `s3changeinfo` (
  `evtTarget` varchar(32) NOT NULL default '',
  `evtId` varchar(32) NOT NULL default '',
  `evtType` varchar(32) NOT NULL default '',
  `evtGuid` varchar(32) NOT NULL default '',
  `evtDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `evtExpire` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`evtTarget`,`evtId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3changepeer` table :
#
 
CREATE TABLE `s3changepeer` (
  `peerId` varchar(32) NOT NULL default '',
  `peerDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `peerExpire` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`peerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3changequeue` table :
#
 
CREATE TABLE `s3changequeue` (
  `evtId` varchar(32) NOT NULL default '',
  `evtDate` datetime default '0000-00-00 00:00:00',
  `evtSequence` int(11) NOT NULL default '0',
  `evtOwner` varchar(32) NOT NULL default '',
  `evtCmdType` varchar(32) NOT NULL default '',
  `evtCmdGuid` varchar(32) NOT NULL default '',
  `evtCmdLuid` int(11) NOT NULL default '0',
  `evtCmdDate` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`evtId`),
  KEY `IX_s3ChangeQueue` (`evtDate`),
  KEY `evtCmdLuid` (`evtCmdLuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3dictionary` table :
#
 
CREATE TABLE `s3dictionary` (
  `code` int(11) NOT NULL auto_increment,
  `exact` char(1) NOT NULL default '',
  `word` varchar(80) NOT NULL default '',
  PRIMARY KEY  (`exact`,`word`),
  UNIQUE KEY `IX_s3Dictionary` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3extra` table :
#
 
CREATE TABLE `s3extra` (
  `recId` varchar(32) NOT NULL default '',
  `recDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `recType` varchar(64) NOT NULL default '',
  `recBlob` longblob NOT NULL,
  PRIMARY KEY  (`recId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3extralink` table :
#
 
CREATE TABLE `s3extralink` (
  `objId` varchar(32) NOT NULL default '',
  `fldId` varchar(32) NOT NULL default '',
  `recId` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`fldId`,`objId`),
  KEY `IX_s3ExtraLink` (`recId`),
  KEY `objId` (`objId`),
  KEY `objId_2` (`objId`),
  KEY `objId_3` (`objId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3importlog` table :
#
 
CREATE TABLE `s3importlog` (
  `evtId` varchar(40) NOT NULL default '',
  `evtDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `evtOwner` varchar(40) NOT NULL default '',
  `evtVersion` int(11) NOT NULL default '0',
  `evtBlob` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3importqueue` table :
#
 
CREATE TABLE `s3importqueue` (
  `evtId` varchar(40) NOT NULL default '',
  `evtDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `evtOwner` varchar(40) NOT NULL default '',
  `evtVersion` int(11) NOT NULL default '0',
  `evtBlob` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3indexed` table :
#
 
CREATE TABLE `s3indexed` (
  `luid` int(11) NOT NULL default '0',
  `idxVersion` int(11) NOT NULL default '0',
  `lnkIndexed` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`luid`),
  KEY `IX_s3Indexed` (`lnkIndexed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3indices` table :
#
 
CREATE TABLE `s3indices` (
  `code` int(11) NOT NULL default '0',
  `luid` int(11) NOT NULL default '0',
  `weight` int(11) NOT NULL default '0',
  PRIMARY KEY  (`code`,`luid`),
  KEY `s3Indices3` (`luid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3locks` table :
#
 
CREATE TABLE `s3locks` (
  `lockType` varchar(32) NOT NULL default '',
  `lockVersion` int(11) NOT NULL default '0',
  `lockId` varchar(32) NOT NULL default '',
  `lockDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `lockExpiration` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`lockType`,`lockVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3objecthistory` table :
#
 
CREATE TABLE `s3objecthistory` (
  `hsId` varchar(32) NOT NULL default '',
  `hsDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `objId` varchar(32) NOT NULL default '',
  `vrId` varchar(32) default 'N''*''',
  `objTitle` varchar(255) NOT NULL default '',
  `objCreated` datetime NOT NULL default '0000-00-00 00:00:00',
  `objDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `objOwner` varchar(32) NOT NULL default '',
  `objType` varchar(64) NOT NULL default '',
  `objState` char(1) NOT NULL default '',
  `extLink` varchar(32) NOT NULL default '-',
  PRIMARY KEY  (`hsId`),
  KEY `IX_s3ObjectHistory` (`objId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3objects` table :
#
 
CREATE TABLE `s3objects` (
  `objId` varchar(32) NOT NULL default '',
  `vrId` varchar(32) NOT NULL default 'N''*''',
  `objTitle` varchar(255) NOT NULL default '',
  `objCreated` datetime NOT NULL default '0000-00-00 00:00:00',
  `objDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `objOwner` varchar(32) NOT NULL default '',
  `objType` varchar(64) NOT NULL default '',
  `objState` char(1) NOT NULL default '',
  `extLink` varchar(32) NOT NULL default '-',
  PRIMARY KEY  (`objId`),
  KEY `s3Objects10` (`objId`,`objState`),
  KEY `s3Objects31` (`objState`,`objCreated`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3objectversions` table :
#
 
CREATE TABLE `s3objectversions` (
  `vrId` varchar(32) NOT NULL default '',
  `vrDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `vrParentId` varchar(32) default NULL,
  `vrComment` varchar(255) default NULL,
  `objId` varchar(32) NOT NULL default '',
  `vrTitle` varchar(255) NOT NULL default '',
  `vrOwner` varchar(32) NOT NULL default '',
  `vrType` varchar(64) NOT NULL default '',
  `extLink` varchar(32) NOT NULL default '-',
  PRIMARY KEY  (`vrId`),
  KEY `IX_s3ObjectVersions` (`objId`),
  KEY `vrParentId` (`vrParentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3recycled` table :
#
 
CREATE TABLE `s3recycled` (
  `delRootId` varchar(32) NOT NULL default '',
  `delDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `delObjId` varchar(32) NOT NULL default '',
  `delCntId` varchar(32) NOT NULL default '',
  `delOwner` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`delRootId`),
  KEY `delCntId` (`delCntId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3recycledtree` table :
#
 
CREATE TABLE `s3recycledtree` (
  `lnkId` varchar(32) NOT NULL default '',
  `delId` varchar(32) NOT NULL default '',
  `cntLnkId` varchar(32) NOT NULL default '',
  `lnkName` varchar(128) NOT NULL default '',
  `lnkFolder` char(1) NOT NULL default '',
  `objId` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`lnkId`),
  UNIQUE KEY `IX_s3RecycledTree_NAMES` (`cntLnkId`,`lnkName`,`delId`),
  KEY `IX_s3RecycledTree` (`delId`),
  KEY `objId` (`objId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3schedulelog` table :
#
 
CREATE TABLE `s3schedulelog` (
  `scheduleid` varchar(50) NOT NULL default '',
  `objectid` varchar(32) NOT NULL default '',
  `systemid` varchar(32) NOT NULL default '',
  `ownerid` varchar(32) NOT NULL default '',
  `schedule` datetime NOT NULL default '0000-00-00 00:00:00',
  `name` varchar(64) NOT NULL default '',
  `command` varchar(128) NOT NULL default '',
  `parameters` longblob NOT NULL,
  `result` int(11) NOT NULL default '0',
  `resultData` longblob NOT NULL,
  KEY `IX_s3ScheduleLog` (`objectid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3schedulequeue` table :
#
 
CREATE TABLE `s3schedulequeue` (
  `scheduleid` varchar(50) NOT NULL default '',
  `objectid` varchar(32) NOT NULL default '',
  `systemid` varchar(32) NOT NULL default '',
  `state` int(11) NOT NULL default '0',
  `ownerid` varchar(32) NOT NULL default '',
  `schedule` datetime NOT NULL default '0000-00-00 00:00:00',
  `name` varchar(64) NOT NULL default '',
  `command` varchar(128) NOT NULL default '',
  `parameters` longblob NOT NULL,
  PRIMARY KEY  (`scheduleid`),
  KEY `IX_s3ScheduleQueue` (`schedule`),
  KEY `objectid` (`objectid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3tree` table :
#
 
CREATE TABLE `s3tree` (
  `lnkId` varchar(32) NOT NULL default '',
  `lnkLuid` int(11) NOT NULL auto_increment,
  `cntLnkId` varchar(32) NOT NULL default '',
  `lnkName` varchar(128) NOT NULL default '',
  `lnkFolder` char(1) NOT NULL default '',
  `objId` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`lnkId`),
  UNIQUE KEY `IX_s3LinkTree_luid` (`lnkLuid`),
  UNIQUE KEY `IX_s3TreeLinkage_NAMES` (`cntLnkId`,`lnkName`),
  KEY `s3Tree18` (`objId`),
  KEY `s3Tree9` (`objId`,`lnkLuid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
 
#
# Structure for the `s3treesync` table :
#
 
CREATE TABLE `s3treesync` (
  `lnkSrcId` varchar(32) NOT NULL default '',
  `lnkTgtId` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`lnkSrcId`,`lnkTgtId`),
  KEY `IX_s3SyncTree` (`lnkTgtId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `umacls` table :
#
 
CREATE TABLE `umacls` (
  `path` varchar(255) NOT NULL default '',
  `groupid` varchar(32) NOT NULL default '',
  `inherit` tinyint(1) NOT NULL default '0',
  `permissions` longtext NOT NULL,
  `ucounter` varchar(32) NOT NULL default ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `umgroups` table :
#
 
CREATE TABLE `umgroups` (
  `groupid` varchar(32) NOT NULL default '',
  `title` varchar(255) NOT NULL default '',
  `description` longtext NOT NULL,
  `authLevel` int(11) NOT NULL default '0',
  `data` longtext NOT NULL,
  PRIMARY KEY  (`groupid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `umuseraccounts` table :
#
 
CREATE TABLE `umuseraccounts` (
  `UserID` varchar(32) NOT NULL default '',
  `login` varchar(64) NOT NULL default '',
  `email` varchar(255) default NULL,
  `passhash` int(11) default NULL,
  `passhighhash` int(11) default NULL,
  `language` varchar(32) default NULL,
  `type` int(11) NOT NULL default '0',
  `added` datetime default NULL,
  `lastlogin` datetime default NULL,
  PRIMARY KEY  (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `umusergroups` table :
#
 
CREATE TABLE `umusergroups` (
  `groupid` varchar(32) NOT NULL default '',
  `userid` varchar(32) NOT NULL default '',
  `ucounter` varchar(32) NOT NULL default ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
#
# Structure for the `umuserprofiles` table :
#
 
CREATE TABLE `umuserprofiles` (
  `UserID` varchar(32) NOT NULL default '',
  `Scope` varchar(64) NOT NULL default '',
  `Checked` datetime default NULL,
  `LastAccess` datetime default NULL,
  `Profile` longtext,
  PRIMARY KEY  (`Scope`,`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 