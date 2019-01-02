<%
%><%EXEC: path = Request.path || '/' %><%
%><%EXEC: path.endsWith('/') || (path += '/') %><%
%><%EXEC: root = node = ControlAPI.nodeForObject(Request.getSharedObject()) %><%
%><%EXEC: path != '/' && (node = ControlAPI.childForPath(node, path)) %><%
%><%IF: !node && path != '/' %><%
	%><%REDIRECT: 'browse.htm?path=' + path.substring(0, path.lastIndexOf('/', path.length()-2 )) %><%
%><%/IF%><%

%><%EXEC: content = {
	layout			: "simple-page",
	template		: "simple-page",
	contentVariant	: intl(en = "Detail", ru = "Детали"),
	contentTitle	: node.getTitle(),
	contentIcon		: ControlAPI.getIcon(node),
	contentInfo		: intl(
		en = "Screen: Detail, Application: Folder, Path: ",
		ru = "Экран: Детали, Приложение: Папка, Путь: ")
		+ path
} %><%

%><%OUTPUT: content.contentMenu %><%
	%><form method=get action=browse.htm><%
	%><table border=0 cellpadding=0 cellspacing=0><%
	%><tr><%
	%><td><%
		%><select name=path onchange="submit(); return false;"><%
			%><option <%
				%><%IF: node == root %><%
					%>selected <%
					%><%EXEC: currentFound = true %><%
				%><%/IF%><%
				%>value="/"><%
				%>&nbsp;<%= LimitString( root.getTitle(), 30, '...' ) %><%
			%></option><%
			%><%RECURSION: currentPath = '/', currentNode = root, level = 2 %><%
				%><%ITERATE: Current : ControlAPI.filterAccessibleHierarchy(currentPath, currentNode.getChildren()) %><%
					%><%EXEC: nowNode = Current %><%
					%><%EXEC: nowPath = currentPath + nowNode.getKey() %><%
					%><%IF: path.startsWith(nowPath + '/') %><%
						%><option value="<%= nowPath %>"><%= Create.list(level, '&nbsp;&nbsp;').join('') %><%
							%><%= LimitString( nowNode.getTitle(), 30, '...' ) %><%
						%></option><%
						%><%DEEPER: currentPath = nowPath + '/', currentNode = nowNode, level = level + 1 %><%
					%><%ELSE%><%
						%><%IF: nowPath == path %><%
							%><%RECURSION: childrenFiltered = ControlAPI.filterAccessibleHierarchy( nowPath, nowNode.getChildren() ) %><%
								%><%EXEC: currentFound = true %><%
								%><option selected value="<%= nowPath %>"><%= Create.list(level, '&nbsp;&nbsp;').join('') %><%
									%><%= LimitString( nowNode.getTitle(), 30, '...' ) %><%
								%></option><%
								%><%EXEC: left = childrenFiltered && Math.min( 32, childrenFiltered.length ) %><%
								%><%ITERATE: Current : childrenFiltered %><%
									%><option value="<%= nowPath + '/' + Current.getKey() %>"><%= Create.list(level+1, '&nbsp;&nbsp;').join('') %><%
										%><%= LimitString( Current.getTitle(), 30, '...' ) %><%
									%></option><%
									%><%EXEC: left -- %><%
									%><%IF: !left %><%
										%><%EXEC: left = childrenFiltered.length - 32 %><%
										// say, we have less than 2 full pages
										// won't loop for more than number of elements we have anyway
										%><%CONTINUE: IF: left < 32 %><%
										%><%IF: left %><%
											%><option value="<%= nowPath %>"><%= Create.list(level+1, '&nbsp;&nbsp;').join('') %><%
												%><%= intl( 
														en = "... and ",
														ru = "... и еще " ); %><%
												%><%= left %><%
												%><%= intl( 
														en = " left... ",
														ru = " осталось... " ); %><%
											%></option><%
											%><%BREAK%><%
										%><%/IF%><%
									%><%/IF%><%
								%><%/ITERATE%><%
							%><%/RECURSION%><%
						%><%ELSE%><%
							%><option value="<%= nowPath %>"><%= Create.list(level, '&nbsp;&nbsp;').join('') %><%
								%><%= LimitString( nowNode.getTitle(), 30, '...' ) %><%
							%></option><%
						%><%/ELSE%><%
						%><%/IF%><%
					%><%/ELSE%><%
					%><%/IF%><%
				%><%/ITERATE%><%
				%><%IF: !currentFound %><%
					%><%EXEC: currentFound = true %><%
					%><option selected value="/"><%
						%><%= Create.list(level, '&nbsp;&nbsp;').join('') %><%= intl( en = "- Quick navigation -", ru = "- Быстрая навигация -" ) %><%
					%></option><%
				%><%/IF%><%
			%><%/RECURSION%><%
		%></select><%
		%><noscript><input type=submit value=ok></noscript><%
	%></td><%
	%></tr><%
	%></table><%
	%></form><%
	%><noscript><%
		%><%IF: root != node%><%
			%>[ <a class=ac href="?path=<%= encodeURIComponent( path.substring(0, Request.path.lastIndexOf('/')) ) %>"><%= intl(en = "Up", ru = "Вверх") %>...</a> ] <%
		%><%/IF%><%
		%>[ <a class=ac href="?"><%= intl(en = "Home", ru = "В начало") %>...</a> ]<%
		%><br><%
	%></noscript><%
