// DHTML Editing Component Constants for JavaScript
// Copyright 1998 Microsoft Corporation.  All rights reserved.
//

//
// Command IDs
//
DECMD_BOLD =                      5000
DECMD_COPY =                      5002
DECMD_CUT =                       5003
DECMD_DELETE =                    5004
DECMD_DELETECELLS =               5005
DECMD_DELETECOLS =                5006
DECMD_DELETEROWS =                5007
DECMD_FINDTEXT =                  5008
DECMD_FONT =                      5009
DECMD_GETBACKCOLOR =              5010
DECMD_GETBLOCKFMT =               5011
DECMD_GETBLOCKFMTNAMES =          5012
DECMD_GETFONTNAME =               5013
DECMD_GETFONTSIZE =               5014
DECMD_GETFORECOLOR =              5015
DECMD_HYPERLINK =                 5016
DECMD_IMAGE =                     5017
DECMD_INDENT =                    5018
DECMD_INSERTCELL =                5019
DECMD_INSERTCOL =                 5020
DECMD_INSERTROW =                 5021
DECMD_INSERTTABLE =               5022
DECMD_ITALIC =                    5023
DECMD_JUSTIFYCENTER =             5024
DECMD_JUSTIFYLEFT =               5025
DECMD_JUSTIFYRIGHT =              5026
DECMD_LOCK_ELEMENT =              5027
DECMD_MAKE_ABSOLUTE =             5028
DECMD_MERGECELLS =                5029
DECMD_ORDERLIST =                 5030
DECMD_OUTDENT =                   5031
DECMD_PASTE =                     5032
DECMD_REDO =                      5033
DECMD_REMOVEFORMAT =              5034
DECMD_SELECTALL =                 5035
DECMD_SEND_BACKWARD =             5036
DECMD_BRING_FORWARD =             5037
DECMD_SEND_BELOW_TEXT =           5038
DECMD_BRING_ABOVE_TEXT =          5039
DECMD_SEND_TO_BACK =              5040
DECMD_BRING_TO_FRONT =            5041
DECMD_SETBACKCOLOR =              5042
DECMD_SETBLOCKFMT =               5043
DECMD_SETFONTNAME =               5044
DECMD_SETFONTSIZE =               5045
DECMD_SETFORECOLOR =              5046
DECMD_SPLITCELL =                 5047
DECMD_UNDERLINE =                 5048
DECMD_UNDO =                      5049
DECMD_UNLINK =                    5050
DECMD_UNORDERLIST =               5051
DECMD_PROPERTIES =                5052

//
// Enums
//

// OLECMDEXECOPT  
OLECMDEXECOPT_DODEFAULT =         0 
OLECMDEXECOPT_PROMPTUSER =        1
OLECMDEXECOPT_DONTPROMPTUSER =    2

// DHTMLEDITCMDF
DECMDF_NOTSUPPORTED =             0 
DECMDF_DISABLED =                 1 
DECMDF_ENABLED =                  3
DECMDF_LATCHED =                  7
DECMDF_NINCHED =                  11

// DHTMLEDITAPPEARANCE
DEAPPEARANCE_FLAT =               0
DEAPPEARANCE_3D =                 1 

// OLE_TRISTATE
OLE_TRISTATE_UNCHECKED =          0
OLE_TRISTATE_CHECKED =            1
OLE_TRISTATE_GRAY =               2


// Command Type Enum
TBCMD_DEC		= 0 ;
TBCMD_DOC		= 1 ;
TBCMD_CUSTOM	= 2 ;
TBCMD_SELECT	= 3 ;


// Custom Commands
CM_IMAGE		= "EditImage";
CM_TABLE		= "EditTable";
CM_TABLEPROPERTIES		= "TableProperties";
CM_CELLPROPERTIES		= "CellProperties";
CM_SHOWDETAILS	= "ShowDetails";
CM_SHOWTABLEBORDER	= "ShowTableBorders";
CM_LINK			= "EditLink";
CM_PASTEWORD	= "PasteWord";
CM_PASTETEXT	= "PasteText";




//HTML_CUT		= "htmlCut";
//HTML_COPY		= "htmlCopy";
//HTML_PASTE		= "htmlPaste";
HTML_BOLD		= "htmlBold";
HTML_ITALIC		= "htmlItalic";
HTML_UNDERLINE	= "htmlUnderline";
HTML_STRIKETHROUGH	= "htmlStrikethrough";
HTML_SUBSCRIPT	= "htmlSubscript";
HTML_SUPERSCRIPT= "htmlSuperscript";
HTML_FONT		= "htmlFont";
HTML_COMMENT	= "htmlComment";
HTML_NBSP		= "htmlNBSP";
HTML_BREAK		= "htmlBreak";
HTML_PARAGRAPH	= "htmlParagraph";
HTML_RULE		= "htmlRule";
HTML_CENTER		= "htmlCenter";
HTML_LINK		= "htmlLink";
HTML_IMAGE		= "htmlImage";
HTML_SCRIPT		= "htmlScript";


GetClassNames	= getClassNames();