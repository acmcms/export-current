/* <%FINAL: 'text/css' %><%FORMAT: 'css' %><%= '/' + '*' %> */

html, .zoom-window-body, .zoom-column-body, .zoom-row-body, .zoom-window-html, .zoom-document-html, .zoom-row-html, .ui-document-out{
	display: block;
	position: relative;
	width: 100%;
}

html, .zoom-window-html, .zoom-document-html, .ui-document-out{
	font-family: Avenir Next Condensed, Tahoma, Arial, Times New Roman, Serif;
	background-color: #DDD;
	color: #000;
	font-size: 100%;
	--height:100%;
}

.zoom-window-body, .zoom-column-body, .zoom-row-body{
	padding: 0;
	margin: 0;
}

body, .ui-document-in{
	margin: 0 auto;
}

.zoom-window-body{
	height: 100%;
	overflow: auto;
}

.zoom-document-body, .ui-document-in{
	background-color: #FFF;
}

.zoom-document-html{
	margin: 0 auto;
	line-height: 1.2em;
}


.pg-root{
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-content: center;
	align-items: center;
	min-height: 100%;
}
.pg-north{
	flex: 0 1 auto;
	align-self: auto;
	min-width: 100%;
	min-height: auto;
	width: 100%;
}
.pg-gapc{
	position: relative;
	flex: 1.3 1 auto;
	align-self: center;
	min-width: 66%;
	max-width: 100%;
	min-height: auto;
}
.pg-main{
	position: relative;
	flex: 2 1 auto;
	align-self: center;
	min-width: 83%;
	max-width: 100%;
	min-height: auto;
}
.pg-south{
	flex: 0 1 auto;
	align-self: auto;
	min-width: 100%;
	min-height: auto;
	width: 100%;
}

.pg-main-root{
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-content: center;
	align-items: center;
}
.pg-main-gapc{
	position: relative;
	flex: 1.3 1 auto;
	align-self: center;
	min-width: 15%;
	max-width: 33%;
}
.pg-main-main{
	position: relative;
	flex: 2 1 auto;
	align-self: center;
	min-width: 66%;
	max-width: 100%;
}


h1{
	font-size: 180%;
	border-bottom: 1pt dotted #CCC;
}
h2{
	font-size: 150%;
}
h3{
	font-size: 120%;
}
h1,h2,h3{
	line-height: 100%;
	-webkit-margin-before: 0;
	-webkit-margin-after: 0;
	margin: 0 0 0.5em 0;
	margin-after: 0.5em;
	padding: 0 0 0.2em 0;
	vertical-align: baseline;
	text-shadow: -0.05em -0.05em 0.09em rgba(100%, 100%, 100%, 1), 
				0.05em 0.05em 0.09em rgba(100%, 100%, 100%, 1), 
				0.09em 0.09em 0.05em rgba(0, 0, 0, 0.5);
	page-break-after: avoid;
}



.ui-blk-caption {
	display: inline-block; 
	opacity: 0.5;
}

@media (min-width: 560px) {
	.zoom-document-body, .ui-document-in {
		margin: 7pt auto 28pt auto;
		padding: 7pt 7pt 28pt 7pt;
		box-shadow: 0 0 6pt #999;
	}
	
	.ui-document-in {
		padding: 7pt 7pt 7pt 7pt;
		width: 93%;
	}
	
	.zoom-document-html {
		width: 93%;
	}
}
@media (min-width: 1280px) {
	.zoom-document-html, .zoom-window-html {
		font-size: 110%;
	}
	.zoom-document-html, .ui-document-in {
		width: 88%;
	}
}

@media (max-width: 800px) {
	.ui-blk-caption, .zoom-document-html, .zoom-window-html {
		font-size: 90%;
	}
}
@media (max-width: 559px) {
	.zoom-document-body{
		padding: 2pt 2pt 11pt 2pt;
	}
	.ui-blk-caption, .zoom-document-html, .zoom-window-html {
		font-size: 84%;
	}
	h1{
		font-size: 140%;
	}
	h2{
		font-size: 130%;
	}
}

