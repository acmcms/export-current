<%
	//
	// 403 template.
	//
	
	// 

%><%OUTPUT: body %><%
	%>&nbsp;<p>&nbsp;<%
	%><div class=text style="padding: 20px; background-color: #f55; color: #ff5"><%
		%><big><b>Permission denied:</b></big><br /><%
		%><b>The page</b> (or sub-resource used by that page) <b>you requested </b>('<span style="color: #fff"><b><%= content.body %></b></span>')<b> is not accessible with credentials provided.</b><br /><%
		%><b>You can try search or browse the site to find the data you are looking for.</b><br /><%
		%>&nbsp;<%
	%></div><%
	%>&nbsp;<p>&nbsp;<%
	%>&nbsp;<p>&nbsp;<%
	%>&nbsp;<p>&nbsp;<%
	%>&nbsp;<p>&nbsp;<%
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
		title		: intl(en = "Forbidden", ru = "Нет доступа"),
		template	: 'html-document', 
		body		: body,
		pathPrefix	: content.pathPrefix
	})
 %><%

%>