<%EXEC:fCommand = CurrentKey.substring(9,CurrentKey.indexOf('_',10))%>
<%EXEC:fName = CurrentKey.substring(CurrentKey.indexOf('_',10)+1)%>

<%CHOOSE: fCommand %>
	<%MATCH: 'fieldRemove' %>
		<%IF: Current %>
			<%LOG: 'fCommand', fCommand %>
			<%LOG: 'fName', fName %>
			<%EXEC: parameters[ fName ] = null %>
		<%/IF%>
	<%MATCH: 'mapselect' %><%
		%><%EXEC: field = fieldset.getField(fName) %><%
		%><%EXEC: target = {} %><%
		%><%EXEC: target[ fName ] = field.dataRetrieve( form.getData()[ fName ], form.getData() ) %><%
		%><%EXEC: map = target[fieldName] %><%
		%><%EXEC: map || (map = {}) %><%
		%><%EXEC: map.keySet().retainAll(Current) %>

		<%EXEC: mapFieldset = field.getAttributes().fieldset %>

		<%CALL: ForArray(Current) %>
			<%IF: mapFieldset %>
				<%EXEC: params = {} %>
				<%EXEC: mapFieldset.dataRetrieve( map[Current], params ) %>
				<%EXEC: maps[fName][Current] && params.putAll( maps[fName][Current] ) %>
				<%EXEC: result = {} %>
				<%EXEC: mapFieldset.dataStore( params, result ) %>
				<%EXEC: map[Current] = result %>
			<%ELSE%>
				<%EXEC: maps[fName][Current] && (map[Current] = maps[fName][Current]) %>
			<%/ELSE%>
			<%/IF%>
		<%/CALL%>
		<%EXEC:parameters[fName] = map%>
<%/CHOOSE%>