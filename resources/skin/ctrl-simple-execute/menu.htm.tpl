<%

%><%CHOOSE: Request.type %><%
	%><%MATCH: "context-menu" %><%
		%><%EXEC: path = (Request.path || '/') %><%
		%><%EXEC: path.endsWith('/') || (path += '/') %><%
		%><%EXEC: root = node = ControlAPI.nodeForObject(Request.getSharedObject()) %><%
		%><%EXEC: path && (node = ControlAPI.childForPath(node, path)) %><%
		%><%IF: !node && path != '/' %><%
			%><%EXEC: path = path.substring(0, path.lastIndexOf('/', path.length()-2 )) %><%
			%><%RETURN: { title : 'Error', template : '500', body : "Not found!" } %><%
		%><%/IF%><%
		%><%IF: Request.key %><%
			%><%EXEC: elementKey = Request.key %><%
			%><%EXEC: elementPath = path + elementKey %><%
			%><%EXEC: elementNode = node.getChildByName(elementKey) || node.getContentEntry(elementKey) || {} %><%
		%><%/IF%><%

		%><%EXEC: backPath = Request.back || '/' %><%
		
		%><%OUTPUT: head %><%
			%><script><%
				%>var submenu = [<%
					%><%EXEC: forms = elementNode.getForms && ControlAPI.filterAccessibleCommands(elementPath, elementNode.getForms()) %><%
					%><%IF: Array.isFilled(forms) %><%
						%>{<%
							%>icon : "/!/skin/ctrl-simple/icons/command-openwindow.32.gif",<%
							%>title : "<%= intl(en = "Forms", ru = "Формы") %>",<%
							%>submenu : [<%
								%><%ITERATE: command : forms %><%
									%><%CONTINUE: UNLESS: command.getKey() %><%
									%><%= Format.jsObject( { 
										icon : "/!/skin/ctrl-simple/icons/" + ControlAPI.getIcon(command) + ".32.gif",
										title: command.getTitle(),
										href : "/!/skin/ctrl-simple-form/execute.htm?type=node_form" +
												"&path=" + encodeURIComponent( elementPath ) + 
												"&form=" + command.getKey() + 
												"&back=" + encodeURIComponent( backPath )
									} ) %>,<%
								%><%/ITERATE%><%
								%>undefined<%
							%>]<% 
						%>},<%
					%><%/IF%><%
					%><%EXEC: elementNode.getCommands && (options = ControlAPI.filterAccessibleCommands(elementPath, elementNode.getCommands())) %><%
					%><%IF: Array.isFilled(options) %><%
						%>{<%
							%>icon : "/!/skin/ctrl-simple/icons/command-edit.32.gif",<%
							%>title : "<%= intl(en = "Commands", ru = "Команды") %>",<%
							%>submenu : [<%
								%><%ITERATE: command : options %><%
									%><%CONTINUE: UNLESS: command.getKey() %><%
									%><%= Format.jsObject( { 
										icon : "/!/skin/ctrl-simple/icons/" + ControlAPI.getIcon(command) + ".32.gif",
										title: command.getTitle(),
										href : "/!/skin/ctrl-simple-form/execute.htm?type=node" +
												"&path=" + encodeURIComponent( elementPath ) + 
												"&cmd_" + command.getKey() + "=1"+
												"&back=" + encodeURIComponent( backPath )
									} ) %>,<%
								%><%/ITERATE%><%
								%>undefined<%
							%>]<% 
						%>},<%
					%><%/IF%><%
					%><%EXEC: common = ControlAPI.getCommonActor( elementPath ) %><%
					%><%EXEC: common && (common = ControlAPI.filterAccessibleCommands(elementPath, common.getCommands())) %><%
					%><%IF: Array.isFilled(common) %><%
						%>{<%
							%>icon : "/!/skin/ctrl-simple/icons/command-setup.32.gif",<%
							%>title : "<%= intl(en = "System", ru = "Системное") %>",<%
							%>submenu : [<%
								%><%ITERATE: command : common %><%
									%><%CONTINUE: UNLESS: command.getKey() %><%
									%><%= Format.jsObject( { 
										icon : "/!/skin/ctrl-simple/icons/" + ControlAPI.getIcon(command) + ".32.gif",
										title: command.getTitle(),
										href : "/!/skin/ctrl-simple-form/execute.htm?type=tree_common" +
												"&path=" + encodeURIComponent( elementPath ) + 
												"&cmd_" + command.getKey() + "=1" +
												"&back=" + encodeURIComponent( backPath )
									} ) %>,<%
								%><%/ITERATE%><%
								%>undefined<%
							%>]<% 
						%>},<%
					%><%/IF%><%
					%><%IF: elementKey %><%
						%><%ITERATE: command : node && ControlAPI.filterAccessibleCommands(
								path, 
								node.getContentCommands( elementKey )
						) %><%
							%><%= Format.jsObject( { 
								icon : "/!/skin/ctrl-simple/icons/" + ControlAPI.getIcon(command) + ".32.gif",
								title: command.getTitle(),
								href : "/!/skin/ctrl-simple-form/execute.htm?type=content"+
										"&path=" + encodeURIComponent( path ) + 
										"&key=" + encodeURIComponent( elementKey ) + 
										"&cmd_" + encodeURIComponent( command.getKey() ) + "=1" +
										"&back=" + encodeURIComponent( backPath )
							} ) %>,<%
						%><%/ITERATE%><%
					%><%/IF%><%
					%>undefined<%
				%>];<%
			%></script><%
		%><%/OUTPUT%><%
		%><%OUTPUT: body %><%
			%><body><%
			%></body><%
		%><%/OUTPUT%><%
		%><%RETURN: {
				title		: "Context Menu",
				template	: "html-page",
				head		: head,
				useRequire	: false,
				useDebug	: false,
				body		: body
			} %><%
		%><%
%><%/CHOOSE%><%

%>