.ui-pagetitle{
	margin: 0;
	padding: 0;
	border: 0;
	overflow: hidden; 
	text-overflow: ellipsis; 
	white-space: nowrap;
	height: 1em;
	display: block;
}

td.field, div.field, td.fldcollapse{
	text-align: right;
}
td.field, div.field{
	padding: 1pt 3pt 1pt 3pt;
	margin: 1pt 0 1pt 0;
}
td.fldcollapse{
	border-top: 0;
	padding: 0;
	margin: 0;
}
td.fldkey{
	text-align: right;
	width: 1%;
}
td.fldval{
	text-align: left;
	position: relative;
	overflow: auto;
	-max-width: 0;
	width: 1%;
	width: fit-content;
	width: -moz-fit-content;
	width: -webkit-fit-content;
}
td.submit, div.submit{
	margin-top: 1pt;
	padding-top: 1pt;
	padding: 1pt 3pt 1pt 3pt;
	margin: 1pt 0 1pt 0;
	text-align: right;
	background-color: #F0F0FF;
}

div.submit{
	border: 2pt solid #CCC;
	box-shadow: 2pt 2pt 2pt #999;
	margin-top: -3pt;
	margin-bottom: 3pt;
	padding: 3pt;
	border-radius: 0 0 0 5pt;
}


table.table>tbody>tr>td, table.table>thead>tr>th, table.table>tbody>tr>th {
	padding: 3pt;
	overflow: hidden;
}

form{
	position: static;
	min-width: 200pt;
	max-width: 100%;
	overflow: visible;
	text-align: right;
	padding: 0;
	margin: 0;
}
table.collapse{
	vertical-align: middle;
}
table.collapse>tbody>tr>td{
	padding: 0;
	margin: 0;
}
table.fldval, table.items, table.collapse{
	border-collapse:collapse;
}
table.fldval{
	background-color: #fff;
}
table.items>thead>tr>td{
	font-weight: bold;
}
td.name, div.name, table.items th, table.items>thead>tr>td, td.fldkey{
	white-space:nowrap;
}
table.items th, table.items td{
	text-align: left;
	vertical-align: top;
	padding: 2pt;
	margin: 0;
	border: 1pt solid #777;
}
.vscroll{
	overflow: visible;
	overflow-y: scroll;
}
.hscroll{
	overflow: visible;
	overflow-x: scroll;
}
.style--block{
	display: block;
}

pre, code, samp, kbd, .code, .style--code{
	font-family: monospaced, courier;
	font-size: 0.7em;
	font-weight: normal;
}

samp, .samp{
	text-overflow: ellipsis;
}

.ui-cell {
	margin: 2pt;
	padding: 2pt;
	text-align: left;
}

.cell-tp-date {
	white-space: nowrap;
}

div.idx-box-row, div.idx-box-cell {
	position: relative;
	max-width: 100%;
	overflow-x: auto;
}

div.idx-box-compact {
	display: inline-block;
	position: relative;
}

td.cell-tp-number{
	text-align: right;
	white-space: nowrap;
}

td.cell-tp-boolean > div.ui-cmd-text, td.ui-type-boolean, td.cell-tp-boolean[x-boolean]{
	font-weight: 500;
	color: #229;
}

td.cell-tp-boolean > div.ui-cmd-text[x-boolean='true'], td.ui-type-boolean[x-boolean='true'], td.cell-tp-boolean[x-boolean='true']{
	color: #171;
}

td.cell-tp-boolean > div.ui-cmd-text[x-boolean='false'], td.ui-type-boolean[x-boolean='false'], td.cell-tp-boolean[x-boolean='false']{
	color: #711;
	opacity: .6;
}

input[type=""]:invalid, 
input[type="text"]:invalid, 
input[type="string"]:invalid, 
input[type="number"]:invalid, 
input[type="password"]:invalid {
	background-color: #fffafa;
	outline: 4pt solid #fcc;
	outline: 400em solid rgba(255,0,0,0.25);
	outline-offset: -0.75pt;
}

