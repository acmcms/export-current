<%CODE: 'ACM.ECMA' %>
	var body;
	$output( body ){
		%><p>&nbsp;<%
		%><table align=center border=0><%
		%><tr><%
			%><td valign=top class=tn style="<%= String(content.body).length > 300 ? 'font-family: monospaced, courier new; font-size: 8pt' : '' %>"><%
				= content.body;
			%></td><%
		%></tr><%
		%></table><%
		if( Flags.back ){
			%><table align=center><%
			%><form action="<%= Flags.back %>" method=post><%
			%><tr><%
				%><td colspan=2 align=right><%
					%><input type=submit value="<%= intl(en = "Close", ru = "Закрыть") %>"><%
				%></td><%
			%></tr><%
			%></form><%
			%></table><%
		}
	}
	return Layouts.extend( content, {
		contentIcon		: content.contentIcon || 'info',
		contentVariant	: content.contentVariant || 'Message',
		contentTitle	: content.contentTitle || intl( en = 'Message', ru = 'Сообщение' ),
		template		: 'simple-page',
		body			: body
	});
<%/CODE%>