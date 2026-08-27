<%
	// Slightly augments the response and passes it to 'html-page' template of 
	// 'skin-standard-html' skin.

%><%OUTPUT: head %><%
	%><style><%FORMAT: 'css' %>
		html{
			font-size: 100%;
			overflow-y: scroll;
		}
		body{
			position: relative;
			padding: 1em 2%;
		}
		/**
		 * prev:
		body{
			font-size: 100%;
			padding: 1em 2%;
			overflow-y: scroll;
		}
		 */
		ul, p{
			margin-top: 0.4em;
			margin-bottom: 0.6em;
		}
		h1, h2, h3{
			width: 100%;
			overflow: visible;
			margin: 0;
		}
		h1{
			font-size: 200%;
			font-weight: bold;
			padding: 0 0 1.3em 0;
		}
		h2{
			font-size: 134%;
			font-weight: bold;
			padding: 0.3em 0 1em 0;
		}
		h3{
			font-size: 115%;
			font-weight: bold;
			padding: 0.3em 0 1em 0;
		}
		.ui-content{
			width: 100%;
			height: 100%;
			overflow: auto;
		}
	<%/FORMAT%></style><%
	= content.insertInHead || content.head || '';
%><%/OUTPUT%><%
%><%OUTPUT: body %><%
	%><body><%
		%><%IF: content.title %><%
			%><h1><%
				= content.title 
			%></h1><%
		%><%/IF%><%
		= content.body || 'No content!'
		%>&nbsp;<br /><%
	%></body><%
%><%/OUTPUT%><%
%><%RETURN:
	Layouts.extend( content, {
		template	: 'html-page',
		insertInHead: head,
		body		: body
	})
%>