<%
	//
	// beresite style05
	//	
	//
	
%><%FORMAT: 'css' %><%FINAL: 'text/css' %>

	html {
		background-color: #303;
		color: #3f3;
	}
	body {
		background-color: #101;
		max-width: 768px;
		margin: 10px auto;
	}
	h1, h2, h3 {
		color: #cfc;
	}
	.gradusnik {
		font-size: 80%;
		text-align: right;
		clear: both;
	}
	nav.navi_menu ul {
		padding: 0 0 0 0.6em;
		margin: 0;
		list-style: none;
	}
	nav.navi_menu li {
		position: relative;
		margin: 0.7em 0;
	}
	a[href]{
		color: #ff3;
	}
	.document_body {
		line-height: 1.5em;
	}
	.document_body, .gradusnik, .navi_menu {
		padding: 2em 1.3em;
	}
	.document_body img {
		float: left;
		border: 2px solid #f70;
		margin: -1em 4% 1em -4%;
		max-width: 66%;
		border-radius: 1px;
		-moz-border-radius: 1px;
	}
	.document_body :first-letter, .document_body:first-letter {
		font-size: 119%;
	}
	hr {
		border: 0;
		border-top: 2px solid #cfc;
		padding: 0;
		margin: 5px 0 4px 0;
		outline: 0;
		height: 1px;
		width: 100%;
	}
	.navi_td {
		border-left: 2px solid #cfc;
	}
	nav.navi_menu {
		display: block;
		/* 
			position: fixed; -- not usable - not smart enough, no warkaround when doesn't fit the screen 
			width: 20%; -- from whole screen
		*/
		margin: 0;
	}

<%/FINAL%><%/FORMAT%>