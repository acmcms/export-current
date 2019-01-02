<%
	// Slightly augments the response and passes it to 'html-page' template of 
	// 'skin-standard-html' skin.
	
			Layout:
					bodyAttributes		: the optional map of attributes to append to body element
					

%><%OUTPUT: head %><%
	%><style><%
		%>body,html,h1,.ui-content,iframe,.ui-td,table{position:relative;padding:0;margin:0;border:0}<%
		%>body,html,table{width:100%;height:100%;overflow:hidden;}<%
		%>h1{font-size:200%;line-height:2em;height:2em;width:100%;overflow:hidden;}<%
		%>.ui-content{width:100%;height:100%;overflow:auto;}<%
	%></style><%
	= content.insertInHead || content.head || '';
%><%/OUTPUT%><%
%><%OUTPUT: body %><%
	%><body<%= Format.xmlAttributes(content.bodyAttributes) %>><%
		%><table height="100%" width="100%" border="0"><%
			%><%IF: content.header || content.title && !content.suppressTitle %><%
				%><tr><%
					%><td class="ui-td" height="2em" width="100%"><%
						%><%IF: content.title && !content.suppressTitle %><%
							%><h1><%
								= content.title; 
							%></h1><%
						%><%/IF%><%
						= content.header || '';
					%></td><%
				%></tr><%
			%><%/IF%><%
			%><tr><%
				%><td class="ui-td" height="100%" width="100%"><%
					%><div class="ui-content"><%
						= content.body || 'No content!'
					%></div><%
				%></td><%
			%></tr><%
			%><%IF: content.footer %><%
				%><tr><%
					%><td class="ui-td" height="0" width="100%"><%
						= content.footer || ''
					%></td><%
				%></tr><%
			%><%/IF%><%
		%></table><%
	%></body><%
%><%/OUTPUT%><%
%><%RETURN:
	Layouts.extend( content, {
		template	: 'html-page',
		insertInHead: head,
		body		: body
	})
%>