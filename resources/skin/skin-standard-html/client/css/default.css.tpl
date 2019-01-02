/* <%FINAL: 'text/css' %><%FORMAT: 'css' %><%= '/' + '*' %> */
{
	margin: 0;
	padding: 0;
}
header, footer, aside, nav, article, menu {
	display: block;
}
body{
	word-wrap: break-word; /* ie will not break layout, others have it set by default */
	margin: 0;
}
html{ /* ie - absolute positioning ? */
	position: relative;
	width:100%;
	height:100%;
	color:black;
	background:white;
}
html, form{
	padding:0;
	margin:0;
}
img { /* ie - nicer image resizing */
	-ms-interpolation-mode: bicubic;
}
pre, code, samp, kbd {
}
pre, code, samp, .code, .style--code {
	white-space: pre;
}
pre{
	background: #FAF8F0;
}
code, samp, kbd {
	display: block;
	max-width: 97%;
	max-height: 600px;
	font-family: monospaced, courier;
	font-weight: normal;
}
code, samp, kbd, .code, .__code {
	position: relative;
	padding: 0.5em 1em;
	border: 1px solid #BEBAB0;
	overflow: auto;
	color: black;
	background: #FAF8F0;
	text-wrap: none;
	word-wrap: normal;
	tab-size:4;
	-moz-tab-size:4;
	-o-tab-size:4;
}
samp, kbd {
	display: inline-block;
}
/* start-of-yahoo */
table, button, input, textarea, select {
	padding: 0;
	margin: 0;
	font-family:inherit;
	font-size:inherit;
	font-weight:inherit;
}
/*to enable resizing for IE*/
input, textarea, select {
	*font-size:100%;
}
input, select, button {
	line-height:1;
	vertical-align:middle;
}
/* end-of-yahoo */
table[align='center']{
	margin: 0 auto;
}
td, th {
	position: relative;
	vertical-align: top;
}

td[valign='bottom'], th[valign='bottom']{
	vertical-align: bottom;
}
td[valign='middle'], th[valign='middle']{
	vertical-align: middle;
}
/**
 * fix broken padding on mozilla buttons with spans
 */
button::-moz-focus-inner, input[type="reset"]::-moz-focus-inner, input[type="button"]::-moz-focus-inner, input[type="submit"]::-moz-focus-inner, input[type="file"] > input[type="button"]::-moz-focus-inner {
	border: 0;
	padding: 0;
}
dummy:focus{
	outline: 1px solid #7cf;
	border-color: #7cf;
}
/* <%/FORMAT%><%/FINAL%> */