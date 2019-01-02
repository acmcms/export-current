<%CHOOSE: Request.type %><%
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
		%><%EXEC: fieldset = data.fieldset %><%
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
				%><script><%
					%>parent.onDone({type : 'error', error : <%= Format.jsString(error) %>});<%
				%></script><%
			%><%/FINAL%><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore(list, data.getData() ) %><%
			%><%FINAL: 'text/html' %><%
				%><script><%
					%>parent.onDone({});<%
				%></script><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%

	%><%MATCH: 'listaddvalue' %><%
		%><%EXEC: fieldName = Request.data %><%
		%><%EXEC: fieldset = data.fieldset %><%
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
				%><script><%
					%>parent.onDone({ type : 'error', error : <%= Format.jsString(error) %> });<%
				%></script><%
			%><%/FINAL%><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore(list, data.getData() ) %><%
			%><%FINAL: 'text/html' %><%
				%><script><%
					%>parent.onDone({});<%
				%></script><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%


	%><%MATCH: 'listitemremove' %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: fieldset = data.fieldset %><%
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
				template	: '500-xml',
				title		: 'Error',
				body		: error
			} %><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore(list, data.getData() ) %><%
			%><%FINAL: 'text/xml' %><%
				%><body><%
					%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
						%><entry type="done"/><%
					%></XML><%
				%></body><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%


	%><%MATCH: 'mapset' %><%
		%><%EXEC: mapPaths = split(Request.data,'/') %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: value = data.getData() %><%

		%><%ITERATE: path : mapPaths %><%
			%><%EXEC: field = fieldset.getField(path) %><%
			%><%EXEC: fieldset = field.attributes.fieldset %><%
			%><%EXEC: formData = value %><%
			%><%EXEC: value = value[path] %><%
			%><%EXEC: fieldName = path %><%
		%><%/ITERATE%><%


		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = value = field.dataRetrieve( formData[ fieldName ], formData ) %><%
		%><%EXEC: map = target[ fieldName ] %><%
		%><%EXEC: map[ Request.keyname ] = Request.value %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%
		%><%IF: error %><%
			%><%FINAL: 'text/html' %><%
				%><script><%
					%>parent.onDone({ type : 'error', error : <%= Format.jsString(error) %>});<%
				%></script><%
			%><%/FINAL%><%
		%><%ELSE%><%
			%><%EXEC: data.getData()[fieldName] = field.dataStore(map, data.getData() ) %><%
			%><%FINAL: 'text/html' %><%
				%><script><%
					%>parent.onDone({});<%
				%></script><%
			%><%/FINAL%><%
		%><%/ELSE%><%
		%><%/IF%><%

	%><%MATCH: 'mapentryremove' %><%
		%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
		%><%EXEC: keyName = Request.data.substring( Request.data.indexOf('___') + 3 ) %><%

		%><%EXEC: mapPaths = split(fieldName,'/') %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: value = data.getData() %><%

		%><%ITERATE: path : mapPaths %><%
			%><%EXEC: field = fieldset.getField(path) %><%
			%><%EXEC: fieldset = field.attributes.fieldset %><%
			%><%EXEC: formData = value %><%
			%><%EXEC: value = value[path] %><%
			%><%EXEC: fieldName = path %><%
		%><%/ITERATE%><%

		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fieldName ] = value = field.dataRetrieve( formData[ fieldName ], formData ) %><%
		%><%EXEC: map = target[ fieldName ] %><%
		%><%EXEC: map.remove( keyName ) %><%
		%><%EXEC: source = {} %><%
		%><%EXEC: source[fieldName] = map %><%
		%><%EXEC: error = field.dataValidate(source) %><%

		%><%IF: error %><%
			%><%RETURN: {
				template	: '500-xml',
				title		: 'Error',
				body		: error
			} %><%
		%><%/IF%><%
		%><%EXEC: data.getData()[fieldName] = field.dataStore( map, data.getData() ) %><%
		%><%FINAL: 'text/xml' %><%
			%><body><%
				%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
					%><entry type="done"/><%
				%></XML><%
			%></body><%
		%><%/FINAL%><%



	%><%MATCH: 'containercmd', 'containeritemcmd' %><%
		%><%FINAL: 'text/xml' %><%
			%><body><%
				%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
					%><%EXEC: fieldName = Request.data.substring(0, Request.data.indexOf('___') ) %><%
					%><%EXEC: fieldset = data.fieldset %><%
					%><%EXEC: field = fieldset.getField(fieldName) %><%

					%><%EXEC: source = data.getData() %><%
					%><%EXEC: ControlSum = {} %><%
					%><%ITERATE: field : fieldset %><%
						%><%EXEC: ControlSum[field.getKey()] = ControlAPI.controlSum(source[field.getKey()]) %><%
					%><%/ITERATE%><%

					%><%CHOOSE: Request.command %><%
						%><%MATCH:'containercmd' %><%
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
			
							%><%EXEC: command = container.getCommands().getByKey(commandName) %><%
							%><%EXEC: result = container.getCommandResult(command, null) %><%
			
						%><%MATCH: 'containeritemcmd' %><%
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
			
							%><%EXEC: command = container.getContentCommands( keyName ).getByKey( commandName ) %><%
							%><%EXEC: result = container.getCommandResult( command, null ) %><%
					%><%/CHOOSE%><%

					%><%EXEC: source = data.getData() %><%
					%><%EXEC: ControlSumResult = {} %><%
					%><%ITERATE: field  : fieldset %><%
						%><%EXEC: ControlSumResult[field.getKey()] = ControlAPI.controlSum(source[field.getKey()]) %><%
					%><%/ITERATE%><%
			
					%><%IF: ControlAPI.isForm(result) %><%
						%><%EXEC: guid = Create.guid() %><%
						%><%EXEC: form = {
							guid : guid,
							data : result,
							back : Flags.back
						} %><%
						%><%EXEC: Session[guid] = form %><%
			
						%><%FINAL: 'text/xml' %><%
							%><body onload="try{parent.document.getElementById(window.name).onDone()}catch(Error){}"><%
								%><XML ID="oMetaData" base="" entryname="entry" type="commandResult" format="XML"><%
									%><entry type="form" id="<%=guid %>" /><%
								%></XML><%
							%></body><%
						%><%/FINAL%><%
					%><%/IF%><%
			
					%><%IF: result %><%
						%><%IF: ControlAPI.isUrl( result ) %><%
							%><entry type="url"><%= StringToUrl(result) %></entry><%
						%><%ELSE%><%
							%><entry type="string"><![CDATA[<%=String(result) %>]]></entry><%
						%><%/ELSE%><%
						%><%/IF%><%
					%><%ELSE%><%
						%><entry type="done"><%
						%><%ITERATE: key : ControlSum %><%
							%><%IF: ControlSum[key] != ControlSumResult[key] %><%
								%><entry type="field" id="<%= key %>" /><%
								%><%LOG: 'APPLY', key %><%
							%><%/IF%><%
						%><%/ITERATE%><%
						%></entry><%
					%><%/ELSE%><%
					%><%/IF%><%

				%></XML><%
			%></body><%
		%><%/FINAL%><%

	
	%><%MATCH: 'imagesetupload', 'imagesetget' %><%

		%><%EXEC: mapPaths = split(Request.data,'/') %><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: value = data.getData() %><%

		%><%ITERATE: path : mapPaths %><%
			%><%EXEC: field = fieldset.getField(path) %><%
			%><%EXEC: fieldset = field.attributes.fieldset %><%
			%><%EXEC: formData = value %><%
			%><%EXEC: value = value[path] %><%
			%><%EXEC: fieldName = path %><%
		%><%/ITERATE%><%

		%><%IF: Request.command == 'imagesetget' %><%
			%><%EXEC: url = Request.location %><%
			%><%EXEC: (url.indexOf("://") == -1) && (url = "http://"+url) %><%

			%><%EXEC: source = {} %><%
			%><%EXEC: source[fieldName] = require('http').get( url ) %><%
			%><%EXEC: error = field.dataValidate(source) %><%
			%><%IF: error %><%
				%><%FINAL: 'text/html' %><%
					%><script><%
						%>parent.onDone({ type : 'error', error : <%= Format.jsString(error) %>});<%
					%></script><%
				%><%/FINAL%><%
			%><%/IF%><%
			%><%EXEC: formData[fieldName] = field.dataStore( source[fieldName], formData ) %><%
		%><%ELSE%><%
			%><%IF: !Request.file %><%
				%><%FINAL: 'text/html' %><%
					%><script><%
						%>parent.onDone({ type : 'error', error : "No file was updated"});<%
					%></script><%
				%><%/FINAL%><%
			%><%/IF%><%

			%><%EXEC: source = {} %><%
			%><%EXEC: source[fieldName] = Request.file %><%
			%><%EXEC: error = field.dataValidate(source) %><%
			%><%IF: error %><%
				%><%FINAL: 'text/html' %><%
					%><script><%
						%>parent.onDone({ type : 'error', error : <%= Format.jsString(error) %>});<%
					%></script><%
				%><%/FINAL%><%
			%><%/IF%><%
			%><%EXEC: formData[fieldName] = field.dataStore( source[fieldName], formData ) %><%
		%><%/ELSE%><%
		%><%/IF%><%


		%><%FINAL: 'text/html' %><%
			%><script><%
				%>var obj = {};<%
				%><%EXEC: contentType = guessContentTypeFromBinary( formData[fieldName], formData[fieldName+'_contenttype'] || '' ) %><%
				%><%EXEC: size = binarySize(formData[fieldName]) %><%
	
				%>obj.contenttype = '<%= contentType %>';<%
				%>obj.size = '<%=size %>';<%
	
				%><%EXEC: isImage = contentType.startsWith("image/") %><%
				%><%EXEC: isImage && (dimensions = Imaging.getImageDimensions( formData[fieldName] )) %><%
				%><%IF: dimensions %><%
					%><%EXEC: width = dimensions.width %><%
					%><%EXEC: height = dimensions.height %><%
					%>obj.width = '<%=width %>';<%
					%>obj.height = '<%=height %>';<%
				%><%ELSE%><%
					%><%EXEC: isImage = false %><%
				%><%/ELSE%><%
				%><%/IF%><%
				%>obj.isImage = <%= isImage %>;<%
				%>parent.onDone(obj);<%
			%></script><%
		%><%/FINAL%><%
	
%><%/CHOOSE%>