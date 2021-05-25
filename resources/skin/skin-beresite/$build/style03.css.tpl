<%
	//
	// beresite style01
	//	
	//
	
%><%FORMAT: 'css' %><%FINAL: 'text/css' %>

	body {
		font-size: 100%/1.2em;
		font-family: Times, Times New Roman, Verdana, Arial;
	}
	.gradusnik {
		font-size: 80%;
		text-align: right;
		clear: both;
	}
	.gradusnik, .gradusnik A {
		color: #3bb;
	}
	h1, h2, h3, h4 {
		color: #3bb;
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
		margin: 4px 0;
		color: #3bb;
		border: 1px solid #3bb;
		background-color: #fff;
		border-radius: 5px;
		box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
	}
	nav.navi_menu a.current {
		display: block;
		padding: 2px 6px;
		margin: 4px 0;
		color: #fff;
		border: 1px solid #3bb;
		background-color: #3bb;
		border-radius: 5px;
		box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.4), 2px 2px 5px rgba(0,0,0,0.3);
	}
	.document_body {
		line-height: 1.5em;
	}
	.document_body, .gradusnik, .navi_menu {
		padding: 2em 6%;
	}
	.document_body img{
		float: left;
		border-radius: 1em;
		border: 1px solid #aaa;
		margin: -1em 4% 1em -4%;
		box-shadow: inset 2px 2px 5px rgba(100%,100%,100%,0.5), 0.3em 0.3em 0.7em rgba(0,0,0,0.3);
		max-width: 66%;
	}
	header hr, footer hr {
		border: 0;
		padding: 0;
		outline: 0;
		width: 100%;
		height: 1px;
	}
	header hr {
		border-top: 1px solid #3bb;
		margin: 5px 0 0 0;
	}
	footer hr {
		border-top: 1px solid #3bb;
		margin: 0 0 4px 0;
	}
	.navi_td {
		border-left: 1px solid #3bb;
		border-radius: 5em;
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