--
-- PostgreSQL database dump
--

SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

--
-- Name: plpgsql; Type: PROCEDURAL LANGUAGE; Schema: -; Owner: -
--

CREATE PROCEDURAL LANGUAGE plpgsql;


SET search_path = public, pg_catalog;

--
-- Name: breakpoint; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE breakpoint AS (
	func oid,
	linenumber integer,
	targetname text
);


--
-- Name: frame; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE frame AS (
	level integer,
	targetname text,
	func oid,
	linenumber integer,
	args text
);


--
-- Name: proxyinfo; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE proxyinfo AS (
	serverversionstr text,
	serverversionnum integer,
	proxyapiver integer,
	serverprocessid integer
);


--
-- Name: targetinfo; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE targetinfo AS (
	target oid,
	schema oid,
	nargs integer,
	argtypes oidvector,
	targetname name,
	argmodes "char"[],
	argnames text[],
	targetlang oid,
	fqname text,
	returnsset boolean,
	returntype oid
);


--
-- Name: var; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE var AS (
	name text,
	varclass character(1),
	linenumber integer,
	isunique boolean,
	isconst boolean,
	isnotnull boolean,
	dtype oid,
	value text
);


SET default_tablespace = '';

SET default_with_oids = true;

--
-- Name: c0ChartLog; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE c0ChartLog (
    itrDate timestamp without time zone DEFAULT now() NOT NULL,
    grpDate bigint DEFAULT (0)::bigint NOT NULL,
    itrdeath bigint DEFAULT (0)::bigint NOT NULL,
    itmtype character varying(32) DEFAULT ''::character varying NOT NULL,
    itmguid character varying(32) DEFAULT ''::character varying NOT NULL,
    itmfolder character varying(64) DEFAULT ''::character varying NOT NULL,
    itmparam character varying(512) NOT NULL,
    itrtype character varying(32) DEFAULT ''::character varying NOT NULL,
    itruser character varying(32) DEFAULT ''::character varying NOT NULL,
    itraddress character varying(32) DEFAULT ''::character varying NOT NULL,
    itrlang character varying(8) DEFAULT ''::character varying NOT NULL,
    itrcountry character varying(8) DEFAULT ''::character varying NOT NULL,
    itrvalue bigint DEFAULT (0)::bigint NOT NULL
);


SET default_with_oids = false;

--
-- Name: cmLocks; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE cmLocks (
    locktype character varying(32) DEFAULT ''::character varying NOT NULL,
    lockversion bigint DEFAULT (0)::bigint NOT NULL,
    lockid character varying(32) DEFAULT ''::character varying NOT NULL,
    lockdate timestamp without time zone NOT NULL,
    lockexpiration timestamp without time zone NOT NULL
);


--
-- Name: cmShares; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE cmShares (
    path character varying(255) DEFAULT ''::character varying NOT NULL,
    alias character varying(255) DEFAULT ''::character varying NOT NULL,
    accesstype bigint DEFAULT (0)::bigint NOT NULL,
    skinnertype character varying(128) DEFAULT ''::character varying NOT NULL,
    languagemode character varying(8) DEFAULT 'N''*'''::character varying NOT NULL,
    commandmode character(1) DEFAULT ''::bpchar NOT NULL
);


--
-- Name: d1ChangeQueue; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1ChangeQueue (
    evtid character varying(32) DEFAULT ''::character varying NOT NULL,
    evtdate timestamp without time zone NOT NULL,
    evtsequence bigint DEFAULT (0)::bigint NOT NULL,
    evtowner character varying(32) DEFAULT ''::character varying NOT NULL,
    evtcmdtype character varying(32) DEFAULT ''::character varying NOT NULL,
    evtcmdguid character varying(32) DEFAULT ''::character varying NOT NULL,
    evtcmdluid bigint DEFAULT (0)::bigint NOT NULL
);


--
-- Name: d1Descriptions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1Descriptions (
    itmcrc character varying(32) DEFAULT ''::character varying NOT NULL,
    itmdescription bytea NOT NULL,
    itmhidden character(1) DEFAULT ''::bpchar NOT NULL
);


--
-- Name: d1Dictionary; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1Dictionary (
    code integer NOT NULL,
    exact character(1) DEFAULT ''::bpchar NOT NULL,
    word character varying(80) DEFAULT ''::character varying NOT NULL
);


--
-- Name: d1Dictionary_code_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE d1Dictionary_code_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: d1Dictionary_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE d1Dictionary_code_seq OWNED BY d1Dictionary.code;


