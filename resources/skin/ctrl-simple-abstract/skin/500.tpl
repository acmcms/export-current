<%

%><%OUTPUT: body %><%
	%><%IF: Flags.exception %><%
		%><br><center><textarea wrap=off rows=20 cols=70><%= Format.xmlNodeValue( Format.throwableAsPlainText(Flags.exception) ) %></textarea></center><%
	%><%ELSE%><%
		%><center><%= content.body %></center><%
	%><%/ELSE%><%
	%><%/IF%><%
	%><br><center><form action="<%= Request.back || '/!/skin/ctrl-simple-browse/' || 'Browse/' %>"><input type=submit value="<%= intl( en = "browse tree...", ru = "перейти к дереву..." ) %>"></form></center><%
%><%/OUTPUT%><%

%><%RETURN: { 
	title			: content.contentTitle || intl(en = "Error", ru = "Ошибка"),
	template		: 'simple-html-message', 
	body			: body, 
	contentIcon		: content.contentIcon || 'error',
	contentVariant	: content.contentVariant || intl(en = "Error message", ru = "Сообщение об ошибке")
} %><%

%>