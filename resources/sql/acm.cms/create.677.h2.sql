CREATE TABLE c0chartlog (
  itrdate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  grpdate bigint NOT NULL DEFAULT (0),
  itrdeath bigint NOT NULL DEFAULT (0),
  itmtype varchar(32) NOT NULL DEFAULT '',
  itmguid varchar(32) NOT NULL DEFAULT '',
  itmfolder varchar(64) NOT NULL DEFAULT '',
  itmparam varchar(512) NOT NULL,
  itrtype varchar(32) NOT NULL DEFAULT '',
  itruser varchar(32) NOT NULL DEFAULT '',
  itraddress varchar(32) NOT NULL DEFAULT '',
  itrlang varchar(8) NOT NULL DEFAULT '',
  itrcountry varchar(8) NOT NULL DEFAULT '',
  itrvalue bigint NOT NULL DEFAULT (0)
);
CREATE TABLE cmlocks (
  locktype varchar(32) NOT NULL DEFAULT '',
  lockversion bigint NOT NULL DEFAULT (0),
  lockid varchar(32) NOT NULL DEFAULT '',
  lockdate timestamp NOT NULL,
  lockexpiration timestamp NOT NULL,
  CONSTRAINT cmlocks_pkey PRIMARY KEY (locktype, lockversion)
);
CREATE TABLE cmshares (
  path varchar(255) NOT NULL DEFAULT '',
  alias varchar(255) NOT NULL DEFAULT '',
  accesstype bigint NOT NULL DEFAULT (0),
  skinnertype varchar(128) NOT NULL DEFAULT '',
  languagemode varchar(8) NOT NULL DEFAULT '',
  commandmode char(1) NOT NULL DEFAULT '',
  CONSTRAINT cmshares_pkey PRIMARY KEY (alias)
);
CREATE TABLE d1changequeue (
  evtid varchar(32) NOT NULL DEFAULT '',
  evtdate timestamp NOT NULL,
  evtsequence bigint NOT NULL DEFAULT (0),
  evtowner varchar(32) NOT NULL DEFAULT '',
  evtcmdtype varchar(32) NOT NULL DEFAULT '',
  evtcmdguid varchar(32) NOT NULL DEFAULT '',
  evtcmdluid bigint NOT NULL DEFAULT (0),
  CONSTRAINT d1changequeue_pkey PRIMARY KEY (evtid)
);
CREATE INDEX evtcmdluid25 ON d1changequeue (evtcmdluid);
CREATE INDEX ix_d3changequeue ON d1changequeue (evtdate);
CREATE TABLE d1descriptions (
  itmcrc varchar(32) NOT NULL DEFAULT '',
  itmdescription blob NOT NULL,
  itmhidden character(1) NOT NULL DEFAULT '',
  CONSTRAINT d1descriptions_pkey PRIMARY KEY (itmcrc)
);
CREATE TABLE d1dictionary (
  code int AUTO_INCREMENT NOT NULL,
  exact character(1) NOT NULL DEFAULT '',
  word varchar(80) NOT NULL DEFAULT '',
  CONSTRAINT d1dictionary_pkey PRIMARY KEY (exact, word),
  CONSTRAINT ix_d1dictionary UNIQUE (code)
);
CREATE TABLE d1folders (
  fldluid int AUTO_INCREMENT NOT NULL,
  srcluid bigint NOT NULL DEFAULT (0),
  fldparentluid bigint NOT NULL DEFAULT (0),
  fldname varchar(128) NOT NULL DEFAULT '',
  fldcreated timestamp NOT NULL,
  fldchecked timestamp NOT NULL,
  fldcrc varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT d1folders_pkey PRIMARY KEY (fldluid),
  CONSTRAINT ix_d1folders UNIQUE (fldparentluid, fldname, srcluid)
);
CREATE INDEX srcluid ON d1folders (srcluid);
CREATE TABLE d1indexed (
  luid bigint NOT NULL DEFAULT (0),
  idxversion bigint NOT NULL DEFAULT (0),
  lnkindexed timestamp NOT NULL,
  CONSTRAINT d1indexed_pkey PRIMARY KEY (luid)
);
CREATE INDEX ix_d1indexed ON d1indexed (lnkindexed);
CREATE TABLE d1indices (
  code bigint NOT NULL DEFAULT (0),
  luid bigint NOT NULL DEFAULT (0),
  weight bigint NOT NULL DEFAULT (0),
  CONSTRAINT d1indices_pkey PRIMARY KEY (code, luid)
);
CREATE INDEX d1indices1 ON d1indices (luid);
CREATE TABLE d1itemlinkage (
  itmguid varchar(32) NOT NULL DEFAULT '',
  itmlink varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT d1itemlinkage_pkey PRIMARY KEY (itmguid, itmlink)
);
CREATE INDEX ix_d1itemlinkage ON d1itemlinkage (itmlink);
CREATE TABLE d1items (
  itmguid varchar(32) NOT NULL DEFAULT '',
  itmluid bigint NOT NULL DEFAULT (0),
  itmcrc varchar(32) NOT NULL DEFAULT '*',
  fldluid bigint NOT NULL DEFAULT (0),
  itmname varchar(255) NOT NULL DEFAULT '',
  itmcreated timestamp NOT NULL,
  itmsize bigint NOT NULL DEFAULT (0),
  itmdate timestamp NOT NULL,
  itmtype varchar(32) NOT NULL DEFAULT '',
  itmcomment varchar(128) NOT NULL DEFAULT '',
  itmpreview character(1) NOT NULL DEFAULT '',
  itmsearchname varchar(255) NOT NULL DEFAULT '',
  itmlevel1name varchar(255) NOT NULL DEFAULT '',
  itmlevel2name varchar(255) NOT NULL DEFAULT '',
  itmlevel3name varchar(255) NOT NULL DEFAULT '',
  CONSTRAINT d1items_pkey PRIMARY KEY (itmguid),
  CONSTRAINT ix_d1items UNIQUE (fldluid, itmname)
);
CREATE INDEX itmlevel1name ON d1items (itmlevel1name);
CREATE TABLE d1known (
  guid varchar(32) NOT NULL DEFAULT '',
  name varchar(255) NOT NULL DEFAULT '',
  CONSTRAINT d1known_pkey PRIMARY KEY (guid),
  CONSTRAINT ix_d1known UNIQUE (name)
);
CREATE TABLE d1knownaliases (
  guid varchar(32) NOT NULL DEFAULT '',
  alias varchar(255) NOT NULL DEFAULT '',
  CONSTRAINT d1knownaliases_pkey PRIMARY KEY (alias, guid)
);
CREATE INDEX guid ON d1knownaliases (guid);
CREATE TABLE d1locks (
  locktype varchar(32) NOT NULL DEFAULT '',
  lockversion bigint NOT NULL DEFAULT (0),
  lockid varchar(32) NOT NULL DEFAULT '',
  lockdate timestamp NOT NULL,
  lockexpiration timestamp NOT NULL,
  CONSTRAINT d1locks_pkey PRIMARY KEY (locktype, lockversion)
);
CREATE TABLE d1queue (
  queluid int AUTO_INCREMENT NOT NULL,
  queformation varchar(255) NOT NULL DEFAULT '',
  quebusy timestamp NOT NULL,
  quequeued timestamp NOT NULL,
  quetext blob,
  quehint varchar(64) NOT NULL DEFAULT '*',
  quedelay bigint NOT NULL DEFAULT (0),
  CONSTRAINT d1queue_pkey PRIMARY KEY (queformation)
);
CREATE INDEX queluid ON d1queue (queluid);
CREATE TABLE d1sourcehistory (
  logdate timestamp NOT NULL,
  srcluid bigint NOT NULL DEFAULT (0),
  hstidentity varchar(32) NOT NULL DEFAULT '',
  srchealth bigint NOT NULL DEFAULT (0),
  srcready bigint NOT NULL DEFAULT (0),
  srcalive character(1) NOT NULL DEFAULT ''
);
CREATE TABLE d1sources (
  srcluid int AUTO_INCREMENT NOT NULL,
  srcguid varchar(32) NOT NULL DEFAULT '',
  srchost varchar(50) NOT NULL DEFAULT '',
  srcport bigint NOT NULL DEFAULT (0),
  idxhost varchar(50) NOT NULL DEFAULT '',
  idxport bigint NOT NULL DEFAULT (0),
  srccreated timestamp NOT NULL,
  srcmaintainer varchar(32) NOT NULL DEFAULT '',
  srcchecked timestamp NOT NULL,
  srcindex character(1) NOT NULL DEFAULT '',
  srcactive character(1) NOT NULL DEFAULT '',
  srchealth bigint NOT NULL DEFAULT (0),
  srcready bigint NOT NULL DEFAULT (0),
  CONSTRAINT d1sources_pkey PRIMARY KEY (srcluid)
);
CREATE TABLE l1tasks (
  taskguid varchar(32) NOT NULL DEFAULT '',
  taskname varchar(255) NOT NULL DEFAULT '',
  taskowner varchar(32) NOT NULL DEFAULT 'N''MyX''',
  taskcommon character(1) NOT NULL DEFAULT '',
  tasklastrun timestamp NOT NULL,
  tasklastrunlength bigint NOT NULL DEFAULT (0),
  tasklastresult blob,
  taskrunner varchar(50) NOT NULL DEFAULT '',
  taskrunnersettings blob,
  taskrunnerdata blob,
  CONSTRAINT l1tasks_pkey PRIMARY KEY (taskguid)
);
CREATE TABLE m1inbox (
  msgluid int AUTO_INCREMENT NOT NULL,
  msgid varchar(32) NOT NULL DEFAULT '',
  msguserid varchar(32) NOT NULL DEFAULT '',
  msgpriority bigint NOT NULL DEFAULT (0),
  msgread character(1) NOT NULL DEFAULT '',
  msgtarget varchar(128) NOT NULL DEFAULT '',
  CONSTRAINT m1inbox_pkey PRIMARY KEY (msgluid)
);
CREATE INDEX ix_m1inbox ON m1inbox (msgid);
CREATE INDEX ix_m1inbox_1 ON m1inbox (msguserid);
CREATE TABLE m1locks (
  locktype varchar(32) NOT NULL DEFAULT '',
  lockversion bigint NOT NULL DEFAULT (0),
  lockid varchar(32) NOT NULL DEFAULT '',
  lockdate timestamp NOT NULL,
  lockexpiration timestamp NOT NULL,
  CONSTRAINT m1locks_pkey PRIMARY KEY (locktype, lockversion)
);
CREATE TABLE m1messages (
  msgid varchar(32) NOT NULL DEFAULT '',
  msgownerid varchar(32) NOT NULL DEFAULT '',
  msgdate timestamp NOT NULL,
  fcid varchar(32) NOT NULL DEFAULT '',
  fcdatatype bigint NOT NULL DEFAULT (0),
  fcdata blob NOT NULL,
  CONSTRAINT m1messages_pkey PRIMARY KEY (msgid)
);
CREATE TABLE m1queue (
  msgluid int AUTO_INCREMENT NOT NULL,
  msgid varchar(32) NOT NULL DEFAULT '',
  msgqueued timestamp NOT NULL,
  msgexpire timestamp NOT NULL,
  msgfailcounter bigint NOT NULL DEFAULT (0),
  msgpriority bigint NOT NULL DEFAULT (0),
  msginteractive character(1) NOT NULL DEFAULT '',
  msgtarget varchar(128) NOT NULL DEFAULT '',
  CONSTRAINT m1queue_pkey PRIMARY KEY (msgluid)
);
CREATE INDEX ix_m1queue ON m1queue (msgid);
CREATE TABLE m1sent (
  msgluid int AUTO_INCREMENT NOT NULL,
  msgid varchar(32) NOT NULL DEFAULT '',
  msguserid varchar(32) NOT NULL DEFAULT '',
  msgprocessed character(1) NOT NULL DEFAULT '',
  msgtarget varchar(128) NOT NULL DEFAULT '',
  CONSTRAINT m1sent_pkey PRIMARY KEY (msgluid)
);
CREATE INDEX msgid ON m1sent (msgid);
CREATE TABLE s3aliases (
  alid varchar(32) NOT NULL DEFAULT '',
  allnkid varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT s3aliases_pkey PRIMARY KEY (alid),
  CONSTRAINT ix_s3aliases UNIQUE (allnkid)
);
CREATE TABLE s3changeinfo (
  evttarget varchar(32) NOT NULL,
  evtid varchar(32) NOT NULL,
  evttype varchar(32) NOT NULL,
  evtguid varchar(32) NOT NULL,
  evtdate timestamp NOT NULL,
  evtexpire timestamp NOT NULL,
  CONSTRAINT pk_s3changeinfo PRIMARY KEY (evttarget, evtid)
);
CREATE TABLE s3changepeer (
  peerid varchar(32) NOT NULL,
  peerdate timestamp NOT NULL,
  peerexpire timestamp NOT NULL,
  CONSTRAINT pk_s3changepeer PRIMARY KEY (peerid)
);
CREATE TABLE s3changequeue (
  evtid varchar(32) NOT NULL DEFAULT '',
  evtdate timestamp NOT NULL,
  evtsequence bigint NOT NULL DEFAULT (0),
  evtowner varchar(32) NOT NULL DEFAULT '',
  evtcmdtype varchar(32) NOT NULL DEFAULT '',
  evtcmdguid varchar(32) NOT NULL DEFAULT '',
  evtcmdluid bigint NOT NULL DEFAULT (0),
  CONSTRAINT s3changequeue_pkey PRIMARY KEY (evtid)
);
CREATE INDEX s3changequeue1 ON s3changequeue (evtcmdluid);
CREATE INDEX s3changequeue2 ON s3changequeue (evtdate);
CREATE TABLE s3dictionary (
  code int AUTO_INCREMENT NOT NULL,
  exact char(1) NOT NULL DEFAULT '',
  word varchar(80) NOT NULL DEFAULT '',
  CONSTRAINT s3dictionary_pkey PRIMARY KEY (exact, word),
  CONSTRAINT ix_s3dictionary UNIQUE (code)
);
CREATE TABLE s3extra (
  recid varchar(32) NOT NULL DEFAULT '',
  recdate timestamp NOT NULL,
  rectype varchar(64) NOT NULL DEFAULT '',
  recblob blob NOT NULL,
  CONSTRAINT s3extra_pkey PRIMARY KEY (recid)
);
CREATE TABLE s3extralink (
  objid varchar(32) NOT NULL DEFAULT '',
  fldid varchar(32) NOT NULL DEFAULT '',
  recid varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT s3extralink_pkey PRIMARY KEY (fldid, objid)
);
CREATE INDEX ix_s3extralink ON s3extralink (recid);
CREATE INDEX objid ON s3extralink (objid);
CREATE INDEX objid_2 ON s3extralink (objid);
CREATE INDEX objid_3 ON s3extralink (objid);
CREATE TABLE s3indexed (
  luid bigint NOT NULL DEFAULT (0),
  idxversion bigint NOT NULL DEFAULT (0),
  lnkindexed timestamp NOT NULL,
  CONSTRAINT s3indexed_pkey PRIMARY KEY (luid)
);
CREATE INDEX ix_s3indexed ON s3indexed (lnkindexed);
CREATE TABLE s3indices (
  code integer NOT NULL DEFAULT 0,
  luid integer NOT NULL DEFAULT 0,
  weight integer NOT NULL DEFAULT 0,
  CONSTRAINT s3indices_pkey PRIMARY KEY (code, luid)
);
CREATE INDEX s3indices3 ON s3indices (luid);
CREATE TABLE s3locks (
  locktype varchar(32) NOT NULL DEFAULT '',
  lockversion bigint NOT NULL DEFAULT (0),
  lockid varchar(32) NOT NULL DEFAULT '',
  lockdate timestamp NOT NULL,
  lockexpiration timestamp NOT NULL,
  CONSTRAINT s3locks_pkey PRIMARY KEY (locktype, lockversion)
);
CREATE TABLE s3objecthistory (
  hsid varchar(32) NOT NULL DEFAULT '',
  hsdate timestamp NOT NULL,
  objid varchar(32) NOT NULL DEFAULT '',
  vrid varchar(32) DEFAULT '',
  objtitle varchar(255) NOT NULL DEFAULT '',
  objcreated timestamp NOT NULL,
  objdate timestamp NOT NULL,
  objowner varchar(32) NOT NULL DEFAULT '',
  objtype varchar(64) NOT NULL DEFAULT '',
  objstate character(1) NOT NULL DEFAULT '',
  extlink varchar(32) NOT NULL DEFAULT '-',
  CONSTRAINT s3objecthistory_pkey PRIMARY KEY (hsid)
);
CREATE INDEX ix_s3objecthistory ON s3objecthistory (objid);
CREATE TABLE s3objects (
  objid varchar(32) NOT NULL DEFAULT '',
  vrid varchar(32) NOT NULL DEFAULT '',
  objtitle varchar(255) NOT NULL DEFAULT '',
  objcreated timestamp NOT NULL,
  objdate timestamp NOT NULL,
  objowner varchar(32) NOT NULL DEFAULT '',
  objtype varchar(64) NOT NULL DEFAULT '',
  objstate character(1) NOT NULL DEFAULT '',
  extlink varchar(32) NOT NULL DEFAULT '-',
  CONSTRAINT s3objects_pkey PRIMARY KEY (objid)
);
CREATE INDEX s3objects10 ON s3objects (objid, objstate);
CREATE INDEX s3objects31 ON s3objects (objstate, objcreated);
CREATE TABLE s3objectversions (
  vrid varchar(32) NOT NULL DEFAULT '',
  vrdate timestamp NOT NULL,
  vrparentid varchar(32),
  vrcomment varchar(255),
  objid varchar(32) NOT NULL DEFAULT '',
  vrtitle varchar(255) NOT NULL DEFAULT '',
  vrowner varchar(32) NOT NULL DEFAULT '',
  vrtype varchar(64) NOT NULL DEFAULT '',
  extlink varchar(32) NOT NULL DEFAULT '-',
  CONSTRAINT s3objectversions_pkey PRIMARY KEY (vrid)
);
CREATE INDEX ix_s3objectversions ON s3objectversions (objid);
CREATE INDEX vrparentid ON s3objectversions (vrparentid);
CREATE TABLE s3recycled (
  delrootid varchar(32) NOT NULL DEFAULT '',
  deldate timestamp NOT NULL,
  delobjid varchar(32) NOT NULL DEFAULT '',
  delcntid varchar(32) NOT NULL DEFAULT '',
  delowner varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT s3recycled_pkey PRIMARY KEY (delrootid)
);
CREATE INDEX delcntid ON s3recycled (delcntid);
CREATE TABLE s3recycledtree (
  lnkid varchar(32) NOT NULL DEFAULT '',
  delid varchar(32) NOT NULL DEFAULT '',
  cntlnkid varchar(32) NOT NULL DEFAULT '',
  lnkname varchar(128) NOT NULL DEFAULT '',
  lnkfolder character(1) NOT NULL DEFAULT '',
  objid varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT s3recycledtree_pkey PRIMARY KEY (lnkid),
  CONSTRAINT ix_s3recycledtree_names UNIQUE (cntlnkid, lnkname, delid)
);
CREATE INDEX ix_s3recycledtree ON s3recycledtree (delid);
CREATE INDEX objid2 ON s3recycledtree (objid);
CREATE TABLE s3schedulelog (
  scheduleid varchar(50) NOT NULL DEFAULT '',
  objectid varchar(32) NOT NULL DEFAULT '',
  systemid varchar(32) NOT NULL DEFAULT '',
  ownerid varchar(32) NOT NULL DEFAULT '',
  schedule timestamp NOT NULL,
  name varchar(64) NOT NULL DEFAULT '',
  command varchar(128) NOT NULL DEFAULT '',
  parameters blob NOT NULL,
  result bigint NOT NULL DEFAULT (0),
  resultdata blob NOT NULL,
  CONSTRAINT s3schedulelog_pkey PRIMARY KEY (scheduleid)
);
CREATE INDEX ix_s3schedulelog ON s3schedulelog (objectid);
CREATE TABLE s3schedulequeue (
  scheduleid varchar(50) NOT NULL DEFAULT '',
  objectid varchar(32) NOT NULL DEFAULT '',
  systemid varchar(32) NOT NULL DEFAULT '',
  state bigint NOT NULL DEFAULT (0),
  ownerid varchar(32) NOT NULL DEFAULT '',
  schedule timestamp NOT NULL,
  name varchar(64) NOT NULL DEFAULT '',
  command varchar(128) NOT NULL DEFAULT '',
  parameters blob NOT NULL,
  CONSTRAINT s3schedulequeue_pkey PRIMARY KEY (scheduleid)
);
CREATE INDEX ix_s3schedulequeue ON s3schedulequeue (schedule);
CREATE INDEX objectid ON s3schedulequeue (objectid);
CREATE TABLE s3tree (
  lnkid varchar(32) NOT NULL DEFAULT '',
  lnkluid int AUTO_INCREMENT NOT NULL,
  cntlnkid varchar(32) NOT NULL DEFAULT '',
  lnkname varchar(128) NOT NULL DEFAULT '',
  lnkfolder char(1) NOT NULL DEFAULT '',
  objid varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT s3tree_pkey PRIMARY KEY (lnkid),
  CONSTRAINT ix_s3linktree_luid UNIQUE (lnkluid),
  CONSTRAINT ix_s3treelinkage_names UNIQUE (cntlnkid, lnkname)
);
CREATE INDEX s3tree1 ON s3tree (objid);
CREATE INDEX s3tree2 ON s3tree (objid, lnkluid);
CREATE TABLE s3treesync (
  lnksrcid varchar(32) NOT NULL DEFAULT '',
  lnktgtid varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT s3treesync_pkey PRIMARY KEY (lnksrcid, lnktgtid)
);
CREATE INDEX ix_s3synctree ON s3treesync (lnktgtid);
CREATE TABLE umacls (
  path varchar(255) NOT NULL DEFAULT '',
  groupid varchar(32) NOT NULL DEFAULT '',
  inherit smallint NOT NULL DEFAULT (0),
  permissions varchar NOT NULL,
  ucounter varchar(32) NOT NULL DEFAULT '',
  CONSTRAINT umacls_pkey PRIMARY KEY (path, groupid, ucounter)
);
CREATE TABLE umgroups (
  groupid varchar(32) NOT NULL DEFAULT '',
  title varchar(255) NOT NULL DEFAULT '',
  description varchar NOT NULL DEFAULT '',
  authlevel bigint NOT NULL DEFAULT (0),
  data varchar NOT NULL,
  CONSTRAINT umgroups_pkey PRIMARY KEY (groupid)
);
CREATE TABLE umuseraccounts (
  userid varchar(32) NOT NULL,
  login varchar(64) NOT NULL,
  email varchar(255),
  passhash bigint,
  passhighhash bigint,
  language varchar(32),
  type bigint NOT NULL,
  added timestamp,
  lastlogin timestamp,
  CONSTRAINT umuseraccounts_pkey PRIMARY KEY (userid)
);
CREATE UNIQUE INDEX umuseraccounts_login ON umuseraccounts (login);
CREATE TABLE umusergroups (
  groupid varchar(32) NOT NULL,
  userid varchar(32) NOT NULL,
  ucounter varchar(32) NOT NULL,
  CONSTRAINT umusergroups_pkey PRIMARY KEY (userid, groupid, ucounter)
);
CREATE TABLE umuserprofiles (
  userid varchar(32) NOT NULL,
  scope varchar(64) NOT NULL,
  checked timestamp,
  lastaccess timestamp,
  profile varchar,
  CONSTRAINT umuserprofiles_pkey PRIMARY KEY (userid, scope)
);
CREATE TABLE v0votes (
  vtdate timestamp NOT NULL DEFAULT now(),
  vtgroup varchar(255) NOT NULL DEFAULT '',
  vtgroupfixed varchar(255) NOT NULL DEFAULT '',
  vtname varchar(255) NOT NULL DEFAULT '',
  vtnamefixed varchar(255) NOT NULL,
  vtaddress varchar(50) NOT NULL DEFAULT '',
  vtlanguage varchar(8) NOT NULL DEFAULT '',
  vtcountry varchar(8) NOT NULL DEFAULT ''
);