%><%/OUTPUT%><%


%><%OUTPUT: content.body %><%
	%><%EXEC: backPath = Request.getUrl() %><%
	%><script><%
		%>function scm(key, path, prefix){<%
			%>document.write('<button id="'+prefix+key+'"></button>');<%
			%>Menu.attachMenu(document.getElementById(prefix+key), {<%
				%>icon : "/!/skin/ctrl-simple/icons/command-edit.32.gif",<%
				%>title : "<%= intl( en = "Options", ru = "Действия" ) %>",<%
				%>menusource : "/!/skin/ctrl-simple-execute/menu.htm?type=context-menu&path="+path+"&key="+key+"&back=<%= encodeURIComponent(backPath) %>"<%
			%>});<%
		%>}<%
	%></script><%
	%><table class=ao width=100% cellpadding=4 cellspacing=0 border=0><%
	%><tr><%
		%><td><%

		%><noscript><%
		%><div class="mn"><%
			%><%EXEC: forms = ControlAPI.filterAccessibleCommands(path, node.getForms()) %><%
			%><%IF: Array.isFilled(forms) %><%
				%><%OUTAPPEND: menuScript %><%
					%>options = [];<%
					%>menuItems.push({<%
						%>icon : "/!/skin/ctrl-simple/icons/command-openwindow.32.gif",<%
						%>title : "<%= intl(en = "Forms", ru = "Формы") %>",<%
						%>submenu : options<%
					%>});<%
				%><%/OUTAPPEND%><%
				%><div class="tlbr btn"><%
					%><div class="btn"><%
						%><%= intl(en = "Forms", ru = "Формы") %>:&nbsp;<%
					%></div><%
					%><%EXEC: optionStyles = ['le', 'l1'] %><%
					%><%EXEC: optionStyleCounter = 0 %><%
			
					%><%ITERATE: Current : forms %><%
						%><%CHOOSE: Current.getKey() %><%
							%><%MATCH: '' %><%
			
							%><%MATCH%><%
								%><%EXEC: optionStyleCounter ++ %><%
								%><%EXEC: optionHref = "/!/skin/ctrl-simple-form/?type=node_form&path=" + encodeURIComponent(Request.path || '/') + "&form=" + Current.getKey() + "&back=" + encodeURIComponent( backPath ) %><%
								%><a class=ac href="<%= optionHref %>"><%
									%><div class="btn tb <%= optionStyles[optionStyleCounter % 2] %>" title="<%= intl(en = "Open", ru = "Открыть") %>. <%= Current.commandDescription() || "" %>"><%
										%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif" width=16 height=16 border=0><%
										%><%= Current.getTitle() %><%
										%><br><%
									%></div><%
								%></a><%
								%><%OUTAPPEND: menuScript %><%
									%>options.push({ icon : "/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif", title : "<%= Current.getTitle() %>", href : "<%= optionHref %>" });<%
								%><%/OUTAPPEND%><%
						%><%/CHOOSE%><%
					%><%/ITERATE%><%
				%></div><%
			%><%/IF%><%
	
			%><%EXEC: options = ControlAPI.filterAccessibleCommands(path, node.getCommands()) %><%
			%><%IF: Array.isFilled(options) %><%
				%><%OUTAPPEND: menuScript %><%
					%>options = [];<%
					%>menuItems.push({<%
						%>icon : "/!/skin/ctrl-simple/icons/command-edit.32.gif",<%
						%>title : "<%= intl(en = "Commands", ru = "Команды") %>",<%
						%>submenu : options<%
					%>});<%
				%><%/OUTAPPEND%><%
				%><div class="tlbr btn"><%
					%><div class="btn"><%
						%><%= intl(en = "Commands", ru = "Команды") %>:&nbsp;<%
					%></div><%
					%><%EXEC: optionStyles = ['le','l1'] %><%
					%><%EXEC: optionStyleCounter = 0 %><%
			
					%><%ITERATE: Current : options %><%
						%><%CHOOSE: Current.getKey() %><%
							%><%MATCH: '' %><%
			
							%><%MATCH%><%
								%><%EXEC: optionStyleCounter ++ %><%
								%><%EXEC: optionHref = "/!/skin/ctrl-simple-form/execute.htm?type=node&path=" + encodeURIComponent( path ) + "&cmd_" + Current.getKey() + "=1&back=" + encodeURIComponent( backPath ) %><%
								%><a class=ac href="<%= optionHref %>"><%
									%><div class="btn tb <%= optionStyles[optionStyleCounter % 2] %>" title="<%= intl(en = "RUN", ru = "Выполнить") %>. <%= Current.commandDescription() || "" %>"><%
										%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif" width=16 height=16><%
										%><%= Current.getTitle() %><%
										%><br><%
									%></div><%
								%></a><%
								%><%OUTAPPEND: menuScript %><%
									%>options.push({ icon : "/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif", title : "<%= Current.getTitle() %>", href : "<%= optionHref %>" });<%
								%><%/OUTAPPEND%><%
						%><%/CHOOSE%><%
					%><%/ITERATE%><%
				%></div><%
			%><%/IF%><%
	
			%><%EXEC: common = ControlAPI.getCommonActor( path ) %><%
			%><%EXEC: common && (common = ControlAPI.filterAccessibleCommands(path, common.getCommands())) %><%
			%><%IF: Array.isFilled(common) %><%
				%><%OUTAPPEND: menuScript %><%
					%>options = [];<%
					%>menuItems.push({<%
						%>icon : "/!/skin/ctrl-simple/icons/command-setup.32.gif",<%
						%>title : "<%= intl(en = "System", ru = "Системное") %>",<%
						%>submenu : options<%
					%>});<%
				%><%/OUTAPPEND%><%
				%><div class="tlbr btn"><%
					%><div class="btn"><%
						%><%= intl(en = "System", ru = "Системное") %>:&nbsp;<%
					%></div><%
					%><%EXEC: optionStyles = ['le','l1'] %><%
					%><%EXEC: optionStyleCounter = 0 %><%
				
					%><%ITERATE: Current : common %><%
						%><%CHOOSE: Current.getKey() %><%
							%><%MATCH: '' %><%
				
							%><%MATCH%><%
								%><%EXEC: optionStyleCounter ++ %><%
								%><%EXEC: optionHref = "/!/skin/ctrl-simple-form/execute.htm?type=tree_common&path=" + encodeURIComponent( path ) + "&cmd_" + Current.getKey() + "=1&back=" + encodeURIComponent( backPath ) %><%
								%><a class=ac href="<%= optionHref %>"><%
									%><div class="btn tb <%= optionStyles[optionStyleCounter % 2] %>" title="<%= intl(en = "RUN", ru = "Выполнить") %>. <%= Current.commandDescription() || "" %>"><%
										%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif" width=16 height=16><%
										%><%= Current.getTitle() %><%
										%><br><%
									%></div><%
								%></a><%
								%><%OUTAPPEND: menuScript %><%
									%>options.push({ icon : "/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif", title : "<%= Current.getTitle() %>", href : "<%= optionHref %>" });<%
								%><%/OUTAPPEND%><%
						%><%/CHOOSE%><%
					%><%/ITERATE%><%
				%></div><%
			%><%/IF%><%
		%></div><%
		%></noscript><%
		%><%IF: menuScript %><%
			%><script><%
				%><%= menuScript %><%
			%></script><%
		%><%/IF%><%
	
	%><%IF: ControlAPI.isAccessiblePermission(path, "$view_contents") %><%
	%><%ELSE%><%
		%><%EXEC: children = ControlAPI.filterAccessibleHierarchy(path, node.getChildren()) %><%
		%><%IF: Array.isFilled(children) %><%
			%><div class=tn><%
				%><%= intl(en = "Hierarchy", ru = "Иерархия") %>:<%
			%></div><%
			%><table width=100% class=fml border=0 cellpadding=6 cellspacing=0><%
	
			%><%EXEC: styles = ['le', 'l1'] %><%
			%><%EXEC: styleCounter = 0 %><%
	
			%><%ITERATE: Current : children %><%
				%><%EXEC: styleCounter = styleCounter + 1 %><%
				%><%EXEC: browsePath = "browse.htm?path=" + encodeURIComponent( path ) + Current.getKey() %><%
				%><tr class=<%= styles[styleCounter % 2] %>><%
				%><td width=96 align=center valign=top class=tt><%
					%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif" width=32 height=32 border=0 alt=""><%
					%><br><%
					%><%= intl(en = "folder", ru = "папка") %><%
				%></td><%
				%><td valign=top class=tn align=left style="cursor: hand" onclick="Menu.itemClick(this)" href="<%= browsePath %>"><%
					%><%= Current.getTitle() %><%
					%><br><%
					%><%TRY%><%
						%><%EXEC: elementCount = ArrayLength(Current.getChildrenExternal()) + ArrayLength(Current.getContents()) %><%
					%><%CATCH%><%
						%><%EXEC: elementCount = intl( en = "ERROR!", ru = "ОШИБКА!") %><%
					%><%/TRY%><%
					%><span class=ti><%
						%><b><%= Current.getKey() %></b>, <%= intl(en = "entries", ru = "элементов") %>: <%= elementCount %><%
					%></span><%
				%></td><%
				%><td valign=top class=tm align=right><%
					%><noscript><%
						%>[ <a class=ac href="<%= browsePath %>"><%= intl(en = "OPEN", ru = "Открыть") %>...</a> ]<%
					%></noscript><%
				%></td><%
				%></tr><%
			%><%/ITERATE%><%
			%></table><%
		%><%/IF%><%
	%><%/ELSE%><%
	
		%><%EXEC: children = ControlAPI.filterAccessibleHierarchy(path, node.getChildrenExternal()) %><%
		%><%IF: Array.isFilled(children) %><%
			%><div class=tn><%
				%><%= intl(en = "Hierarchy", ru = "Иерархия") %>:<%
			%></div><%
			%><table width=100% class=fml border=0 cellpadding=6 cellspacing=0><%
		
			%><%EXEC: styles = ['le', 'l1'] %><%
			%><%EXEC: styleCounter = 0 %><%
	
			%><%ITERATE: Current : children %><%
				%><%EXEC: styleCounter ++ %><%
				%><%EXEC: browsePath = "browse.htm?path=" + encodeURIComponent( path ) + Current.getKey() %><%
				%><tr class=<%= styles[styleCounter % 2] %>><%
					%><td width=96 align=center valign=top class=tt><%
						%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif" width=32 height=32 border=0 alt=""><%
						%><br><%
						%><%= intl(en = "folder", ru = "папка") %><%
					%></td><%
					%><td valign=top class=tn align=left style="cursor: hand" onclick="Menu.itemClick(this)" href="<%= browsePath %>"><%
						%><%= Current.getTitle() %><br><%
						%><%TRY%><%
							%><%EXEC: elementCount = ArrayLength(Current.getChildrenExternal()) + ArrayLength(Current.getContents()) %><%
						%><%CATCH%><%
							%><%EXEC: elementCount = intl( en = "ERROR!", ru = "ОШИБКА!") %><%
						%><%/TRY%><%
						%><span class=ti><%
							%><b><%= Current.getKey() %></b>, <%= intl(en = "entries", ru = "элементов") %>: <%= elementCount %><%
						%></span><%
					%></td><%
					%><td valign=top class=tm align=right nowrap><%
						%><script type="text/javascript"><%
							%>scm(<%= Format.jsString( Current.getKey() ) %>, <%= Format.jsString( path ) %>, "ext_");<%
						%></script><%
						%><noscript><%
							%>[ <a class=ac href="<%= browsePath %>"><%= intl(en = "OPEN", ru = "Открыть") %>...</a> ]<%
						%></noscript><%
					%></td><%
				%></tr><%
			%><%/ITERATE%><%
			%></table><%
		%><%/IF%><%
		
		%><%EXEC: contents = node.getContents() %><%
		%><%IF: Array.isFilled(contents) %><%
			%><form action="/!/skin/ctrl-simple-form/execute.htm?type=content_multi" method=post enctype="multi/form-data"><%
			%><div class=tn><%
				%><a name=contents></a><%= intl(en = "Contents", ru = "Содержание") %>:<%
			%></div><%
			%><table width=100% class=fml border=0 cellpadding=6 cellspacing=0><%
		
			%><%EXEC: styles = ['le', 'l1'] %><%
			%><%EXEC: styleCounter = 0 %><%
		
			%><%EXEC: fieldset = node.getContentFieldset() %><%
			%><%EXEC: fieldNames = [] %><%
			%><%EXEC: fieldKeys = [] %><%
			%><%EXEC: fieldLookups = [] %><%
			%><%ITERATE: Current : fieldset %><%
				%><%EXEC: fieldNames.add( Current.title ) %><%
				%><%EXEC: fieldKeys.add( Current.key ) %><%
				%><%EXEC: fieldLookups.add( Current.attributes.lookup ) %><%
			%><%/ITERATE%><%
		
			%><%EXEC: group_commands = node.getContentMultipleCommands(null) %><%
			%><%EXEC: group_commands = Array.isFilled(group_commands) ? group_commands : null %><%
			%><%EXEC: count = ArrayLength( contents ) %><%
			%><%EXEC: pageSize = Int( Request.pageSize, 50 ) %><%
			%><%EXEC: listingUrl = Request.getUrl() %><%
			%><%EXEC: url = listingUrl %><%
			%><%IF: Request.all %><%
				%><tr><%
				%><td colspan=3><%
					%><b><%= intl( en = "Shown: ", ru = "Показано: " ) %><%= count %>, &nbsp;<a class=ac href="<%
					%><%= Request.modifyQueryStringParameter(url, 'all') %><%
					%>#contents"><%= intl( en = 'page mode', ru = 'постраничный режим') %></a>&nbsp;</b><%
				%></td><%
				%></tr><%
				%><%EXEC: pages = ArraySplit(contents, count ) %><%
			%><%ELSE%><%
				%><%EXEC: pages = ArraySplit(contents, pageSize ) %><%
			%><%/ELSE%><%
			%><%/IF%><%
			%><%EXEC: pageCount = ArrayLength(pages) %><%
			%><%EXEC: page = Int(Request.page, 0) %><%
			%><%IF: page < 0 %><%
				%><%REDIRECT: Request.modifyQueryStringParameter( Request.getUrl(), 'page' ) %><%
			%><%/IF%><%
			%><%IF: page >= pageCount %><%
				%><%REDIRECT: Request.modifyQueryStringParameter( Request.getUrl(), 'page', String(pageCount - 1) ) %><%
			%><%/IF%><%
			%><%IF: pageCount > 1 %><%
				%><tr><%
				%><td colspan=3><%
					%><b><%= intl( en = "Shown: ", ru = "Показано: " ) %><%= pageSize *  page + 1 %> .. <%= Math.min(pageSize *  (page + 1), count) %> (<%= count %>)</b><br><%
					%><%OUTPUT: listingPages %><b><%
						%><%= intl( en = "Pages: ", ru = "Страницы: " ) %><%
						%><%IF: Request.all %><%
							%><%= intl( en = 'all', ru = 'все') %>&nbsp;<%
						%><%ELSE%><%
							%><a class=ac href="<%
								%><%= Request.modifyQueryStringParameter( Request.modifyQueryStringParameter(url, 'page'), 'all', '1') %><%
							%>#contents"><%= intl( en = 'all', ru = 'все') %></a>&nbsp;<%
						%><%/ELSE%><%
						%><%/IF%><%
						%><%EXEC: since = 0 %><%
						%><%IF: page > 4 %><%
							%><%EXEC: since = page - 5 %><%
							%><%IF: since %><%
								%><a class=ac href="<%
									%><%EXEC: currentPage = page - 10 %><%
									%><%= Request.modifyQueryStringParameter(url, 'page', (currentPage <= 0) 
																								? null 
																								: String(currentPage) ) %><%
									%>#contents"><%
									%>&laquo;&laquo;&laquo;<%
								%></a><%
								%>&nbsp;<%
							%><%/IF%><%
						%><%/IF%><%
						%><%EXEC: till = pageCount %><%
						%><%IF: till - since > 11 %><%
							%><%EXEC: till = since + 11 %><%
							%><%OUTPUT: append %><%
								%><a class=ac href="<%
									%><%EXEC: currentPage = page + 10 %><%
									%><%= Request.modifyQueryStringParameter(url, 'page', (currentPage >= pageCount)
																								? String(pageCount-1)
																								: String(currentPage) ) %><%
									%>#contents"><%
									%>&raquo;&raquo;&raquo;<%
								%></a><%
							%><%/OUTPUT%><%
						%><%/IF%><%
						%><%FOR: currentPage = since; currentPage < till; currentPage ++ %><%
							%><a class=ac <%
							%><%IF: currentPage != page %><%
								%>href="<%
								%><%= Request.modifyQueryStringParameter(url, 'page', (currentPage == 0) 
																							? null
																							: String(currentPage) ) %><%
								%>#contents"<%
							%><%/IF%><%
							%>>&nbsp;<%= currentPage+1 %>&nbsp;<%
							%></a> <%
						%><%/FOR%><%
						%><%IF: append %><%
							%>&nbsp;<%= append %><%
						%><%/IF%></b><%
					%><%/OUTPUT%><%
					%><%= listingPages %><%
				%></td><%
				%></tr><%
			%><%/IF%><%
			%><%ITERATE: element : pages[page] %><% 
				%><%EXEC: styleCounter = styleCounter + 1 %><%
				%><%EXEC: key = element.getKey() %><%
				%><tr class=<%= styles[styleCounter % 2] %>><%
					%><%EXEC: type = (ControlAPI.isNode(element) ? "folder" : (ControlAPI.isEntry(element) ? "file" : "item")) %><%
					%><%EXEC: elementInfo = "" %><%
					%><%EXEC: fieldKeyIndex = 0 %><%
					%><%ITERATE: fieldKey : fieldKeys %><%
						%><%OUTAPPEND: elementInfo %><%
							%>, <%= fieldNames[fieldKeyIndex] %>: <i><%
							%><%= Format.xmlNodeValue( 
								fieldLookups[fieldKeyIndex] 
									? fieldLookups[fieldKeyIndex][ element[fieldKey] ] 
									: element[fieldKey] 
							) %><%
							%></i><%
						%><%/OUTAPPEND%><%
						%><%EXEC: ++fieldKeyIndex %><%
					%><%/ITERATE%><%
					%><%OUTPUT: elementMenu %><%
						%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, node.getContentCommands( key ) )  %><%
							%>[ <a class=ac href="/!/skin/ctrl-simple-form/execute.htm?type=content&path=<%= encodeURIComponent( path ) %>&key=<%= encodeURIComponent( key ) %>&cmd_<%= command.getKey() %>=1&back=<%= encodeURIComponent( backPath ) %>"><%= command.getTitle() %>...</a> ]<br><%
						%><%/ITERATE%><%
					%><%/OUTPUT%><%
					%><%CHOOSE: type %><%
						%><%MATCH: "folder" %><%
							%><td width=96 valign=top class=tt><%
								%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(element) %>.32.gif" width=32 height=32><%
								%><br><%
								%><%IF: group_commands %><%
									%><input type=checkbox name=content value=<%= key %>><%
								%><%/IF%><%
								%><%= intl(en = "folder", ru = "папка") %><%
							%></td><%
							%><td valign=top class=tn align=left<% 
									%><%IF: ControlAPI.isAccessible(path + key, element) %><%
										%> style="cursor: hand" onclick="Menu.itemClick(this)" href="browse.htm?path=<%= encodeURIComponent( path + key ) %>"<%
									%><%/IF%><%
									%>><%
								%><%= element.getTitle() %><br><%
								%><%TRY%><%
									%><%EXEC: elementCount = ArrayLength(element.getChildrenExternal()) + ArrayLength(element.getContents()) %><%
								%><%CATCH%><%
									%><%EXEC: elementCount = intl( en = "ERROR!", ru = "ОШИБКА!") %><%
								%><%/TRY%><%
								%><span class=ti><%
									%><b><%= key %></b>, <%= intl(en = "entries", ru = "элементов") %>: <%= elementCount %><%= elementInfo %><%
								%></span><%
							%></td><%
							%><td valign=top class=tm align=right nowrap><%
								%><script type="text/javascript"><%
									%>scm("<%= StringToUrlHard( key ) %>", "<%= StringToUrlHard( path ) %>", "fldr_");<%
								%></script><%
								%><%IF: ControlAPI.isAccessible(path + element.getKey(), element) %><%
									%><noscript><%
										%>[ <a class=ac href="browse.htm?path=<%= encodeURIComponent( path + key ) %>"><%= intl(en = "OPEN", ru = "Открыть") %>...</a> ]<br><%
										%><%= elementMenu %><%
									%></noscript><%
								%><%/IF%><%
							%></td><%
						%><%MATCH: "file" %><%
							%><td width=96 valign=top class=tt><%
								%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(element) %>.32.gif" width=32 height=32><br><%
								%><%IF: group_commands %><%
									%><input type=checkbox name=content value="<%= key %>"><%
								%><%/IF%><%
								%><%= intl(en = "object", ru = "объект") %><%
							%></td><%
							%><td valign=top class=tn align=left<% 
									%><%IF: ControlAPI.isAccessible(path + key, element) %><%
										%> style="cursor: hand" onclick="Menu.itemClick(this)" href="browse.htm?path=<%= encodeURIComponent( path + key ) %>"<%
									%><%/IF%><%
									%>><%
								%><%= element.getTitle() %><br><%
								%><span class=ti><%
									%><b><%= key %></b><%= elementInfo %><%
								%></span><%
							%></td><%
							%><td valign=top class=tm align=right nowrap><%
								%><script type="text/javascript"><%
									%>scm("<%= StringToUrlHard( key ) %>", "<%= StringToUrlHard( path ) %>", "lf_");<%
								%></script><%
								%><%IF: ControlAPI.isAccessible(path + key, element) %><%
									%><noscript><%
										%>[ <a class=ac href="browse.htm?path=<%= encodeURIComponent( path + key ) %>"><%= intl(en = "OPEN", ru = "Открыть") %>...</a> ]<br><%
										%><%= elementMenu %><%
									%></noscript><%
								%><%/IF%><%
							%></td><%
						%><%MATCH%><%
							%><td width=96 valign=top class=tt><%
								%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(element) %>.32.gif" width=32 height=32><br><%
								%><%IF: group_commands %><%
									%><input type=checkbox name=content value="<%= key %>"><%
								%><%/IF%><%
								%><%= intl(en = "item", ru = "элемент") %><%
							%></td><%
							%><td valign=top class=tn align=left><%
								%><%= element.title %><br><%
								%><span class=ti><b><%= key %></b><%= elementInfo %></span><%
							%></td><%
							%><td valign=top class=tm align=right nowrap><%
								%><script type="text/javascript"><%
									%>scm(<%= Format.jsString( key ) %>, <%= Format.jsString( path ) %>, "def_");<%
								%></script><%
								%><noscript><%
									%><%= elementMenu %><%
								%></noscript><%
							%></td><%
					%><%/CHOOSE%><%
				%></tr><%
			%><%/ITERATE%><%
			%><%IF: listingPages %><%
				%><tr><%
					%><td colspan=3><%
						%><%= listingPages %><%
					%></td><%
				%></tr><%
			%><%/IF%><%
			%></table><%
		
			%><%IF: group_commands %><%
				%><input type=hidden name=path value="<%= Format.xmlAttributeFragment( Request.path ) %>"><%
				%><input type=hidden name=back value="<%= Format.xmlAttributeFragment( Request.getUrl() ) %>"><%
				%><p align=center class=ti><%
					%><%= intl(en = "Select some entries and choose an operation", ru = "Выделите элементы и выберите операцию") %>: <%
					%><select name=command><%
						%><option value=""> - <%= intl(en = "choose", ru = "выберите") %> - </option><%
						%><%ITERATE: command : group_commands %><%
							%><option value="<%= command.getKey() %>"><%= command.getTitle() %></option><%
						%><%/ITERATE%><%
					%></select><%
					%>, <%= intl(en = "then click", ru = "потом нажмите") %>: <%
					%><input type=submit value="<%= intl(en = "&nbsp;GO&nbsp;", ru = "Выполнить") %>">.<%
				%></p><%
			%><%/IF%><%
			%></form><%
			%></td><%
			%></tr><%
			%></table><%
		%><%/IF%><%
	%><%/IF%><%
	%></td></tr></table><%
	
	%><script><%
		%><%IF: root != node%><%
				%>menuItems.push({<%
					%>icon : "/!/skin/ctrl-simple/icons/command-escape.16.gif",<%
					%>title : "<%= intl(en = "Up", ru = "Вверх") %>",<%
					%>href : "?path=<%= encodeURIComponent( path.substring(0, Request.path.lastIndexOf('/')) ) %>"<%
				%>});<%
		%><%/IF%><%
		%>menuItems.push({<%
			%>icon : "/!/skin/ctrl-simple/icons/command-up.16.gif",<%
			%>title : "<%= intl(en = "Home", ru = "В начало") %>",<%
			%>href : "?"<%
		%>});<%
	%></script><%

%><%/OUTPUT%><%
%><%RETURN: content %><%
%>