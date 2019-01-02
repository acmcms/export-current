.border-box{
	box-sizing:border-box;
	-moz-box-sizing:border-box;
	-ms-box-sizing:border-box;
	-webkit-box-sizing:border-box;
}

body {
	margin: 0;
	padding: 0 1% 15pt 1%;
	box-sizing:border-box;
	-moz-box-sizing:border-box;
	-ms-box-sizing:border-box;
	-webkit-box-sizing:border-box;
}

form {
	padding: 0;
	margin: 0;
}

hr {
	margin: 3px;
}

button {
	margin: 0;
	padding-left: 0;
	padding-right: 0;
	text-align: center;
	vertical-align: middle;
}

/* IE6 - fix button padding */
* html button {
	overflow: visible;
	width: 1px;
}
/* IE7 - fix button padding  */
*+html button {
	overflow: visible;
}

.btn {
	display: inline-block;
	padding: 1px 3px;
	margin: 1px;
	vertical-align: middle;
	border-radius: 3px;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
}

.btn img {
	float: left;
	margin: 2px;
	vertical-align: middle;
}

.tlbr {
	text-align: left;
	border-left: 1px solid #777777;
	padding-left: 2px;
	vertical-align: middle;
}

#menu-span {
	margin-top: 4px;
	padding-top: 4px;
}

.lo,.ao {
	background-color: #EEEEEE;
}

.lo:hover {
	background-color: #E9E9FF;
}

.ht {
	left: 0;
	top: 0;
	background-color: white;
}

.fm {
	min-width: 70%;
}

.ao,.fm,.ip {
	min-height: 250px;
}

.l1 {
	background-color: #F4F4F4;
	border: 1px solid #E2E2E2;
}

.l1:hover {
	background-color: #F0F0FF;
}

.le {
	background-color: #E2E2E2;
	border: 1px solid #F4F4F4;
}

.le:hover {
	background-color: #DDDDEE;
}

.lt {
	font-family: arial;
	font-size: 10pt;
	font-weight: bold;
}

.tt {
	font-family: arial;
	font-size: 12pt;
	font-weight: normal;
}

.tb {
	font-family: arial;
	font-size: 10pt;
	font-weight: normal;
}

.tn {
	font-family: arial;
	font-size: 15pt;
	font-weight: normal;
}

.ti {
	font-family: arial;
	font-size: 8pt;
	font-weight: normal;
}

.tm {
	font-family: arial;
	font-size: 7pt;
	font-weight: normal;
}

input,button,select,.fm,.fml,.mn {
	font-family: arial;
	font-size: 9pt;
	font-weight: normal;
}

.fm,.fml,.mn {
	background-color: #EEEEEE;
	border: solid 1px #CCCCCC;
	padding: 5px 5px 5px 5px;
}

.sm {
	color: #000000;
	font-family: arial;
	letter-spacing: -1px;
	font-size: 17px;
	line-height: 28px;
	font-weight: normal;
	padding: 2px 3px 2px 35px;
	height: 36px;
	background-color: #F0F0F0;
	background-repeat: no-repeat;
	background-position-x: 2px;
	background-position-y: 0px;
	background-image: url(/!/skin/ctrl-simple/icons/command-submit.32.gif);
}

.const {
	background-color: #FFFFFF;
	padding: 5px 5px 5px 5px;
	height: 200px;
	min-height: 0px;
	overflow: auto;
}

.inner {
	position: relative;
	background-color: #FFFFFF;
	border-style: solid;
	border-width: 1px;
	border-color: #CCCCCC;
	padding: 5px 5px 5px 5px;
	margin: 0 auto 0 auto;
	width: 600px;
	width: 85%;
	box-sizing:border-box;
	-moz-box-sizing:border-box;
	-ms-box-sizing:border-box;
	-webkit-box-sizing:border-box;
}

.ac {
	color: black;
	text-decoration: underline;
	font-weight: bold;
}

.cclass {
	font-family: arial;
	font-size: 20pt;
	font-weight: bold;
}

.cinfo {
	font-family: arial;
	font-size: 8pt;
	font-weight: normal;
	color: #AAAAAA;
}

.error {
	color: #FF0000;
}