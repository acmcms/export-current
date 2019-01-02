<%FORMAT: 'xml' %><%

%><%CHOOSE: Request.type %><%
	%><%MATCH: 'form' %><%
		%><%EXEC: form = Session[Request.id] %><%
		%><%IF: !form %><%
			%><%RETURN: {
				template	: '500',
				title		: 'Error',
				body		: 'No form available, please retry.'
			} %><%
		%><%/IF%><%
		%><%IF: Request.close %><%
			%><%REDIRECT: 'form.htm?type=form&id='+Request.id %><%
		%><%/IF%><%
		%><%EXEC: data = form.data %><%

	%><%MATCH%><%
		%><%RETURN: {
			template	: '500',
			title		: 'Error',
			body		: 'Unknown form type: ' + Request.type + '.'
		} %><%
%><%/CHOOSE%><%

%><%CHOOSE: Request.command %><%
	%><%MATCH: 'listset' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.getFieldset() %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = field.dataRetrieve( data.getData()[ fieldName ], data.getData() ) %><%
		%><%EXEC: list = target[ fieldName ] %><%
		%><%EXEC: list[ Integer(Request.keyname) ] = Request.value %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = list %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%FINAL: 'text/html' %><%
				%><script>
					var obj = {};
					obj.type = 'error';
					obj.error = <%= Format.jsString(error) %>;
					parent.onDone(obj);
				</script><%
			%><%/FINAL%><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore( list, data.getData() ) %><%
			%><%FINAL: 'text/html' %><%
				%><script>
					parent.onDone({});
				</script><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%

	%><%MATCH: 'listaddvalue' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.getFieldset() %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = field.dataRetrieve( data.getData()[ fieldName ], data.getData() ) %><%
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
			%><%FINAL: 'text/html' %><%
				%><script>
					var obj = {};
					obj.type='error';
					obj.error = <%= Format.jsString(error) %>;
					parent.onDone(obj);
				</script><%
			%><%/FINAL%><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore( list, data.getData() ) %><%
			%><%FINAL: 'text/html' %><%
				%><script>
					var obj = {};
					parent.onDone(obj);
				</script><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%


	%><%MATCH: 'listitemremove' %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: fieldset = data.getFieldset() %><%
		%><%EXEC: field = fieldset.getField(fieldName) %><%
		%><%EXEC: keyName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = field.dataRetrieve( data.getData()[ fieldName ], data.getData() ) %><%
		%><%EXEC: list = target[ fieldName ] %><%
		%><%EXEC: ArrayRemove(list,Integer(keyName) ) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = list %><%
		%><%EXEC: error = field.dataValidate(source) %><%

		%><%IF: error %><%
			%><%RETURN: {
				template	: '500commandResult',
				title		: 'Error',
				body		: error
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore(list, data.getData() ) %><%
		%><%FINAL: 'text/html' %><%
			%><body onload="try{parent.document.all[window.name].onDone()}catch(Error){parent.onDone()}"><%
				%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
					%><entry type="done"></entry><%
				%></XML><%
			%></body><%
		%><%/FINAL%><%






	%><%MATCH: 'mapset' %><%

		%><%EXEC: mapPaths = split(Request.data,'/') %><%
		%><%EXEC: fieldset = data.getFieldset() %><%
		%><%EXEC: value = data.getData() %><%

		%><%CALL: ForArray(mapPaths) %><%
			%><%EXEC: field = fieldset.getField(Current) %><%
			%><%EXEC: fieldset = field.getAttributes().fieldset %><%
			%><%EXEC: formData = value %><%
			%><%EXEC: value = value[Current] %><%
			%><%EXEC: fieldName = Current %><%
		%><%/CALL%><%


		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = value = field.dataRetrieve( formData[ fieldName ], formData ) %><%
		%><%EXEC: map = target[ fieldName ] %><%
		%><%EXEC: map[ Request.keyname ] = Request.value %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%FINAL: 'text/html' %><%
				%><script>
					var obj = {};
					obj.type='error';
					obj.error = <%= Format.jsString(error) %>;
					parent.onDone(obj);
				</script><%
			%><%/FINAL%><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore(map, data.getData() ) %><%
			%><%FINAL: 'text/html' %><%
				%><script>
					var obj = {};
					parent.onDone(obj);
				</script><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%

	%><%MATCH: 'mapentryremove' %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: keyName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%

		%><%EXEC: mapPaths = split(fieldName,'/') %><%
		%><%EXEC: fieldset = data.getFieldset() %><%
		%><%EXEC: value = data.getData() %><%

		%><%CALL: ForArray(mapPaths) %><%
			%><%EXEC: field = fieldset.getField(Current) %><%
			%><%EXEC: fieldset = field.getAttributes().fieldset %><%
			%><%EXEC: formData = value %><%
			%><%EXEC: value = value[Current] %><%
			%><%EXEC: fieldName = Current %><%
		%><%/CALL%><%

		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = value = field.dataRetrieve( formData[ fieldName ], formData ) %><%
		%><%EXEC: map = target[ fieldName ] %><%
		%><%EXEC: map.remove( keyName ) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%

		%><%IF: error %><%
			%><%RETURN: {
				template	: '500commandResult',
				title		: 'Error',
				body		: error
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore(map, data.getData() ) %><%
		%><%FINAL: 'text/html' %><%
			%><body onload="try{parent.document.all[window.name].onDone()}catch(Error){parent.onDone()}"><%
				%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
					%><entry type="done"></entry><%
				%></XML><%
			%></body><%
		%><%/FINAL%><%





	%><%MATCH: 'containercmd', 'containeritemcmd' %><%
		%><%FORMAT: 'xml' %><%FINAL: 'text/html' %><%
			%><body onload="try{parent.document.all[window.name].onDone()}catch(Error){parent.onDone()}"><%
				%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
			
					%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
					%><%EXEC: fieldset = data.getFieldset() %><%
					%><%EXEC: field = fieldset.getField(fieldName) %><%
			
					%><%EXEC: source = data.getData() %><%
					%><%EXEC: ControlSum = {} %><%
					%><%ITERATE: Current : fieldset %><%
						%><%EXEC: ControlSum[Current.getKey()] = ControlAPI.controlSum(source[Current.getKey()]) %><%
					%><%/ITERATE%><%
			
					%><%CHOOSE: Request.command %><%
						%><%MATCH: 'containercmd' %><%
			
							%><%IF: fieldName.startsWith("tomap_") %>
								<%EXEC: mapName = fieldName.substring(6) %>
								<%EXEC: mapField = data.getFieldset().getField(mapName) %>
								<%EXEC: fieldset = mapField.getAttributes().fieldset %>
								<%EXEC: fieldNameAndCommand = Request.data.substring( Request.data.indexOf('___') + 3 ) %>
								<%EXEC: fieldName = fieldNameAndCommand.substring(0, fieldNameAndCommand.indexOf('___') ) %>
								<%EXEC: field = fieldset.getField(fieldName) %>
								<%EXEC: container = field.getAttributes().content_handler.call( field, data[fieldName] ) %>
								<%EXEC: commandName = fieldNameAndCommand.substring( fieldNameAndCommand.indexOf('___') + 3 )%>
							<%ELSE%>
								<%EXEC: fieldset = data.getFieldset() %>
								<%EXEC: field = fieldset.getField(fieldName) %>
								<%EXEC: container = field.getAttributes().content_handler.call( field, data[fieldName] ) %>
								<%EXEC: commandName = Request.data.substring( Request.data.indexOf('___') + 3 ) %>
							<%/ELSE%>
							<%/IF%>
			
							<%EXEC: command = container.getCommands().getByKey( commandName ) %>
							<%EXEC: result = container.getCommandResult( command, null ) %>
			
						<%MATCH: 'containeritemcmd' %>
							<%IF: fieldName.startsWith("tomap_") %>
								<%EXEC: mapName = fieldName.substring(6) %>
								<%EXEC: mapField = data.getFieldset().getField(mapName) %>
								<%EXEC: fieldset = mapField.getAttributes().fieldset %>
								<%EXEC: fieldNameAndCommand = Request.data.substring( Request.data.indexOf('___') + 3 ) %>
								<%EXEC: fieldName = fieldNameAndCommand.substring(0, fieldNameAndCommand.indexOf('___') ) %>
								<%EXEC: field = fieldset.getField(fieldName) %>
								<%EXEC: container = field.getAttributes().content_handler.call( field, data[fieldName] ) %>
								<%EXEC: keyAndCommand = fieldNameAndCommand.substring( fieldNameAndCommand.indexOf('___') + 3 ) %>
								<%EXEC: keyName = keyAndCommand.substring(0, keyAndCommand.indexOf('___') ) %>
								<%EXEC: commandName = keyAndCommand.substring( keyAndCommand.indexOf('___') + 3 ) %>
							<%ELSE%>
								<%EXEC: fieldset = data.getFieldset() %>
								<%EXEC: field = fieldset.getField(fieldName) %>
								<%EXEC: container = field.getAttributes().content_handler.call( field, data[fieldName] ) %>
								<%EXEC: keyAndCommand = Request.data.substring( Request.data.indexOf('___') + 3 ) %>
								<%EXEC: keyName = keyAndCommand.substring(0, keyAndCommand.indexOf('___') ) %>
								<%EXEC: commandName = keyAndCommand.substring( keyAndCommand.indexOf('___') + 3 ) %>
							<%/ELSE%>
							<%/IF%>
			
							<%EXEC: command = container.getContentCommands( keyName ).getByKey( commandName ) %>
							<%EXEC: result = container.getCommandResult( command, null ) %>
					<%/CHOOSE%>
			
					<%EXEC: source = data.getData() %>
					<%EXEC: ControlSumResult = {} %>
					<%CALL: ForArray(fieldset) %>
						<%EXEC: ControlSumResult[Current.getKey()] = ControlAPI.controlSum(source[Current.getKey()]) %>
					<%/CALL%>
			
					<%IF: ControlAPI.isForm(result) %>
						<%EXEC: guid = Create.guid() %><%
						%><%EXEC: form = {
							guid : guid,
							data : result,
							back : Flags.back
						} %><%
						%><%EXEC: Session[guid] = form %>
			
						<%FINAL: 'text/html' %><%
							%><body onload="try{parent.document.all[window.name].onDone()}catch(Error){}"><%
								%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
									%><entry type="form" id="<%= guid %>" /><%
								%></XML><%
							%></body><%
						%><%/FINAL%><%
					%><%/IF%>
			
					<%IF: result %><%
						%><%IF: ControlAPI.isUrl( result ) %><%
							%><entry type="url"><%= StringToUrl(result) %></entry><%
						%><%ELSE%><%
							%><entry type="string"><![CDATA[<%= String(result) %>]]></entry><%
						%><%/ELSE%><%
						%><%/IF%><%
					%><%ELSE%><%
						%><entry type="done"><%
						%><%CALL: ForHash(ControlSum) %><%
							%><%IF: Current != ControlSumResult[CurrentKey] %><%
								%><entry type="field" id="<%= CurrentKey %>" /><%
								%><%LOG: 'APPLY', CurrentKey %><%
							%><%/IF%><%
						%><%/CALL%><%
						%></entry><%
					%><%/ELSE%><%
					%><%/IF%><%
			
				%></XML><%
			%></body><%
		%><%/FINAL%><%/FORMAT%><%

	
	%><%MATCH: 'imagesetupload', 'imagesetget' %>

		<%EXEC: mapPaths = split(Request.data,'/') %>
		<%EXEC: fieldset = data.getFieldset() %>
		<%EXEC: value = data.getData() %>

		<%CALL: ForArray(mapPaths) %>
			<%EXEC: field = fieldset.getField(Current) %>
			<%EXEC: fieldset = field.getAttributes().fieldset %>
			<%EXEC: formData = value %>
			<%EXEC: value = value[Current] %>
			<%EXEC: fieldName = Current %>
		<%/CALL%>

		<%IGNORE%>
		<%EXEC: fieldName = Request.data %>
		<%EXEC: fieldset = data.getFieldset() %>
		<%EXEC: field = fieldset.getField(fieldName) %>
		<%/IGNORE%>

		<%IF: Request.command == 'imagesetget' %>
			<%EXEC: url = Request.location %>
			<%IF: url.indexOf("://") == -1 %>
				<%EXEC: url = "http://"+url %>
			<%/IF%>

			<%EXEC: source = {} %>
			<%EXEC: source[fieldName] = require('http').get( url ) %>
			<%EXEC: error = field.dataValidate(source) %>
			<%IF: error %>
				<%FINAL: 'text/html' %>
					<script>
						var obj = {};
						obj.type='error';
						obj.error = "<%= StringToHtml(error) %>";
						parent.onDone(obj);
					</script>
				<%/FINAL%>
			<%/IF%>
			<%EXEC: formData[fieldName] = field.dataStore( source[fieldName], formData ) %>
		<%ELSE%>
			<%IF: !Request.file %>
				<%FINAL: 'text/html' %>
					<script>
						var obj = {};
						obj.type='error';
						obj.error = 'No file was uploaded';
						parent.onDone(obj);
					</script>
				<%/FINAL%>
			<%/IF%>

			<%EXEC: source = {} %>
			<%EXEC: source[fieldName] = Request.file %>
			<%EXEC: error = field.dataValidate(source) %>
			<%IF: error %>
				<%FINAL: 'text/html' %>
					<script>
						var obj = {};
						obj.type='error';
						obj.error = "<%= StringToHtml(error) %>";
						parent.onDone(obj);
					</script>
				<%/FINAL%>
			<%/IF%>
			<%EXEC: formData[fieldName] = field.dataStore( source[fieldName], formData ) %>
		<%/ELSE%>
		<%/IF%>


		<%FINAL: 'text/html' %><%
			%><script>
				var obj = {};
				<%EXEC: contentType = guessContentTypeFromBinary( formData[fieldName], formData[fieldName+'_contenttype'] || '' ) %>
				<%EXEC: size = binarySize(formData[fieldName]) %>
	
				obj.contenttype = '<%= contentType %>';
				obj.size = '<%= size %>';
	
				<%EXEC: isImage = contentType.startsWith("image/") %>
				<%EXEC: isImage && (dimensions = Imaging.getImageDimensions( formData[fieldName] )) %>
				<%IF: dimensions %>
					<%EXEC: width = dimensions.width %>
					<%EXEC: height = dimensions.height %>
					obj.width = '<%= width %>';
					obj.height = '<%= height %>';
				<%ELSE%>
					<%EXEC: isImage = false %>
				<%/ELSE%>
				<%/IF%>
				obj.isImage = <%= isImage %>;
				parent.onDone(obj);
			</script><%
		%><%/FINAL%><%
	
%><%/CHOOSE%><%

%><%/FORMAT%>