select:invalid{
	outline: 4pt solid #ffcccc;
	outline: 400em solid rgba(255,100,100,0.25);
	outline-offset: -0.75pt;
}

input.el-radio[type="radio"]:invalid+label.el-radio {
	background-color: #ffe0e0;
}

input, select{
	min-width: 160pt;
}
input[type=""], input[type="text"], input[type="string"]{
	width: 100%;
}
input[type=number]{
	min-width: 60pt;
}
input[type=checkbox], input[type=radio]{
	min-width: 1em;
}
.field-compact input, .field-compact select, .zoom-row input{
	width: 100%;
}
img.icon{
	width: 1em;
	height: 1em;
	border: 0;
	vertical-align: -10%;
}
img.geo-flag{
	height: 1em;
	border: 0;
	vertical-align: -10%;
}
div.tbar, div.tbar-up, div.tbar-dn{
	position: relative;
	border: 2pt solid #9ff;
	background-color: #eff;
	color: black;
	padding: 0.2em 0.3em;
	clear: both;
	box-shadow: 2pt 2pt 2pt #999;
}
div.tbar-up{
	border-radius: 5pt 5pt 0 0;
}
div.tbar-dn{
	margin: -1.1em 0 1em 0;
	margin: 0em 0 0.6em 0;
	border-radius: 0 0 5pt 5pt;
}
div.user{
	float: right;
	font-size: 100%;
	border: 1pt solid #7ff;
	border-radius: 0.2em;
	background-color: #cff;
	color: black;
	margin: 0;
	padding: 0.2em 0.3em;
}
div.menu{
	float: left;
	font-size: 100%;
	border: 0 none;
	color: black;
	margin: 0;
	padding: 0 0.3em 0.1em 0;
}
div.user td{
	font-size: 100%;
	line-height: 100%;
	overflow: hidden;
	border: 0;
	margin: 0;
	padding: 0 1pt;
}

ui-hint, div.ui-hint{
	display: block;
	font-size: 75%;
	border: 1pt solid #7ff;
	border-radius: 0 0 4pt 4pt;
	background-color: #cff;
	color: #555;
	margin: 0 0 1pt 0;
	padding: 0;
}

ui-sequence, div.ui-sequence {
	display: block;
}

ui-sequence-item, span.ui-sequence-item-compact {
	display: inline-block;
	float: left;
}


.ui-menu-btn-ini{
	display: none;
}

.ui-menu-btn-btn{
	float: right;
}

div.ui-menu-ctn-all .hl-ui-false, div.ui-menu-ctn-all .hl-ui-, div.ui-menu-ctn-all .ui-cmd-link > .hl-ui-jump {
	display: list-item;
	display: block;
}

div.ui-menu-ctn-all div.hl-hd-true {
	display: block;
}

div.ui-menu-ctn-all tr.hl-hd-true {
	display: table-row;
}


.ui-menu-document, .ui-menu-window, .ui-menu-row, .ui-menu-column {
	clear: both; 
	padding: 1pt 0; 
	margin: 0.1em 0.1em 0.1em 1.2em; 
	background-color: #eee;
}

.ui-menu-row {
	box-shadow: 2pt 2pt 2pt #999;
	margin-bottom: 3pt;
	border-radius: 0 5pt 0 5pt;
}

.ui-menu-document{
	box-shadow: 2pt 2pt 2pt #999;
	margin-left: 0;
	border-radius: 0 5pt 0 5pt;
}

.ui-menu-noscript{
	font-size: 85%;
	padding: 0; 
	background-color: #9ff;
	box-shadow: 2pt 2pt 2pt #999;
	margin: -0.3em;
	border-radius: 0 5pt 0 5pt;

	position: absolute; 
	left: 0; 
	top: 0;
	min-height: 100%;
	min-width: 100%;
	height: 100%;
	opacity: 0.01;
	overflow: hidden;
	z-index: 100;
	transition: none;
}

.ui-menu-noscript.count-1{
	font-size: inherit;
}

