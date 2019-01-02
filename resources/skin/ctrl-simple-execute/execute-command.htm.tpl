<%
	// Command Execution

%><%CHOOSE: Request.type %><%
	%><%MATCH: 'form' %><%
		%><%EXEC: form = Session[Request.id] %><%
		%><%IF: !form %><%
			%><%OUTPUT: body %><%
				%>No form available, please retry.<%
			%><%/OUTPUT%><%
			%><%RETURN: { 
				title : 'Error', 
				template : '500', 
				body : body 
			} %><%
		%><%/IF%><%
		%><%IF: Request.close !== undefined %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/IF%><%
		%><%EXEC: data = form.data %><%

	%><%MATCH%><%
		%><%OUTPUT: body %><%
			%>Unknown form type: <%= Request.type %>.<%
		%><%/OUTPUT%><%
		%><%RETURN: { 
			title : 'Error', 
			template : '500', 
			body : body 
		} %><%
%><%/CHOOSE%><%

%><%CODE: 'ACM.ECMA' %>
	content = {
		layout			: "simple-page",
		template		: "simple-page",
		contentVariant	: intl(en = "Form", ru = "Форма"),
		contentTitle	: data.getTitle(),
		contentIcon		: ControlAPI.getIcon(data),
		contentInfo		: intl(
			en = "Screen: Command Execution, Application: Form, id: ",
			ru = "Экран: Выполнение команды, Приложение: Форма, ид: ")
			+ Request.id
	};
<%/CODE%><%

