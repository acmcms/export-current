<%
	//
	// Error template.
	//
	
	// Request.back || content.back - show 'return' button
	// content.body - error text
	// Flags.exception - exception, if any
	// content.pathPrefix is forwarded

%><%OUTPUT: head %><%
	%><style><%FORMAT: 'css' %>
		code.errorsource{
			position:absolute;
			margin-left:auto;
			margin-right:auto;
			top:9%;
			left:8%;
			width:84%;
			height:66%;
			overflow:auto;
			font-family:courier,monospace;
			font-size:80%;
		}
	<%/FORMAT%></style><%
%><%/OUTPUT%><%

%><%OUTPUT: body %><%
	%><code class="errorsource"><%
		%><%= Format.xmlNodeValue( content.body || Format.throwableAsPlainText(Flags.exception) ) %><%
	%></code><%
	%><%EXEC: request = (context?.query ?? Request.currentRequest).parameters %><%
	%><%IF: request.back || content.back %><%
		%><br /><%
		%><center><%
			%><form action="<%= request.back || content.back %>"><%
				%><input type=submit value="<%= intl( en = "return...", ru = "вернуться..." ) %>"><%
			%></form><%
		%></center><%
	%><%/IF%><%
%><%/OUTPUT%><%

%><%RETURN: 
	Layouts.extend(content, { 
		title		: content.title || intl(en = "Exception", ru = "Ошибка сервера"),
		template	: 'html-screen',
		head		: head, 
		body		: body
	})
%><%

%>