.submit .ui-menu-noscript{
	left: initial; 
	top: initial;
	left: unset; 
	top: unset;
	right: 0; 
	bottom: 0;
}

.ui-menu-noscript:hover{
	height: auto;
	opacity: 1;
	transition: opacity 0.3s ease-out 300ms;
}

.ui-menu-ns-scrn{
	min-width: 0;
	width: 0;
	overflow: hidden;
}

.ui-menu-noscript:hover > .ui-menu-ns-scrn{
	min-width: 8em;
	width: auto;
	overflow: show;
}

.ui-menu-noscript > table {
	min-width: 11em;
}

.ui-form-window2, .ui-white-padding {
	padding: 7pt;
	box-shadow: 0 0 6pt #999;
	background-color: #fff;
}


.ui-view-table-document, .ui-view-table-window {
	width: 100%;
}

.ui-view-table-row, .ui-view-table-column, .ui-view-table-compact {
	width: 100%;
	font-size: 90%;
}

.ui-view-table-row {
	box-shadow: 2pt 2pt 2pt #999;
}

.ui-list-table-document, .ui-list-table-window {
	font-size: 90%;
}

.ui-list-table-row, .ui-list-table-column, .ui-list-table-compact {
	font-size: 80%;
}


.ui-edit-table-document, .ui-edit-table-window {
	width: 100%;
}

.ui-edit-table-row, .ui-edit-table-column, .ui-edit-table-compact {
	width: 100%;
	font-size: 90%;
}

.ui-edit-table-row {
	position: relative;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-direction: row;
	flex-direction: row;
	-webkit-flex-flow: row;
	flex-flow: row;
}

span.ui-fldbox-compact {
	display: inline-block;
	-webkit-flex: 1 1 auto;
	flex: 1 1 auto;
	opacity: 0.75;
	transition: width 0.33s ease-in-out 0s, opacity 0.25s ease-in 330ms;
	overflow: hidden;
	width: 30%;
	width: 20px;
	padding: 2pt;
	margin: 0 0.2pt;
	border-left: 1pt solid rgba(0,0,0,0);
	border-top: 1pt solid rgba(0,0,0,0);
	background-clip: padding-box; 
}

span.ui-fldbox-compact:last-child{
	border-right: 2pt solid rgba(0,0,0,0);
}

span.ui-fldbox-compact:hover, span.ui-fldbox-compact:focus {
	min-width: content;
	max-width: content;
	width: 50%;
	width: 200px;
	opacity: 1;
	transition: width 0.33s ease-in-out 0s, opacity 0.15s ease-out 230ms;
}

div.ui-map {
	max-width: 100%;
}

.ui-map-document, .ui-map-window {
	width: 100%;
}

div.ui-map-cell, div.ui-map-compact {
	font-size: .66em;
	letter-spacing: -.0125em;
	width: 100%;
	height: 100%;
	margin: 0;
	border: 0;
	overflow: auto;
}

div.ui-map-compact col.ui-map-value, 
div.ui-map-cell col.ui-map-value, 
div.ui-map-column col.ui-map-value,
div.ui-map-compact tr > :nth-child(3), 
div.ui-map-cell tr > :nth-child(3), 
div.ui-map-column tr > :nth-child(3) {
	max-width: 32em;
	width: fit-content;
	display: block;
	font-weight: bold;
	margin-left: 1.75em;
	margin-top: -.125em;
	margin-bottom: .125em;
	padding-top: 0;
	border: 0;
}

div.ui-map-compact tr > :nth-child(2)::after, 
div.ui-map-cell tr > :nth-child(2)::after, 
div.ui-map-column tr > :nth-child(2)::after {
	content: ' =';
	font-style: normal;
	font-weight: bold;
}


div.ui-map-compact tr > :nth-child(2), 
div.ui-map-cell tr > :nth-child(2), 
div.ui-map-column tr > :nth-child(2) {
	max-width: 24em;
	width: fit-content;
	display: block;
	font-style: italic;
	margin-top: .125em;
	margin-bottom: -.125em;
	padding-bottom: 0;
	border-right: 0;
	border-bottom: 0;
}

