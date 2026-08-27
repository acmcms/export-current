<%
	//
	// 401 template.
	//
	
	// 

%><%OUTPUT: body %><%
	%>&nbsp;<p>&nbsp;<%
	%>&nbsp;<p>&nbsp;<%

	%><FORM ACTION="login.user?tp=luser&back=<%= Format.xmlAttributeFragment( content.back || '/' )%>" METHOD=POST><%
		%><table border="0" width="0%" border="0"><%
			%><%IF: content.error %><%
				%><tr><%
					%><td colspan='2' bgcolor='#f66' color='#9f6' align='center'><%
						%><b><%= intl( en = 'Error', ru = 'Ошибка' ) %>: <%= content.error %></b><%
					%></td><%
				%></tr><%
			%><%/IF%><%
			%><tr><%
				%><td><%
					%><b><%= intl( en = 'Login', ru = 'Логин' ) %>:&nbsp;</b><%
				%></td><%
				%><td><%
					%><INPUT TYPE="TEXT" NAME="login"><%
				%></td><%
			%></tr><%
			%><tr><%
				%><td><%
					%><b><%= intl( en = 'Password', ru = 'Пароль' ) %>:&nbsp;</b><%
				%></td><%
				%><td><%
					%><INPUT TYPE="PASSWORD" NAME="password"><%
				%></td><%
			%></tr><%
			%><tr><%
				%><td colspan='2' align='right'><%
					%><INPUT TYPE='SUBMIT' VALUE='&nbsp; OK &nbsp;'><%
				%></td><%
			%></tr><%
			%><!-- remove it if you have no online registration --><%
			%><tr><%
				%><td colspan='2' align='justify'><%
					%><b>Not yet registered?</b><br /><%
					%>You may proceed to our online registration<br /><%
					%>form: <a href='register.user'>Click here for registration</a><%
				%></td><%
			%></tr><%
			%><!-- end of registration link --><%
			%><!-- remove it if you have no 'forgot password' service --><%
			%><tr><%
				%><td colspan='2' align='justify'><%
					%><b>Forgotten you password?</b><br /><%
					%>You may proceed to our "forgot password"<br /><%
					%>retrieval form: <a href='forget-password.user'>Click here if you forgot your password</a><%
				%></td><%
			%></tr><%
			%><!-- end of forgotten password link --><%
		%></table><%
	%></FORM><%

	%><div class=text style="padding: 20px; background-color: #f55; color: #ff5"><%
		%><big><b>Authentication required:</b></big><br /><%
		%><b>The page</b> (or sub-resource used by that page) <b>you requested </b>('<span style="color: #fff"><b><%= content.body %></b></span>')<b> is not accessible without authentication.</b><br /><%
		%>&nbsp;<%
	%></div><%
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
		title		: intl(en = "Authentication required", ru = "Требуется авторизация"),
		template	: 'html-document', 
		body		: body,
		pathPrefix	: content.pathPrefix
	})
 %><%

%>