--
-- Name: d1folders; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1folders (
    fldluid integer NOT NULL,
    srcluid bigint DEFAULT (0)::bigint NOT NULL,
    fldparentluid bigint DEFAULT (0)::bigint NOT NULL,
    fldname character varying(128) DEFAULT ''::character varying NOT NULL,
    fldcreated timestamp without time zone NOT NULL,
    fldchecked timestamp without time zone NOT NULL,
    fldcrc character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: d1folders_fldluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE d1folders_fldluid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: d1folders_fldluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE d1folders_fldluid_seq OWNED BY d1folders.fldluid;


--
-- Name: d1indexed; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1indexed (
    luid bigint DEFAULT (0)::bigint NOT NULL,
    idxversion bigint DEFAULT (0)::bigint NOT NULL,
    lnkindexed timestamp without time zone NOT NULL
);


--
-- Name: d1indices; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1indices (
    code bigint DEFAULT (0)::bigint NOT NULL,
    luid bigint DEFAULT (0)::bigint NOT NULL,
    weight bigint DEFAULT (0)::bigint NOT NULL
);


--
-- Name: d1itemlinkage; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1itemlinkage (
    itmguid character varying(32) DEFAULT ''::character varying NOT NULL,
    itmlink character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: d1items; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1items (
    itmguid character varying(32) DEFAULT ''::character varying NOT NULL,
    itmluid bigint DEFAULT (0)::bigint NOT NULL,
    itmcrc character varying(32) DEFAULT '*'::character varying NOT NULL,
    fldluid bigint DEFAULT (0)::bigint NOT NULL,
    itmname character varying(255) DEFAULT ''::character varying NOT NULL,
    itmcreated timestamp without time zone NOT NULL,
    itmsize bigint DEFAULT (0)::bigint NOT NULL,
    itmdate timestamp without time zone NOT NULL,
    itmtype character varying(32) DEFAULT ''::character varying NOT NULL,
    itmcomment character varying(128) DEFAULT ''::character varying NOT NULL,
    itmpreview character(1) DEFAULT ''::bpchar NOT NULL,
    itmsearchname character varying(255) DEFAULT 'N''*'''::character varying NOT NULL,
    itmlevel1name character varying(255) DEFAULT 'N''*'''::character varying NOT NULL,
    itmlevel2name character varying(255) DEFAULT 'N''*'''::character varying NOT NULL,
    itmlevel3name character varying(255) DEFAULT 'N''*'''::character varying NOT NULL
);


--
-- Name: d1known; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1known (
    guid character varying(32) DEFAULT ''::character varying NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL
);


--
-- Name: d1knownaliases; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1knownaliases (
    guid character varying(32) DEFAULT ''::character varying NOT NULL,
    alias character varying(255) DEFAULT ''::character varying NOT NULL
);


--
-- Name: d1locks; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1locks (
    locktype character varying(32) DEFAULT ''::character varying NOT NULL,
    lockversion bigint DEFAULT (0)::bigint NOT NULL,
    lockid character varying(32) DEFAULT ''::character varying NOT NULL,
    lockdate timestamp without time zone NOT NULL,
    lockexpiration timestamp without time zone NOT NULL
);


--
-- Name: d1queue; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1queue (
    queluid integer NOT NULL,
    queformation character varying(255) DEFAULT ''::character varying NOT NULL,
    quebusy timestamp without time zone NOT NULL,
    quequeued timestamp without time zone NOT NULL,
    quetext bytea,
    quehint character varying(64) DEFAULT '*'::character varying NOT NULL,
    quedelay bigint DEFAULT (0)::bigint NOT NULL
);


--
-- Name: d1queue_queluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE d1queue_queluid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: d1queue_queluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE d1queue_queluid_seq OWNED BY d1queue.queluid;


SET default_with_oids = true;

--
-- Name: d1SourceHistory; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1SourceHistory (
    logdate timestamp without time zone NOT NULL,
    srcluid bigint DEFAULT (0)::bigint NOT NULL,
    hstidentity character varying(32) DEFAULT ''::character varying NOT NULL,
    srchealth bigint DEFAULT (0)::bigint NOT NULL,
    srcready bigint DEFAULT (0)::bigint NOT NULL,
    srcalive character(1) DEFAULT ''::bpchar NOT NULL
);


SET default_with_oids = false;

--
-- Name: d1sources; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE d1sources (
    srcluid integer NOT NULL,
    srcguid character varying(32) DEFAULT ''::character varying NOT NULL,
    srchost character varying(50) DEFAULT ''::character varying NOT NULL,
    srcport bigint DEFAULT (0)::bigint NOT NULL,
    idxhost character varying(50) DEFAULT ''::character varying NOT NULL,
    idxport bigint DEFAULT (0)::bigint NOT NULL,
    srccreated timestamp without time zone NOT NULL,
    srcmaintainer character varying(32) DEFAULT ''::character varying NOT NULL,
    srcchecked timestamp without time zone NOT NULL,
    srcindex character(1) DEFAULT ''::bpchar NOT NULL,
    srcactive character(1) DEFAULT ''::bpchar NOT NULL,
    srchealth bigint DEFAULT (0)::bigint NOT NULL,
    srcready bigint DEFAULT (0)::bigint NOT NULL
);


--
-- Name: d1sources_srcluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE d1sources_srcluid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: d1sources_srcluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE d1sources_srcluid_seq OWNED BY d1sources.srcluid;


--
-- Name: l1Tasks; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE l1Tasks (
    taskguid character varying(32) DEFAULT ''::character varying NOT NULL,
    taskname character varying(255) DEFAULT ''::character varying NOT NULL,
    taskowner character varying(32) DEFAULT 'N''MyX'''::character varying NOT NULL,
    taskcommon character(1) DEFAULT ''::bpchar NOT NULL,
    tasklastrun timestamp without time zone NOT NULL,
    tasklastrunlength bigint DEFAULT (0)::bigint NOT NULL,
    tasklastresult bytea,
    taskrunner character varying(50) DEFAULT ''::character varying NOT NULL,
    taskrunnersettings bytea,
    taskrunnerdata bytea
);


--
-- Name: m1inbox; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE m1inbox (
    msgluid integer NOT NULL,
    msgid character varying(32) DEFAULT ''::character varying NOT NULL,
    msguserid character varying(32) DEFAULT ''::character varying NOT NULL,
    msgpriority bigint DEFAULT (0)::bigint NOT NULL,
    msgread character(1) DEFAULT ''::bpchar NOT NULL,
    msgtarget character varying(128) DEFAULT ''::character varying NOT NULL
);


--
-- Name: m1inbox_msgluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE m1inbox_msgluid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: m1inbox_msgluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE m1inbox_msgluid_seq OWNED BY m1inbox.msgluid;


--
-- Name: m1locks; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE m1locks (
    locktype character varying(32) DEFAULT ''::character varying NOT NULL,
    lockversion bigint DEFAULT (0)::bigint NOT NULL,
    lockid character varying(32) DEFAULT ''::character varying NOT NULL,
    lockdate timestamp without time zone NOT NULL,
    lockexpiration timestamp without time zone NOT NULL
);


--
-- Name: m1messages; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE m1messages (
    msgid character varying(32) DEFAULT ''::character varying NOT NULL,
    msgownerid character varying(32) DEFAULT ''::character varying NOT NULL,
    msgdate timestamp without time zone NOT NULL,
    fcid character varying(32) DEFAULT ''::character varying NOT NULL,
    fcdatatype bigint DEFAULT (0)::bigint NOT NULL,
    fcdata bytea NOT NULL
);


--
-- Name: m1queue; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE m1queue (
    msgluid integer NOT NULL,
    msgid character varying(32) DEFAULT ''::character varying NOT NULL,
    msgqueued timestamp without time zone NOT NULL,
    msgexpire timestamp without time zone NOT NULL,
    msgfailcounter bigint DEFAULT (0)::bigint NOT NULL,
    msgpriority bigint DEFAULT (0)::bigint NOT NULL,
    msginteractive character(1) DEFAULT ''::bpchar NOT NULL,
    msgtarget character varying(128) DEFAULT ''::character varying NOT NULL
);


--
-- Name: m1queue_msgluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE m1queue_msgluid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: m1queue_msgluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE m1queue_msgluid_seq OWNED BY m1queue.msgluid;


--
-- Name: m1sent; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE m1sent (
    msgluid integer NOT NULL,
    msgid character varying(32) DEFAULT ''::character varying NOT NULL,
    msguserid character varying(32) DEFAULT ''::character varying NOT NULL,
    msgprocessed character(1) DEFAULT ''::bpchar NOT NULL,
    msgtarget character varying(128) DEFAULT ''::character varying NOT NULL
);


--
-- Name: m1sent_msgluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE m1sent_msgluid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: m1sent_msgluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE m1sent_msgluid_seq OWNED BY m1sent.msgluid;


--
-- Name: s3aliases; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3aliases (
    alid character varying(32) DEFAULT ''::character varying NOT NULL,
    allnkid character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: s3ChangeInfo; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3ChangeInfo (
    evttarget character varying(32) NOT NULL,
    evtid character varying(32) NOT NULL,
    evttype character varying(32) NOT NULL,
    evtguid character varying(32) NOT NULL,
    evtdate timestamp without time zone NOT NULL,
    evtexpire timestamp without time zone NOT NULL
);


--
-- Name: s3changepeer; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3changepeer (
    peerid character varying(32) NOT NULL,
    peerdate timestamp without time zone NOT NULL,
    peerexpire timestamp without time zone NOT NULL
);


--
-- Name: s3changequeue; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3changequeue (
    evtid character varying(32) DEFAULT ''::character varying NOT NULL,
    evtdate timestamp without time zone NOT NULL,
    evtsequence bigint DEFAULT (0)::bigint NOT NULL,
    evtowner character varying(32) DEFAULT ''::character varying NOT NULL,
    evtcmdtype character varying(32) DEFAULT ''::character varying NOT NULL,
    evtcmdguid character varying(32) DEFAULT ''::character varying NOT NULL,
    evtcmdluid bigint DEFAULT (0)::bigint NOT NULL
);


--
-- Name: s3dictionary; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3dictionary (
    code integer NOT NULL,
    exact character(1) DEFAULT ''::bpchar NOT NULL,
    word character varying(80) DEFAULT ''::character varying NOT NULL
);


--
-- Name: s3dictionary_code_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE s3dictionary_code_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: s3dictionary_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE s3dictionary_code_seq OWNED BY s3dictionary.code;


--
-- Name: s3extra; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3extra (
    recid character varying(32) DEFAULT ''::character varying NOT NULL,
    recDate timestamp without time zone NOT NULL,
    recType character varying(64) DEFAULT ''::character varying NOT NULL,
    recBlob bytea NOT NULL
);


--
-- Name: s3ExtraLink; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3ExtraLink (
    objid character varying(32) DEFAULT ''::character varying NOT NULL,
    fldid character varying(32) DEFAULT ''::character varying NOT NULL,
    recid character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: s3indexed; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3indexed (
    luid bigint DEFAULT (0)::bigint NOT NULL,
    idxversion bigint DEFAULT (0)::bigint NOT NULL,
    lnkindexed timestamp without time zone NOT NULL
);


--
-- Name: s3indices; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3indices (
    code integer DEFAULT 0 NOT NULL,
    luid integer DEFAULT 0 NOT NULL,
    weight integer DEFAULT 0 NOT NULL
);


--
-- Name: s3locks; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3locks (
    locktype character varying(32) DEFAULT ''::character varying NOT NULL,
    lockversion bigint DEFAULT (0)::bigint NOT NULL,
    lockid character varying(32) DEFAULT ''::character varying NOT NULL,
    lockdate timestamp without time zone NOT NULL,
    lockexpiration timestamp without time zone NOT NULL
);


--
-- Name: s3objecthistory; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3objecthistory (
    hsid character varying(32) DEFAULT ''::character varying NOT NULL,
    hsdate timestamp without time zone NOT NULL,
    objid character varying(32) DEFAULT ''::character varying NOT NULL,
    vrid character varying(32) DEFAULT 'N''*'''::character varying,
    objtitle character varying(255) DEFAULT ''::character varying NOT NULL,
    objcreated timestamp without time zone NOT NULL,
    objdate timestamp without time zone NOT NULL,
    objowner character varying(32) DEFAULT ''::character varying NOT NULL,
    objtype character varying(64) DEFAULT ''::character varying NOT NULL,
    objstate character(1) DEFAULT ''::bpchar NOT NULL,
    extlink character varying(32) DEFAULT '-'::character varying NOT NULL
);


--
-- Name: s3Objects; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3Objects (
    objid character varying(32) DEFAULT ''::character varying NOT NULL,
    vrid character varying(32) DEFAULT 'N''*'''::character varying NOT NULL,
    objtitle character varying(255) DEFAULT ''::character varying NOT NULL,
    objcreated timestamp without time zone NOT NULL,
    objdate timestamp without time zone NOT NULL,
    objowner character varying(32) DEFAULT ''::character varying NOT NULL,
    objtype character varying(64) DEFAULT ''::character varying NOT NULL,
    objstate character(1) DEFAULT ''::bpchar NOT NULL,
    extlink character varying(32) DEFAULT '-'::character varying NOT NULL
);


--
-- Name: s3ObjectVersions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3ObjectVersions (
    vrid character varying(32) DEFAULT ''::character varying NOT NULL,
    vrdate timestamp without time zone NOT NULL,
    vrparentid character varying(32),
    vrcomment character varying(255),
    objid character varying(32) DEFAULT ''::character varying NOT NULL,
    vrtitle character varying(255) DEFAULT ''::character varying NOT NULL,
    vrowner character varying(32) DEFAULT ''::character varying NOT NULL,
    vrtype character varying(64) DEFAULT ''::character varying NOT NULL,
    extlink character varying(32) DEFAULT '-'::character varying NOT NULL
);


--
-- Name: s3recycled; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3recycled (
    delrootid character varying(32) DEFAULT ''::character varying NOT NULL,
    deldate timestamp without time zone NOT NULL,
    delobjid character varying(32) DEFAULT ''::character varying NOT NULL,
    delcntid character varying(32) DEFAULT ''::character varying NOT NULL,
    delowner character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: s3RecycledTree; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3RecycledTree (
    lnkid character varying(32) DEFAULT ''::character varying NOT NULL,
    delid character varying(32) DEFAULT ''::character varying NOT NULL,
    cntlnkid character varying(32) DEFAULT ''::character varying NOT NULL,
    lnkname character varying(128) DEFAULT ''::character varying NOT NULL,
    lnkfolder character(1) DEFAULT ''::bpchar NOT NULL,
    objid character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: s3schedulelog; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3schedulelog (
    scheduleid character varying(50) DEFAULT ''::character varying NOT NULL,
    objectid character varying(32) DEFAULT ''::character varying NOT NULL,
    systemid character varying(32) DEFAULT ''::character varying NOT NULL,
    ownerid character varying(32) DEFAULT ''::character varying NOT NULL,
    schedule timestamp without time zone NOT NULL,
    name character varying(64) DEFAULT ''::character varying NOT NULL,
    command character varying(128) DEFAULT ''::character varying NOT NULL,
    parameters bytea NOT NULL,
    result bigint DEFAULT (0)::bigint NOT NULL,
    resultdata bytea NOT NULL
);


--
-- Name: s3schedulequeue; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3schedulequeue (
    scheduleid character varying(50) DEFAULT ''::character varying NOT NULL,
    objectid character varying(32) DEFAULT ''::character varying NOT NULL,
    systemid character varying(32) DEFAULT ''::character varying NOT NULL,
    state bigint DEFAULT (0)::bigint NOT NULL,
    ownerid character varying(32) DEFAULT ''::character varying NOT NULL,
    schedule timestamp without time zone NOT NULL,
    name character varying(64) DEFAULT ''::character varying NOT NULL,
    command character varying(128) DEFAULT ''::character varying NOT NULL,
    parameters bytea NOT NULL
);


--
-- Name: s3tree; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3tree (
    lnkid character varying(32) DEFAULT ''::character varying NOT NULL,
    lnkluid integer NOT NULL,
    cntlnkid character varying(32) DEFAULT ''::character varying NOT NULL,
    lnkname character varying(128) DEFAULT ''::character varying NOT NULL,
    lnkfolder character(1) DEFAULT ''::bpchar NOT NULL,
    objid character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: s3tree_lnkluid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE s3tree_lnkluid_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


--
-- Name: s3tree_lnkluid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE s3tree_lnkluid_seq OWNED BY s3tree.lnkluid;


--
-- Name: s3treesync; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE s3treesync (
    lnksrcid character varying(32) DEFAULT ''::character varying NOT NULL,
    lnktgtid character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: umacls; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE umacls (
    path character varying(255) DEFAULT ''::character varying NOT NULL,
    groupid character varying(32) DEFAULT ''::character varying NOT NULL,
    inherit smallint DEFAULT (0)::smallint NOT NULL,
    permissions text NOT NULL,
    ucounter character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: umgroups; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE umgroups (
    groupid character varying(32) DEFAULT ''::character varying NOT NULL,
    title character varying(255) DEFAULT ''::character varying NOT NULL,
    description text NOT NULL,
    authlevel bigint DEFAULT (0)::bigint NOT NULL,
    data text NOT NULL
);


--
-- Name: umUserAccounts; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE umUserAccounts (
    userid character varying(32) NOT NULL,
    login character varying(64) NOT NULL,
    email character varying(255),
    passhash bigint,
    passhighhash bigint,
    language character varying(32),
    type bigint NOT NULL,
    added timestamp without time zone,
    lastlogin timestamp without time zone
);


--
-- Name: umusergroups; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE umusergroups (
    groupid character varying(32) NOT NULL,
    userid character varying(32) NOT NULL,
    ucounter character varying(32) NOT NULL
);


--
-- Name: umuserprofiles; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE umuserprofiles (
    userid character varying(32) NOT NULL,
    scope character varying(64) NOT NULL,
    checked timestamp without time zone,
    lastaccess timestamp without time zone,
    profile text
);


SET default_with_oids = true;

--
-- Name: v0votes; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE v0votes (
    vtdate timestamp without time zone DEFAULT now() NOT NULL,
    vtgroup character varying(255) DEFAULT ''::character varying NOT NULL,
    vtgroupfixed character varying(255) DEFAULT ''::character varying NOT NULL,
    vtname character varying(255) DEFAULT ''::character varying NOT NULL,
    vtnamefixed character varying(255) NOT NULL,
    vtaddress character varying(50) DEFAULT ''::character varying NOT NULL,
    vtlanguage character varying(8) DEFAULT ''::character varying NOT NULL,
    vtcountry character varying(8) DEFAULT ''::character varying NOT NULL
);


--
-- Name: code; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE d1Dictionary ALTER COLUMN code SET DEFAULT nextval('d1Dictionary_code_seq'::regclass);


--
-- Name: fldluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE d1folders ALTER COLUMN fldluid SET DEFAULT nextval('d1folders_fldluid_seq'::regclass);


--
-- Name: queluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE d1queue ALTER COLUMN queluid SET DEFAULT nextval('d1queue_queluid_seq'::regclass);


--
-- Name: srcluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE d1sources ALTER COLUMN srcluid SET DEFAULT nextval('d1sources_srcluid_seq'::regclass);


--
-- Name: msgluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE m1inbox ALTER COLUMN msgluid SET DEFAULT nextval('m1inbox_msgluid_seq'::regclass);


--
-- Name: msgluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE m1queue ALTER COLUMN msgluid SET DEFAULT nextval('m1queue_msgluid_seq'::regclass);


--
-- Name: msgluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE m1sent ALTER COLUMN msgluid SET DEFAULT nextval('m1sent_msgluid_seq'::regclass);


--
-- Name: code; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE s3dictionary ALTER COLUMN code SET DEFAULT nextval('s3dictionary_code_seq'::regclass);


--
-- Name: lnkluid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE s3tree ALTER COLUMN lnkluid SET DEFAULT nextval('s3tree_lnkluid_seq'::regclass);


--
-- Name: cmLocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY cmLocks
    ADD CONSTRAINT cmLocks_pkey PRIMARY KEY (locktype, lockversion);


--
-- Name: cmShares_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY cmShares
    ADD CONSTRAINT cmShares_pkey PRIMARY KEY (alias);


--
-- Name: d1ChangeQueue_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1ChangeQueue
    ADD CONSTRAINT d1ChangeQueue_pkey PRIMARY KEY (evtid);


--
-- Name: d1Descriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1Descriptions
    ADD CONSTRAINT d1Descriptions_pkey PRIMARY KEY (itmcrc);


--
-- Name: d1Dictionary_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1Dictionary
    ADD CONSTRAINT d1Dictionary_pkey PRIMARY KEY (exact, word);


--
-- Name: d1folders_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1folders
    ADD CONSTRAINT d1folders_pkey PRIMARY KEY (fldluid);


--
-- Name: d1indexed_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1indexed
    ADD CONSTRAINT d1indexed_pkey PRIMARY KEY (luid);


--
-- Name: d1indices_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1indices
    ADD CONSTRAINT d1indices_pkey PRIMARY KEY (code, luid);


--
-- Name: d1itemlinkage_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1itemlinkage
    ADD CONSTRAINT d1itemlinkage_pkey PRIMARY KEY (itmguid, itmlink);


--
-- Name: d1items_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1items
    ADD CONSTRAINT d1items_pkey PRIMARY KEY (itmguid);


--
-- Name: d1known_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1known
    ADD CONSTRAINT d1known_pkey PRIMARY KEY (guid);


--
-- Name: d1knownaliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1knownaliases
    ADD CONSTRAINT d1knownaliases_pkey PRIMARY KEY (alias, guid);


--
-- Name: d1locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1locks
    ADD CONSTRAINT d1locks_pkey PRIMARY KEY (locktype, lockversion);


--
-- Name: d1queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1queue
    ADD CONSTRAINT d1queue_pkey PRIMARY KEY (queformation);


--
-- Name: d1sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1sources
    ADD CONSTRAINT d1sources_pkey PRIMARY KEY (srcluid);


--
-- Name: ix_d1Dictionary; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1Dictionary
    ADD CONSTRAINT ix_d1Dictionary UNIQUE (code);


--
-- Name: ix_d1folders; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1folders
    ADD CONSTRAINT ix_d1folders UNIQUE (fldparentluid, fldname, srcluid);


--
-- Name: ix_d1items; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1items
    ADD CONSTRAINT ix_d1items UNIQUE (fldluid, itmname);


--
-- Name: ix_d1known; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY d1known
    ADD CONSTRAINT ix_d1known UNIQUE (name);


--
-- Name: ix_s3aliases; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3aliases
    ADD CONSTRAINT ix_s3aliases UNIQUE (allnkid);


--
-- Name: ix_s3dictionary; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3dictionary
    ADD CONSTRAINT ix_s3dictionary UNIQUE (code);


--
-- Name: ix_s3linktree_luid; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3tree
    ADD CONSTRAINT ix_s3linktree_luid UNIQUE (lnkluid);


--
-- Name: ix_s3RecycledTree_names; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3RecycledTree
    ADD CONSTRAINT ix_s3RecycledTree_names UNIQUE (cntlnkid, lnkname, delid);


--
-- Name: ix_s3treelinkage_names; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3tree
    ADD CONSTRAINT ix_s3treelinkage_names UNIQUE (cntlnkid, lnkname);


--
-- Name: l1Tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY l1Tasks
    ADD CONSTRAINT l1Tasks_pkey PRIMARY KEY (taskguid);


--
-- Name: m1inbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY m1inbox
    ADD CONSTRAINT m1inbox_pkey PRIMARY KEY (msgluid);


--
-- Name: m1locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY m1locks
    ADD CONSTRAINT m1locks_pkey PRIMARY KEY (locktype, lockversion);


--
-- Name: m1messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY m1messages
    ADD CONSTRAINT m1messages_pkey PRIMARY KEY (msgid);


--
-- Name: m1queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY m1queue
    ADD CONSTRAINT m1queue_pkey PRIMARY KEY (msgluid);


--
-- Name: m1sent_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY m1sent
    ADD CONSTRAINT m1sent_pkey PRIMARY KEY (msgluid);


--
-- Name: pk_s3ChangeInfo; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3ChangeInfo
    ADD CONSTRAINT pk_s3ChangeInfo PRIMARY KEY (evttarget, evtid);


--
-- Name: pk_s3changepeer; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3changepeer
    ADD CONSTRAINT pk_s3changepeer PRIMARY KEY (peerid);


--
-- Name: s3aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3aliases
    ADD CONSTRAINT s3aliases_pkey PRIMARY KEY (alid);


--
-- Name: s3changequeue_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3changequeue
    ADD CONSTRAINT s3changequeue_pkey PRIMARY KEY (evtid);


--
-- Name: s3dictionary_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3dictionary
    ADD CONSTRAINT s3dictionary_pkey PRIMARY KEY (exact, word);


--
-- Name: s3extra_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3extra
    ADD CONSTRAINT s3extra_pkey PRIMARY KEY (recid);


--
-- Name: s3ExtraLink_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3ExtraLink
    ADD CONSTRAINT s3ExtraLink_pkey PRIMARY KEY (fldid, objid);


--
-- Name: s3indexed_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3indexed
    ADD CONSTRAINT s3indexed_pkey PRIMARY KEY (luid);


--
-- Name: s3indices_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3indices
    ADD CONSTRAINT s3indices_pkey PRIMARY KEY (code, luid);


--
-- Name: s3locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3locks
    ADD CONSTRAINT s3locks_pkey PRIMARY KEY (locktype, lockversion);


--
-- Name: s3objecthistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3objecthistory
    ADD CONSTRAINT s3objecthistory_pkey PRIMARY KEY (hsid);


--
-- Name: s3Objects_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3Objects
    ADD CONSTRAINT s3Objects_pkey PRIMARY KEY (objid);


--
-- Name: s3ObjectVersions_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3ObjectVersions
    ADD CONSTRAINT s3ObjectVersions_pkey PRIMARY KEY (vrid);


--
-- Name: s3recycled_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3recycled
    ADD CONSTRAINT s3recycled_pkey PRIMARY KEY (delrootid);


--
-- Name: s3RecycledTree_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3RecycledTree
    ADD CONSTRAINT s3RecycledTree_pkey PRIMARY KEY (lnkid);


--
-- Name: s3schedulelog_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3schedulelog
    ADD CONSTRAINT s3schedulelog_pkey PRIMARY KEY (scheduleid);


--
-- Name: s3schedulequeue_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3schedulequeue
    ADD CONSTRAINT s3schedulequeue_pkey PRIMARY KEY (scheduleid);


--
-- Name: s3tree_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3tree
    ADD CONSTRAINT s3tree_pkey PRIMARY KEY (lnkid);


--
-- Name: s3treesync_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY s3treesync
    ADD CONSTRAINT s3treesync_pkey PRIMARY KEY (lnksrcid, lnktgtid);


--
-- Name: umacls_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY umacls
    ADD CONSTRAINT umacls_pkey PRIMARY KEY (path, groupid, ucounter);


--
-- Name: umgroups_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY umgroups
    ADD CONSTRAINT umgroups_pkey PRIMARY KEY (groupid);


--
-- Name: umUserAccounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY umUserAccounts
    ADD CONSTRAINT umUserAccounts_pkey PRIMARY KEY (userid);


--
-- Name: umusergroups_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY umusergroups
    ADD CONSTRAINT umusergroups_pkey PRIMARY KEY (userid, groupid, ucounter);


--
-- Name: umuserprofiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY umuserprofiles
    ADD CONSTRAINT umuserprofiles_pkey PRIMARY KEY (userid, scope);


--
-- Name: d1indices1; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX d1indices1 ON d1indices USING btree (luid);


--
-- Name: delcntid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX delcntid ON s3recycled USING btree (delcntid);


--
-- Name: evtcmdluid2; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX evtcmdluid2 ON s3changequeue USING btree (evtcmdluid);


--
-- Name: evtcmdluid25; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX evtcmdluid25 ON d1ChangeQueue USING btree (evtcmdluid);


--
-- Name: guid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX guid ON d1knownaliases USING btree (guid);


--
-- Name: itmlevel1name; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX itmlevel1name ON d1items USING btree (itmlevel1name);


--
-- Name: ix_d1indexed; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_d1indexed ON d1indexed USING btree (lnkindexed);


--
-- Name: ix_d1itemlinkage; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_d1itemlinkage ON d1itemlinkage USING btree (itmlink);


--
-- Name: ix_d3changequeue; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_d3changequeue ON d1ChangeQueue USING btree (evtdate);


--
-- Name: ix_m1inbox; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_m1inbox ON m1inbox USING btree (msgid);


--
-- Name: ix_m1inbox_1; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_m1inbox_1 ON m1inbox USING btree (msguserid);


--
-- Name: ix_m1queue; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_m1queue ON m1queue USING btree (msgid);


--
-- Name: ix_s3changequeue; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3changequeue ON s3changequeue USING btree (evtdate);


--
-- Name: ix_s3ExtraLink; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3ExtraLink ON s3ExtraLink USING btree (recid);


--
-- Name: ix_s3indexed; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3indexed ON s3indexed USING btree (lnkindexed);


--
-- Name: ix_s3objecthistory; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3objecthistory ON s3objecthistory USING btree (objid);


--
-- Name: ix_s3ObjectVersions; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3ObjectVersions ON s3ObjectVersions USING btree (objid);


--
-- Name: ix_s3RecycledTree; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3RecycledTree ON s3RecycledTree USING btree (delid);


--
-- Name: ix_s3schedulelog; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3schedulelog ON s3schedulelog USING btree (objectid);


--
-- Name: ix_s3schedulequeue; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3schedulequeue ON s3schedulequeue USING btree (schedule);


--
-- Name: ix_s3synctree; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ix_s3synctree ON s3treesync USING btree (lnktgtid);


--
-- Name: msgid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX msgid ON m1sent USING btree (msgid);


--
-- Name: objectid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX objectid ON s3schedulequeue USING btree (objectid);


--
-- Name: objid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX objid ON s3ExtraLink USING btree (objid);


--
-- Name: objid2; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX objid2 ON s3RecycledTree USING btree (objid);


--
-- Name: objid_2; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX objid_2 ON s3ExtraLink USING btree (objid);


--
-- Name: objid_3; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX objid_3 ON s3ExtraLink USING btree (objid);


--
-- Name: queluid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX queluid ON d1queue USING btree (queluid);


--
-- Name: s3indices3; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX s3indices3 ON s3indices USING btree (luid);


--
-- Name: s3Objects10; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX s3Objects10 ON s3Objects USING btree (objid, objstate);


--
-- Name: s3Objects31; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX s3Objects31 ON s3Objects USING btree (objstate, objcreated);


--
-- Name: s3tree18; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX s3tree18 ON s3tree USING btree (objid);


--
-- Name: s3tree9; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX s3tree9 ON s3tree USING btree (objid, lnkluid);


--
-- Name: srcluid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX srcluid ON d1folders USING btree (srcluid);


--
-- Name: umUserAccounts_login; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX umUserAccounts_login ON umUserAccounts USING btree (login);


--
-- Name: vrparentid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX vrparentid ON s3ObjectVersions USING btree (vrparentid);


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM pgsql;
GRANT ALL ON SCHEMA public TO pgsql;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