div.ui-map-compact thead>tr,
div.ui-map-compact col.ui-map-index-compact, 
div.ui-map-compact tr > :nth-child(1),
div.ui-map-cell thead>tr,
div.ui-map-cell col.ui-map-index-cell,
div.ui-map-cell tr > :nth-child(1) {
	display: none;
	visibility: collapse;
}

div.ui-map-compact tr, 
div.ui-map-cell tr {
	display: inline;
}

.ui-message-table-document, .ui-message-table-window {
	width: 100%;
	padding: 1em;
	table-layout: fixed;
}

.ui-message-west-document, .ui-message-west-window {
	width: 5em;
	padding: 0.5em 0;
	text-align: center;
}

.ui-message-east-document, .ui-message-east-window, .ui-message-east-cell, .ui-message-east-compact {
	width: 100%;
}

.ui-message-table-row {
	width: 100%;
	padding: 0.5em;
	font-size: 90%;
	table-layout: fixed;
}

.ui-message-west-row {
	width: 3em;
	padding: 0.25em 0;
	text-align: center;
}

.ui-message-table-column {
	margin: auto;
	padding: 0.5em;
	font-size: 90%;
	table-layout: fixed;
}

.ui-message-table-cell {
	padding: 0.5em;
	font-size: 90%;
}

.ui-message-table-compact {
	padding: 0.2em;
	font-size: 90%;
}

.ui-message-west-cell {
	width: 3em;
	padding: 0.5em 0;
	text-align: center;
}

.ui-message-west-compact {
	width: 2em;
	padding: 0.5em 0;
	text-align: center;
}

 .ui-wg-message-title{
 }
 .ui-wg-message-code{
 }
 .ui-wg-message-text{
 }
 .ui-wg-message-detail{
 }


.icon.ui-message-icon-document, .icon.ui-message-icon-window {
	width: 4em;
	height: 4em;
	opacity: 0.9;
}

.icon.ui-message-icon-compact {
	width: 1em;
	height: 1em;
}

.icon.ui-message-icon-row, .icon.ui-message-icon-cell {
	width: 2em;
	height: 2em;
	opacity: 0.9;
}

.ui-table-container {
	overflow-x: auto;
	text-align: left;
	--border-radius: 0 5pt 0 0;
	box-shadow: inset -10pt 50pt 100pt -40pt #FFF;
	background-image:	
		linear-gradient(
			45deg, 
			rgba(90%,90%,90%,0.2) 15%, 
			transparent 15%, 
			transparent 85%, 
			rgba(90%,90%,90%,0.2) 85%, 
			rgba(90%,90%,90%,0.2)
		), 
		linear-gradient(
			-45deg, 
			rgba(80%,80%,80%,0.3) 15%, 
			transparent 15%, 
			transparent 85%, 
			rgba(100%,100%,100%,0.4) 85%, 
			rgba(100%,100%,100%,0.4));
	background-size:12pt 12pt;
}

.ui-table-screen-row, .ui-table-screen-document, .ui-table-screen-window{
	box-shadow: 2pt 2pt 2pt #999;
	margin-bottom: 3pt;
	border-radius: 5pt 5pt 0 5pt;
}

.ui-table-screen-document, .ui-table-screen-{
	background-color2: #eee;
}

.table-list, .table-view, .table-edit, .table-message{
	float: left;
	background-color: #eee;
	box-shadow: inset 0 0 10pt 3pt #ccc;
}


.table-view, .table-edit, .table-message{
	min-width: 100%;
}

div.ui-cmd-icon{
	margin-top: 0.2em; 
	vertical-align: middle;
	float: left;
	height: 1.1em;
	width: 1.2em;
	line-height: 1.1em;
}

div.ui-cmd-text{
	vertical-align: middle;
}

div.ui-cmd-icon ~ div.ui-cmd-text{
	margin-left: 1.2em;
}

div.idx-box-compact > div.ui-cmd-icon{
	margin-top: 0;
}

