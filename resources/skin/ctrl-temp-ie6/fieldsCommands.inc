<%EXEC: fCommand = CurrentKey.substring(9,CurrentKey.indexOf('_',10)) %>
<%EXEC: fName = CurrentKey.substring(CurrentKey.indexOf('_',10)+1) %>

<%CHOOSE: fCommand %>
	<%MATCH: 'fieldRemove' %>
		<%IF: Current %>
			<%LOG:'fCommand',fCommand %>
			<%LOG:'fName',fName %>
			<%EXEC: parameters[ fName ] = null%>
		<%/IF%>
	<%MATCH: 'mapselect' %>
		<%EXEC: field = fieldset.getField(fName) %>
		<%EXEC: target = {} %>
		<%EXEC: map = target[fieldName] = field.dataRetrieve( form[ fName ], form ) %>
		<%EXEC: map || (map = {}) %>
		<%EXEC: map.keySet().retainAll(Current) %>

		<%EXEC: mapFieldset = field.attributes.fieldset %>

		<%CALL:ForArray(Current) %>
			<%IF: mapFieldset %>
				<%EXEC: params = {} %>
				<%EXEC: mapFieldset.dataRetrieve( map[Current], params ) %>
				<%IF: maps[fName][Current] %>
					<%EXEC: params.putAll( maps[fName][Current] ) %>
				<%/IF%>
				<%EXEC: result = {} %>
				<%EXEC: mapFieldset.dataStore( params, result ) %>
				<%EXEC: map[Current] = result %>
			<%ELSE%>
				<%IF: maps[fName][Current] %>
					<%EXEC: map[Current] = maps[fName][Current] %>
				<%/IF%>
			<%/ELSE%>
			<%/IF%>
		<%/CALL%>
		<%EXEC: parameters[fName] = map%>
<%/CHOOSE%>