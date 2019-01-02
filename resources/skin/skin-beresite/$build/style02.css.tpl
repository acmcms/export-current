<%
	//
	// beresite style03
	//	
	//
	
%><%FORMAT: 'css' %><%FINAL: 'text/css' %>

	html {
		background-color: #ffe;
	}
	body {
		background-color: #fff;
		border: 1px solid #ee0;
		max-width: 768px;
		margin: 10px auto;
	}
	h1, h2, h3 {
		color: #333;
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
	.document_body {
		line-height: 1.5em;
	}
	.document_body, .gradusnik, .navi_menu {
		padding: 2em 1.3em;
	}
	.document_body img {
		float: left;
		border: 1px solid #aaa;
		margin: -1em 4% 1em -4%;
		max-width: 66%;
	}
	.document_body :first-letter, .document_body:first-letter {
		font-size: 119%;
	}
	hr {
		border: 0;
		border-top: 1px solid #aaa;
		padding: 0;
		margin: 5px 0 4px 0;
		outline: 0;
		height: 1px;
		width: 100%;
	}
	.navi_td {
		border-left: 1px solid #aaa;
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