div.ui-paragraph {
	line-height: 1.5em;
	margin-bottom: 0.3em;
}


a.ui-cmd-link, a.ui-cmd-link-cell{
	color: black;
	display: block;
	text-decoration: none;
}

a.ui-cmd-link-compact{
	color: black;
	display: inline-block;
	text-decoration: none;
}

.ui-cmd-link-group > a.ui-cmd-link-compact:not(:first-of-type):before{
	content: '|';
	padding: 0 .35em;
}

.ui-cmd-preview-block{
	display: block; 
	margin: .1em .1em .1em 1.2em;
}

.ui-menu-btn-btn, .menu-button-active, .menu-button, button.ui-button, span.ui-button{
	line-height: 1.5em;
	height: auto;
	min-height: 1.6em;
	position: relative;
	display: block;
	display: inline-block;
	white-space: nowrap;
	vertical-align: middle;
	border: 1px solid #AAA;
	color: #000;
	background-color: #EEE;
	margin: 0;
	padding: 0 2pt;
	outline: 0;
	cursor: default;
	box-sizing: border-box;
	border-radius: 3px;
	box-shadow: 1pt 1pt 3pt rgba(0, 0, 0, 0.4);
}

.ui-menu-btn-btn:hover, 
.ui-menu-btn-btn:focus, 
.menu-button:hover, 
.menu-button:focus, 
button.ui-button:hover, 
span.ui-button:hover, 
button.ui-button:focus, 
span.ui-button:focus {
	border-width: 0 2px 2px 0;
	box-shadow: 2pt 2pt 4pt rgba(0, 0, 0, 0.4);
	border-right-color: #555;
	border-bottom-color: #555;
	outline: 0 !important;
}

.ui-menu-btn-btn:active, .menu-button-active, .menu-button:active, button.ui-button:active, span.ui-button:active{
	border-width: 2px 0 0 2px;
	box-shadow: 0 0 2pt rgba(0, 0, 0, 0.4);
	outline: 0 !important;
}

a.ui-button, a.ui-button:focus, a.ui-button:active, a.ui-button:hover, a.ui-button:visited{
	outline: 0 !important;
	padding:0;
	margin:0;
	border:0;
}

.submit > a.ui-button > .menu-button > .menu-element, 
.submit > a.ui-button > .menu-button > .menu-element-active, 
.submit > a.ui-button > .menu-button-active > .menu-element-active {
	height: 1.5em;
	padding: 0 1em 0 1.2em;
}

.submit > a.ui-button > .menu-button > .menu-element > img, 
.submit > a.ui-button > .menu-button > .menu-element-active > img, 
.submit > a.ui-button > .menu-button-active > .menu-element-active > img {
	top: 0.2em;
}

.ui-fld-editor-textarea{
	width: 100%;
	min-height: 100px;
	max-height: 600px;
	overflow: scroll;
}





.hl-ui-title {
	font-size: 120%;
}
.hl-ui-small {
	font-size: 80%;
}
.hl-ui-false, .ui-cmd-link > .hl-ui-jump {
	display: none;
}
.hl-ui-true, .hl-ui- {
}


.hl-bn-none {
	background-color: #FAFAFA;
}
.hl-bn-,
.hl-bn-false,
.hl-bn-public,
.hl-bn-normal {
	background-color: #F0FFF7;
}
.hl-bn-admin {
	background-color: #FFF5F0;
}
.hl-bn-disabled {
	background-color: #F0F0F0;
	opacity: 0.55;
}
.hl-bn-inactive {
	background-color: #F7F7F7;
	opacity: 0.75;
}
.hl-bn-local,
.hl-bn-blue {
	background-color: #E7FAFF;
}
.hl-bn-true,
.hl-bn-user,
.hl-bn-attention {
	background-color: #F7FFF0;
}
.hl-bn-priveleged,
.hl-bn-warn0 {
	background-color: #ffc;
}
.hl-bn-warn1 {
	background-color: #fec;
}
.hl-ERROR,
.hl-bn-error,
.hl-bn-warn2 {
	background-color: #fdd;
}
.hl-CRITICAL,
.hl-bn-alert {
	background-color: #fbb;
}

