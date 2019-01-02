<%
	//
	// beresite style02
	//	
	//
	
%><%FORMAT: 'css' %><%FINAL: 'text/css' %>

	body {
		font-size: 100%/1.3em;
		font-family: Tahoma, Arial, Times, Times New Roman;
	}
	.gradusnik {
		font-size: 80%;
		text-align: right;
		clear: both;
	}
	.gradusnik, .gradusnik A {
		color: #e57;
	}
	.gradusnik span {
		float: right;
	}
	h1, h2, h3, h4 {
		color: #e57;
	}
	nav.navi_menu ul {
		padding: 0 0 0 0.6em;
		margin: 0;
		list-style: none;
	}
	nav.navi_menu li {
		position: relative;
	}
	nav.navi_menu a.inactive {
		display: block;
		padding: 2px 6px;
		margin: 6px 0;
		color: #e57;
		border: 1px solid #e57;
		background-color: #fff;
		border-radius: 7px;
		-moz-border-radius: 7px;
		box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
		-moz-box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
		-webkit-box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
	}
	nav.navi_menu a.current {
		display: block;
		padding: 2px 6px;
		margin: 6px 0;
		color: #fff;
		border: 1px solid #e57;
		background-color: #e57;
		border-radius: 7px;
		-moz-border-radius: 7px;
		box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.4), 2px 2px 5px rgba(0,0,0,0.3);
		-moz-box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.4), 2px 2px 5px rgba(0,0,0,0.3);
		-webkit-box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.4), 2px 2px 5px rgba(0,0,0,0.3);
	}
	.document_body {
		line-height: 1.5em;
	}
	.document_body, .gradusnik, .navi_menu {
		padding: 2em 6%;
	}
	.document_body img{
		float: left;
		border: 1px solid #aaa;
		margin: -1em 4% 1em -4%;
		border-radius: 1em;
		-moz-border-radius: 1em;
		box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.5), 0.3em 0.3em 0.7em rgba(0,0,0,0.3);
		-moz-box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.5), 0.3em 0.3em 0.7em rgba(0,0,0,0.3);
		-webkit-box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.5), 0.3em 0.3em 0.7em rgba(0,0,0,0.3);
		max-width: 66%;
	}
	hr {
		border: 0;
		border-top: 1px solid #e57;
		padding: 0;
		margin: 5px 0 4px 0;
		outline: 0;
		height: 1px;
		width: 100%;
	}
	.navi_td {
		border-left: 1px solid #e57;
		border-radius: 5em;
		-moz-border-radius: 5em;
	}
	nav.navi_menu {
		display: block;
		/* 
			position: fixed; -- not usable - not smart enough, no warkaround when doesn't fit the screen 
			width: 20%; -- from whole screen
		*/
		padding: 2em;
		margin: 0;
	}

<%/FINAL%><%/FORMAT%>