%><%OUTPUT: content.body %><%
%><%CHOOSE: Request.command %><%
	%><%MATCH: 'mapselectaddvalue' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = map = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: map[ Request.keyname ] = null %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing a map', 
				template : '500', 
				body : error 
			} %><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore( map, data.getData() ) %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/ELSE%><%
		%><%/IF%><%


	%><%MATCH: 'mapselectadd' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = map = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: lookup = field.attributes.lookup %><%

		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=mapselectaddvalue&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td class=tn><%
						%>Choose what to add:<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%><%CALL: Runtime.listLookup(lookup, 'key', 'title') %><%
							%><%IF: !IsInHash(map,key) %><%
								%><input type=radio name=keyname value="<%= Format.xmlAttributeFragment( key ) %>"><%
								%><%= title %>&nbsp;<br><%
							%><%/IF%><%
						%><%/CALL%><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Add"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%

	%><%MATCH: 'listset' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = list = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: list[ Integer(Request.keyname) ] = Request.value %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = list %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing a list', 
				template : '500', 
				body : error 
			} %><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore( list, data.getData() ) %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/ELSE%><%
		%><%/IF%><%

	%><%MATCH: 'listaddvalue' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: list = Array(target[ fieldName ]) %><%
		%><%TRY%><%
			%><%EXEC: list.add( Request.value ) %><%
		%><%CATCH%><%
			%><%EXEC: newList = [] %><%
			%><%EXEC: newList.addAll(list) %><%
			%><%EXEC: list = newList %><%
			%><%EXEC: list.add( Request.value ) %><%
		%><%/TRY%><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = list %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing a list', 
				template : '500', 
				body : error 
			} %><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore( list, data.getData() ) %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/ELSE%><%
		%><%/IF%><%

	%><%MATCH: 'listadd' %><%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=listaddvalue&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>List: add string value<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Enter value:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=value><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Add"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%
		%><p>&nbsp;<%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=listaddvalue&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>List: add binary value / upload a file<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Select a file:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=36 type=file name=value><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Upload"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%


	%><%MATCH: 'listitemedit' %><%
		%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: keyName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: list = target[ fieldName ] = field.dataRetrieve( data[ fieldName ], data ) %><%

		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=listset&data=<%= fieldName %>&keyname=<%= keyName %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>List: set string value<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Enter value:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=value value="<%= Format.xmlAttributeFragment( list[ Integer(keyName) ] ) %>"><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Set"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%
		%><p>&nbsp;<%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=listset&data=<%= fieldName %>&keyname=<%= keyName %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>List: set binary value / upload a file<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Select a file:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=36 type=file name=value><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Upload"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%



	%><%MATCH: 'mapset' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: map = target[ fieldName ] = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: map[ Request.keyname ] = Request.value %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing a map', 
				template : '500', 
				body : error 
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore( map, data.getData() ) %><%
		%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%

	%><%MATCH: 'mapadd' %><%
		%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: map = target[ fieldName ] = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: fieldfieldset = field.attributes.fieldset %><%
		%><%IF: fieldfieldset %><%
			%><%IF: map == null %><%
				%><%EXEC: map = target[ fieldName ] = {} %><%
			%><%/IF%><%
			%><%EXEC: scriptParams = { map : map, keyName : keyName, form : data } %><%
			%><%EXEC: editform = ControlAPI.createSimpleForm("Add", {}, fieldfieldset, data) %><%
			%><%EXEC: form.data = editform %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/IF%><%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=mapset&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>Map: add string value<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Enter a key:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=keyname><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Enter value:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=value><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Add"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%
		%><p>&nbsp;<%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=mapset&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>Map: add binary value / upload a file<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Enter a key:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=keyname><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Select a file:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=36 type=file name=value><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Upload"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%

	%><%MATCH: 'mapentryedit' %><%
		%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: keyName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: map = target[ fieldName ] = field.dataRetrieve( data[ fieldName ], data ) %><%

		%><%EXEC: fieldfieldset = field.attributes.fieldset %><%
		%><%IF: fieldfieldset %><%
			%><%IF: map == null %><%
				%><%EXEC: map = target[ fieldName ] = {} %><%
			%><%/IF%><%
			%><%EXEC: value = map[ keyName ] %><%
			%><%IF: value == null %><%
				%><%EXEC: value = map[ keyName ] = {} %><%
			%><%/IF%><%
			%><%EXEC: editform = ControlAPI.createSimpleForm("Edit", value, fieldfieldset, data) %><%
			%><%EXEC: form.data = editform %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/IF%><%

		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=mapset&data=<%= fieldName %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>Map: set string value<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>A key:&nbsp;<%
					%></td><%
					%><td><%
						%><input type=hidden name=keyname value="<%= keyName %>"><%
						%><%= keyName %><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Enter value:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=value value="<%= Format.xmlAttributeFragment( map[ keyName ] ) %>"><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Set"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%
		%><p>&nbsp;<%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=mapset&data=<%= fieldName %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>Map: set binary value / upload a file<%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>A key:&nbsp;<%
					%></td><%
					%><td><%
						%><input type=hidden name=keyname value="<%= keyName %>"><%
						%><%= keyName %><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%>Select a file:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=36 type=file name=value><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="Upload"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Cancel"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%


	%><%MATCH: 'mapentryremove' %><%
		%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: keyName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: map = target[ fieldName ] = field.dataRetrieve( data[ fieldName ], data ) %><%
		%><%EXEC: map.remove( keyName ) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing a map', 
				template : '500', 
				body : error 
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore( map, data.getData() ) %><%
		%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%



	%><%MATCH: 'containeritemcmd' %><%
		%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%IF: fieldName.startsWith("tomap_") %><%
			%><%EXEC: mapName = fieldName.substring(6) %><%
			%><%EXEC: mapField = data.fieldset.getField(mapName) %><%
			%><%EXEC: fieldset = mapField.attributes.fieldset %><%
			%><%EXEC: fieldNameAndCommand = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
			%><%EXEC: fieldName = fieldNameAndCommand.substring(0, fieldNameAndCommand.indexOf('___') ) %><%
			%><%EXEC: field = fieldset.getField(fieldName) %><%
			%><%EXEC: container = field.attributes.content_handler.call( data, data[fieldName] ) %><%
			%><%EXEC: keyAndCommand = fieldNameAndCommand.substring( fieldNameAndCommand.indexOf('___') + 3 ) %><%
			%><%EXEC: keyName = keyAndCommand.substring(0, keyAndCommand.indexOf('___') ) %><%
			%><%EXEC: commandName = keyAndCommand.substring( keyAndCommand.indexOf('___') + 3 ) %><%
		%><%ELSE%><%
			%><%EXEC: fieldset = data.fieldset %><%
			%><%EXEC: field = fieldset.getField(fieldName) %><%
			%><%EXEC: container = field.attributes.content_handler.call( data, data[fieldName] ) %><%
			%><%EXEC: keyAndCommand = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
			%><%EXEC: keyName = keyAndCommand.substring(0, keyAndCommand.indexOf('___') ) %><%
			%><%EXEC: commandName = keyAndCommand.substring( keyAndCommand.indexOf('___') + 3 ) %><%
		%><%/ELSE%><%
		%><%/IF%><%
		%><%EXEC: command = container.getContentCommands( keyName ).getByKey(commandName) %><%
		%><%EXEC: result = container.getCommandResult(command, null) %><%
		%><%IF: ControlAPI.isForm(result) %><%
			%><%EXEC: guid = Create.guid() %><%
			%><%EXEC: form = {
				guid : guid,
				data : result,
				back : Flags.back
			} %><%
			%><%EXEC: Session[guid] = form %><%
			%><%REDIRECT: 'form.htm?type=form&id='+guid %><%
		%><%/IF%><%
		%><%IF: ControlAPI.isUrl( result ) %><%
			%><%OUTPUT: body %><%
				%><a href="<%= encodeURI( result ) %>"><%= StringToHtml( result ) %></a><%
			%><%/OUTPUT%><%
			%><%RETURN: { 
				title : 'Location', 
				template : 'simple-html-message', 
				body : body 
			} %><%
		%><%/IF%><%
		%><%IF: result %><%
			%><%RETURN: { 
				title : 'Message', 
				template : 'simple-html-message', 
				body : StringToHtml( result ) 
			} %><%
		%><%/IF%><%
		%><%REDIRECT: Flags.back %><%


	%><%MATCH: 'containercmd' %><%
		%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%IF: fieldName.startsWith("tomap_") %><%
			%><%EXEC: mapName = fieldName.substring(6) %><%
			%><%EXEC: mapField = data.fieldset.getField(mapName) %><%
			%><%EXEC: fieldset = mapField.attributes.fieldset %><%
			%><%EXEC: fieldNameAndCommand = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
			%><%EXEC: fieldName = fieldNameAndCommand.substring(0, fieldNameAndCommand.indexOf('___') ) %><%
			%><%EXEC: field = fieldset.getField(fieldName) %><%
			%><%EXEC: container = field.attributes.content_handler.call( data, data[fieldName] ) %><%
			%><%EXEC: commandName = fieldNameAndCommand.substring( fieldNameAndCommand.indexOf('___') + 3 ) %><%
		%><%ELSE%><%
			%><%EXEC: fieldset = data.fieldset %><%
			%><%EXEC: field = fieldset.getField(fieldName) %><%
			%><%EXEC: container = field.attributes.content_handler.call( data, data[fieldName] ) %><%
			%><%EXEC: commandName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
		%><%/ELSE%><%
		%><%/IF%><%
		%><%EXEC: command = container.getCommands().getByKey( commandName ) %><%
		%><%EXEC: result = container.getCommandResult( command, null ) %><%
		%><%IF: ControlAPI.isForm( result ) %><%
			%><%EXEC: guid = Create.guid() %><%
			%><%EXEC: form = {
				guid : guid,
				data : result,
				back : Flags.back
			} %><%
			%><%EXEC: Session[guid] = form %><%
			%><%REDIRECT: 'form.htm?type=form&id='+guid %><%
		%><%/IF%><%
		%><%IF: ControlAPI.isUrl( result ) %><%
			%><%OUTPUT: body %><%
				%><a href="<%= encodeURI( result ) %>"><%= StringToHtml( result ) %></a><%
			%><%/OUTPUT%><%
			%><%RETURN: { 
				title : 'Location', 
				template : 'simple-html-message', 
				body : body 
			} %><%
		%><%/IF%><%
		%><%IF: result %><%
			%><%RETURN: { 
				title : 'Message', 
				template : 'simple-html-message', 
				body : StringToHtml( result ) 
			} %><%
		%><%/IF%><%
		%><%REDIRECT: Flags.back %><%

	%><%MATCH: 'imageclear' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = null %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing binary field', 
				template : '500', 
				body : error 
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore( null, data.getData() ) %><%
		%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%

	%><%MATCH: 'imagesetupload' %><%
		%><%IF: !Request.file %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%OUTPUT: body %><%
				%><%= intl( en = "No file was uploaded", ru = "Файл небыл загружен" ) %>!<%
			%><%/OUTPUT%><%
			%><%RETURN: { 
				title : 'Error', 
				template : '500', 
				body : body 
			} %><%
		%><%/IF%><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = Request.file %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing binary field', 
				template : '500', 
				body : error 
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore( source[fieldName], data.getData() ) %><%
		%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%

	%><%MATCH: 'imagesetget' %><%
		%><%IF: !Request.location %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%OUTPUT: body %><%
				%><%= intl( en = "No URL", ru = "URL не указан" ) %>!<%
			%><%/OUTPUT%><%
			%><%RETURN: { 
				title : 'Error', 
				template : '500', 
				body : body 
			} %><%
		%><%/IF%><%
		%><%EXEC: url = Request.location %><%
		%><%IF: url.indexOf("://") == -1 %><%
			%><%EXEC: url = "http://" + url %><%
		%><%/IF%><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = require('http').get( url ) %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%EXEC: Flags.back = 'form.htm?type=form&id='+Request.id %><%
			%><%RETURN: { 
				title : 'Error editing binary field', 
				template : '500', 
				body : error 
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore( source[fieldName], data.getData() ) %><%
		%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%

	%><%MATCH: 'imageset' %><%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=imagesetupload&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%><%= intl( en = "Upload a file", ru = "Загрузка файла" ) %><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%><%= intl( en = "Select a file", ru = "Выберите файл" ) %>:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=40 type=file name=file><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="<%= intl( en = "Upload", ru = "Загрузить" ) %>"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="<%= intl( en = "Cancel", ru = "Отменить" ) %>"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%
		%><p>&nbsp;<%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=imagesetget&data=<%= Request.data %>" method=post enctype="multipart/form-data"><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%><%= intl( en = "Get from an URL", ru = "Забрать с указанного адреса" ) %><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td><%
						%><%= intl( en = "Type an URL", ru = "Введите адрес" ) %>:&nbsp;<%
					%></td><%
					%><td><%
						%><input size=50 type=text name=location><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-save.32.gif)" type=submit value="<%= intl( en = "Get", ru = "Скачать" ) %>"><%
						%> &nbsp; <%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="<%= intl( en = "Cancel", ru = "Отменить" ) %>"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%

	%><%MATCH: 'link' %><%
		%><%EXEC: path = Request.path || Runtime.getLinkagePrivatePath( data[ Request.data ] || '' ) %><%
		%><%EXEC: path.endsWith('/') || (path += '/') %><%
		%><%ITERATE: key : Request.getParameters() %><%
			%><%IF: key.startsWith("tokey_") %><%
				%><%EXEC: path = path + key.substring(6) %><%
				%><%EXEC: path.endsWith('/') || (path += '/') %><%
			%><%/IF%><%
			%><%IF: key.startsWith("select_") %><%
				%><%EXEC: data[ Request.data ] = Runtime.getLinkagePublicUrl( path + key.substring(7) ) %><%
				%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
			%><%/IF%><%
		%><%/ITERATE%><%
		%><%IF: Request.upper %><%
			%><%EXEC: path = path.substring(0, path.lastIndexOf('/', path.length() - 2 ) ) %><%
			%><%EXEC: path.endsWith('/') || (path += '/') %><%
		%><%/IF%><%
		%><%EXEC: root = Runtime.getLinkageRootNode() %><%
		%><%EXEC: node = ControlAPI.childForPath(root, path) || root %><%
		%><table class=fm align=center><%
			%><form action="execute-command.htm?type=form&id=<%= Request.id %>&command=link&data=<%= Request.data %>" method=post><%
				%><input type=hidden name=path value="<%= path %>"><%
				%><tr><%
					%><td colspan=2 class=ti><%
						%>Path: <%= path %><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%><%EXEC: styles = ['le', 'l1'] %><%
						%><%EXEC: styleCounter = 0 %><%
						%><table width=100% border=0 cellpadding=6 cellspacing=0><%
							%><%IF: node != root %><%
								%><tr class=<%= styles[styleCounter % 2] %>><%
									%><td width=96 align=left valign=top class=tt><%
										%><img src=/!/skin/ctrl-simple/icons/command-escape.32.gif width=32 height=32><br><%
									%></td><%
									%><td valign=top class=tn align=left><%
										%><%= intl( en = 'Up...', ru = 'Вверх...' ) %><br><%
										%><span class=ti><b>.&nbsp;.</b></span><%
									%></td><%
									%><td valign=top class=tm align=right><%
										%><input type=submit name="upper" value="<%= intl(en = "Return", ru = "Вернуться") %>..."><%
									%></td><%
								%></tr><%
							%><%/IF%><%

							%><%IF: ControlAPI.isAccessiblePermission(path, "$view_contents") %><%
							%><%ELSE%><%
								%><%EXEC: children = ControlAPI.filterAccessibleHierarchy(path, node.getChildren()) %><%
								%><%ITERATE: Current : children %><%
									%><%EXEC: styleCounter ++ %><%
									%><tr class=<%= styles[styleCounter % 2] %>><%
										%><td width=96 align=center valign=top class=tt><%
											%><img src=/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif width=32 height=32><%
											%><br><%
											%><%= intl(en = "folder", ru = "папка") %><%
										%></td><%
										%><td valign=top class=tn align=left><%= Current.getTitle() %><%
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
											%><input type=submit name="tokey_<%= Current.getKey() %>" value="<%= intl(en = "Open", ru = "Открыть") %>..."><%
											%><br><%
											%><input type=submit name="select_<%= Current.getKey() %>" value="<%= intl(en = "Select", ru = "Выбрать") %>"><%
										%></td><%
									%></tr><%
								%><%/ITERATE%><%
							%><%/ELSE%><%
								%><%EXEC: children = ControlAPI.filterAccessibleHierarchy(path, node.getChildrenExternal()) %><%
								%><%ITERATE: Current : children %><%
									%><%EXEC: styleCounter ++ %><%
									%><tr class=<%= styles[styleCounter % 2] %>><%
										%><td width=96 align=center valign=top class=tt><%
											%><a href="<%= browsePath %>"><%
												%><img src=/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif width=32 height=32 border=0><%
											%></a><%
											%><br><%
											%><%= intl(en = "folder", ru = "папка") %><%
										%></td><%
										%><td valign=top class=tn align=left><%
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
											%><input type=submit name="tokey_<%= Current.getKey() %>" value="<%= intl(en = "Open", ru = "Открыть") %>..."><%
											%><br><%
											%><input type=submit name="select_<%= Current.getKey() %>" value="<%= intl(en = "Select", ru = "Выбрать") %>"><%
										%></td><%
									%></tr><%
								%><%/ITERATE%><%
	
								%><%EXEC: contents = node.getContents() %><%
								%><%IF: Array.isFilled(contents) %><%
									%><%EXEC: fieldset = node.getContentFieldset() %><%
									%><%EXEC: fieldNames = [] %><%
									%><%EXEC: fieldKeys = [] %><%
									%><%EXEC: fieldLookups = [] %><%
									%><%ITERATE: Current : fieldset %><%
										%><%EXEC: ArrayAppend(fieldNames, Current.getTitle() ) %><%
										%><%EXEC: ArrayAppend(fieldKeys, Current.getKey() ) %><%
										%><%EXEC: ArrayAppend(fieldLookups, Current.attributes.lookup ) %><%
									%><%/ITERATE%><%
				
									%><%ITERATE: content : contents %><%
										%><%EXEC: styleCounter ++ %><%
										%><tr class=<%= styles[styleCounter % 2] %>><%
											%><%EXEC: type = (ControlAPI.isNode(content) ? "folder" : (ControlAPI.isEntry(content) ? "file" : "item")) %><%
											%><%EXEC: key = content.getKey() %><%
											%><%EXEC: contentInfo = "" %><%
											%><%EXEC: fieldKeyIndex = 0 %><%
											%><%ITERATE: fieldKey : fieldKeys %><%
												%><%OUTAPPEND: contentInfo %><%
													%>, <%= fieldNames[fieldKeyIndex] %>: <%
													%><i><%
													%><%= Format.xmlNodeValue( fieldLookups[fieldKeyIndex] 
														? fieldLookups[fieldKeyIndex][ content[fieldKey] ]  
														: content[fieldKey] ) %><%
													%></i><%
												%><%/OUTAPPEND%><%
												%><%EXEC: fieldKeyIndex ++ %><%
											%><%/ITERATE%><%
											%><%OUTPUT: contentMenu %><%
												%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, node.getContentCommands( key ) ) %><%
													%>[ <a class=ac href="execute.htm?type=content&path=<%= path %>&key=<%= encodeURIComponent( key ) %>&cmd_<%= command.getKey() %>=1&back=<%= encodeURIComponent(Request.getUrl()) %>"><%= command.getTitle() %>...</a> ]<br><%
												%><%/ITERATE%><%
											%><%/OUTPUT%><%
											%><%CHOOSE: type %><%
												%><%MATCH: "folder" %><%
													%><td width=96 valign=top class=tt><%
														%><img src=/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(content) %>.32.gif width=32 height=32><%
														%><br><%
														%><%= intl(en = "folder", ru = "папка") %><%
													%></td><%
													%><td valign=top class=tn align=left><%
														%><%= content.getTitle() %><%
														%><br><%
														%><%TRY%><%
															%><%EXEC: elementCount = ArrayLength(content.getChildrenExternal()) + ArrayLength(content.getContents()) %><%
														%><%CATCH%><%
															%><%EXEC: elementCount = intl( en = "ERROR!", ru = "ОШИБКА!") %><%
														%><%/TRY%><%
														%><span class=ti><%
															%><b><%= key %></b>, <%= intl(en = "entries", ru = "элементов") %>: <%= elementCount %><%= contentInfo %><%
														%></span><%
													%></td><%
													%><td valign=top class=tm align=right><%
														%><input type=submit name="tokey_<%= key %>" value="<%= intl(en = "Open", ru = "Открыть") %>..."><%
														%><br><%
														%><input type=submit name="select_<%= key %>" value="<%= intl(en = "Select", ru = "Выбрать") %>"><%
													%></td><%
												%><%MATCH: "file" %><%
													%><td width=96 valign=top class=tt><%
														%><img src=/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(content) %>.32.gif width=32 height=32><%
														%><br><%
														%><%= intl(en = "object", ru = "объект") %><%
													%></td><%
													%><td valign=top class=tn align=left><%
														%><%= content.getTitle() %><%
														%><br><%
														%><span class=ti><%
															%><b><%= key %></b><%
															%><%= contentInfo %><%
														%></span><%
													%></td><%
													%><td valign=top class=tm align=right><%
														%><input type=submit name="tokey_<%= key %>" value="<%= intl(en = "Open", ru = "Открыть") %>..."><%
														%><br><%
														%><input type=submit name="select_<%= key %>" value="<%= intl(en = "Select", ru = "Выбрать") %>"><%
													%></td><%
												%><%MATCH%><%
													%><td width=96 valign=top class=tt><%
														%><img src=/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(content) %>.32.gif width=32 height=32><%
														%><br><%
														%><%= intl(en = "item", ru = "элемент") %><%
													%></td><%
													%><td valign=top class=tn align=left><%
														%><%= content.getTitle() %><%
														%><br><%
														%><span class=ti><%
															%><b><%= key %></b><%= contentInfo %><%
														%></span><%
													%></td><%
													%><td valign=top class=tm align=right><%
														%><input type=submit name="select_<%= key %>" value="<%= intl(en = "Select", ru = "Выбрать") %>"><%
													%></td><%
											%><%/CHOOSE%><%
										%></tr><%
								%><%/ITERATE%><%
							%><%/IF%><%
						%><%/IF%><%
					%></table><%

				%></td><%
			%></tr><%
			%><tr><%
				%><td colspan=2 align=right><%
					%>&nbsp;<br><%
					%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Close"><%
				%></td><%
			%></tr><%
		%></form><%
	%></table><%

	%><%MATCH%><%
		%><p>&nbsp;<%
		%><table class=fm align=center><%
			%><form action="form.htm?type=form&id=<%= Request.id %>" method=post><%
				%><tr><%
					%><td colspan=2 class=tn><%
						%>Unknown form command: <%= Request.command %><%
					%></td><%
				%></tr><%
				%><tr><%
					%><td colspan=2 align=right><%
						%>&nbsp;<br><%
						%><input class=sm style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)" type=submit name=close value="Close"><%
					%></td><%
				%></tr><%
			%></form><%
		%></table><%
	
%><%/CHOOSE%><%

%><%/OUTPUT%><%
%><%RETURN: content %><%
%>