.hl-NORMAL {
	background-color: #dfe;
}
.hl-COLD {
	background-color: #def;
}
.hl-ATTENTION {
	background-color: #ffd;
}

.hl-MAYBE {
	opacity: .5;
}

div.hl-hd-true, tr.hl-hd-true {
	opacity: 0.6;
	display: none;
}


.ui-secondary {
	opacity: 0.66;
	transition: opacity 0.3s ease-in-out 0s;
}

.ui-secondary:hover, .ui-secondary:focus {
	opacity: 1;
	transition: opacity 0.1s ease-in-out 250ms;
}





.ui-align-center{
	text-align: center;
}

img.ui-illustration, div.ui-illustration, div.ui-illustration-central{
	border: 1px dotted #777; 
	margin: 3pt 3pt 1em 3pt;
	page-break-inside: avoid;
}
img.ui-small{
	zoom:0.5;
}
img.ui-medium{
	zoom:0.67;
}
@-moz-document url-prefix() {
	img.ui-small{
		max-width: 50%;
		max-height: 200pt;
	}
}
div.ui-small{
	width: 60%;
	zoom: 0.9; 
	transform: scale(0.9);
	font-size: 90%; 
}
div.ui-medium{
	width: 77%;
	zoom: 0.96; 
	transform: scale(0.96);
	font-size: 96%; 
}
div.ui-illustration-central{
	margin: 3pt auto 1em auto; 
	padding:3pt; 
	text-align: center;
	min-width: 200pt;
}

@media (max-width: 800px) {

	.icon.ui-message-icon-document, .icon.ui-message-icon-window {
		width: 3.5em;
		height: 3.5em;
		opacity: 0.9;
	}
	
	.ui-message-west-document, .ui-message-west-window {
		width: 4em;
	}
	
	.ui-message-table-document, .ui-message-table-window {
		padding: .5em
	}
	
}

@media (max-width: 559px) {
	img.ui-small{
		zoom:0.75;
	}
	img.ui-medium{
		zoom:0.85;
	}
	div.ui-small{
		width: 80%;
	}
	div.ui-medium{
		width: 87%;
	}

	.icon.ui-message-icon-document, .icon.ui-message-icon-window {
		width: 3em;
		height: 3em;
		opacity: 0.9;
	}
	
	.ui-message-west-document, .ui-message-west-window {
		width: 3.1em;
	}
	
	.ui-message-table-document, .ui-message-table-window {
		padding: .3em
	}
	
}



.ui-label{
	font-size: 0.9em;
	display: inline-block;
	border: 1pt solid #ddd;
	border-radius: 0.5em;
	background-color: #eee;
	color: #00A;
	padding: 0.025em 0.15em;
	margin: 0.1em;
	max-width: 17em;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.ui-left{
	float: left;
}

.ui-right{
	float: right;
}

.ui-clear{
	clear: both;
	overflow: hidden;
	height: 0;
	border: 0;
	padding: 0;
	margin: 0;
}

.ui-pagebreak{
	margin-bottom: 15em;
}





.ui-chk-master{
}

.ui-chk-slave{
	display: none;
	transition: opacity 0.3s ease-in;
}

.ui-chk-master:hover ~ .ui-chk-slave, .ui-chk-master:active ~ .ui-chk-slave {
	display: block;
	position: absolute;
	overflow: hidden;
	height: 0;
	opacity: 0;
}

.ui-chk-master:checked ~ .ui-chk-slave {
	display: block;
	position: static;
	overflow: visible;
	height: auto;
	opacity: 1;
}

.el-radio-tab-item {
	display: none;
}

div.el-radio-sel-item {
	/* prevents transition on inputs
	display: none;
	content-visibility: hidden;
	*/
	margin: 0 0 0 1em;
	height: 0;
	width: 0;
	overflow: hidden;
	visibility: hidden;
}

div.el-radio-sel-item input, 
div.el-radio-sel-item select{
	opacity: 0;
	visibility: hidden;
	transition: opacity 3ms, visibility 3ms;
}

input.el-radio:checked + label.el-radio + div.el-radio-sel-item {
	/* prevents transition on inputs
	display: block;
	content-visibility: visible;
	*/
	height: unset;
	width: unset;
	visibility: unset;
}

input.el-radio:checked + label.el-radio + div.el-radio-sel-item input, 
input.el-radio:checked + label.el-radio + div.el-radio-sel-item select{
	opacity: 1;
	visibility: visible;
}

input.el-radio {
	display: none;
}
label.el-radio {
	clear: both;
}
label.st-radio-tab {
	opacity: 0.66;
	border: 2pt solid #9ff;
	background-color: #eff;
	color: #AAA;
	padding: 0.2em 0.3em;
}
input.el-radio:checked + label.st-radio-tab, .st-radio-tab:checked {
	opacity: 1;
	border-radius: 5pt 5pt 0 0;
	background-color: #eff;
	border-color: #9ff;
	color: black;
	box-shadow: 2pt 2pt 2pt #999;
}

label.st-radio-sel {
	display: block;
	opacity: 0.66;
	color: black;
	padding: 0.2em 0.3em;
	line-height: 1.05em;
	margin-left: 1.0em;
}

input.el-radio:checked + label.st-radio-sel, .st-radio-sel:checked {
	opacity: 1;
}
label.st-radio-sel::before {
	content: "◯ "; /* ◇ ⊙ ◯ ◎ ◦ ⚪ ⨀ */
	margin-left: -1.2em;
	
	position: absolute;
	width: 1em;
	height: 1em;
	margin: 0 0.2em 0 -1.2em;
	color: transparent;
	border-radius: 50%;
	box-shadow: inset 0 0 0 0.12em rgba(0,0,0,0.8), inset 0 0 0 0.3em #fff;
}

input.el-radio + label.st-radio-sel:hover::before {
	box-shadow: inset 0 0 0 0.12em rgba(0,0,0,0.9), inset 0 0 0 0.3em #fff, inset 0 0 0 0.5em rgba(0,0,0,0.6);
}

input.el-radio:checked + label.st-radio-sel::before {
	content: "◯ "; /* ◈ ⁕ ⊗ ◉ ⚫ ✓ ✔ ⦿ ⬤ */

	box-shadow: inset 0 0 0 0.12em #000, inset 0 0 0 0.3em #fff, inset 0 0 0 0.7em #000;
}

input.el-radio + label.st-radio-sel:active::before {
	box-shadow: inset 0 0 0 0.12em rgba(0,0,0,0.8), inset 0 0 0 0.3em #fff, inset 0 0 0 0.8em #000;
}


.ui-bold{
	font-weight: bold;
}

.ui-nowrap{
	white-space: nowrap;
}

.ui-chk-master, .ui-chk-label{
	line-height: 1.1em; 
	float:right; 
	height: 1.1em; 
}

.ui-chk-master{
	width: 1em;
}

.ui-chk-label{
	margin-left: 0.3em;
}

@media print {
	html{
		font-size: 80%;
	}
	.no-print{
		display: none;
	}
	.no-print-margin{
		margin: 0;
		padding: 0;
	}
	.zoom-document-body,.ui-document-in,.ui-table-screen-row,div.submit,.ui-table-screen-document,.ui-table-screen-window,.table-list,.table-view,.table-edit,.table-message{
		box-shadow: unset;
	}
	.ui-table-container{
		background: #FFF;
		box-shadow: unset;
	}
	.table-list-tbody{
		white-space: auto;
	}
	.ui-chk-master, .ui-chk-label{
		display: none;
	}
	.ui-chk-slave{
		display: block;
	}
}

[data-type="numeric"] {
    white-space: nowrap;
}


.ui-cmd-icon-char {
}

.ui-icon-unknown:empty::before {
	content: '⁇';
	opacity: 37%;
}



/* <%/FORMAT%><%= '*' + '/' %><%/FINAL%> */