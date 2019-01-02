<%
%><%CHOOSE: Request.type %><%
	%><%MATCH: 'node_form' %><%
		%><%EXEC: Flags.back = Request.back %><%
		%><%EXEC: node = ControlAPI.nodeForObject(Request.getSharedObject()) %><%
		%><%EXEC: Request.path && (node = ControlAPI.childForPath(node, Request.path)) %><%
		%><%IF: !node %><%
			%><%OUTPUT: body %><%
				%>Node (path=<%= Request.path %>) was not <%
				%>found while trying to execute a command.<%
			%><%/OUTPUT%><%
			%><%RETURN: { title : 'Error', template : '500', body : body } %><%
		%><%/IF%><%
		%><%EXEC: forms = node.getForms() %><%
		%><%IF: !forms %><%
			%><%OUTPUT: body %><%
				%>Node (path=<%= Request.path %>) has no forms.<%
			%><%/OUTPUT%><%
			%><%RETURN: { title : 'Error', template : '500', body : body } %><%
		%><%/IF%><%
		%><%EXEC: form = forms.getByKey( Request.form ) %><%
		%><%IF: !form %><%
			%><%OUTPUT: body %><%
				%>Node (path=<%= Request.path %>) has no form '<%= Request.form %>'.<%
			%><%/OUTPUT%><%
			%><%RETURN: { title : 'Error', template : '500', body : body } %><%
		%><%/IF%><%
		%><%EXEC: actor = node.getCommandResult(form, null) %><%
		%><%IF: !actor %><%
			%><%OUTPUT: body %><%
				%>Node (path=<%= Request.path %>) declines to provide a form '<%= Request.form %>'.<%
			%><%/OUTPUT%><%
			%><%RETURN: { title : 'Error', template : '500', body : body } %><%
		%><%/IF%><%
		%><%IF: Array.isFilled(actor.getCommands()) %><%
			%><%EXEC: actor.attributes.path || (actor.attributes.path = Request.path) %><%
			%><%EXEC: guid = Create.guid() %><%
			%><%EXEC: Session[guid] = { guid : guid, data : actor, back : Flags.back } %><%
			%><%REDIRECT: 'form.htm?type=form&id='+guid+'&back='+encodeURIComponent(Flags.back) %><%
		%><%/IF%><%
		%><%EXEC: data = actor %><%
		

	%><%MATCH: 'form' %><%
		%><%EXEC: form = Session[Request.id] %><%
		%><%IF: !form %><%
			%><%OUTPUT: body %><%
				%>No form available, please retry.<%
			%><%/OUTPUT%><%
			%><%RETURN: { title : 'Error', template : '500', body : body } %><%
		%><%/IF%><%
		%><%EXEC: Flags.back = form.back %><%
		%><%EXEC: data = form.data %><%
		%><%EXEC: errors = form.errors %><%

	%><%MATCH%><%
		%><%OUTPUT: body %><%
			%>Unknown form type: <%= Request.type %>.<%
		%><%/OUTPUT%><%
		%><%RETURN: { title : 'Error', template : '500', body : body } %><%
%><%/CHOOSE%><%

%><%EXEC: path = data.attributes.path %><%

%><%EXEC: requireJs = Create.set() %><%
%><%EXEC: requireCss = Create.set() %><%
%><%EXEC: content = {
	layout			: "simple-page",
	template		: "simple-page",
	contentVariant	: intl( en = "Form", ru = "Форма" ),
	contentTitle	: data.getTitle(),
	contentIcon		: ControlAPI.getIcon(data),
	contentInfo		: null,
	requireJs		: requireJs,
	requireCss		: requireCss
} %><%

%><%EXEC: flags = {} %><%

%><%OUTPUT: content.body %><%
	%><form action="execute.htm?<%= Request.getParameterString() %>" method="post" enctype="multipart/form-data"><%
	%><table align=center class=fm border=0 cellpadding=3 cellspacing=0><%
		%><col width="25%" align="right" style="text-align:right"/><%
		%><col width="75%" align="left" /><%
		%><%EXEC: fieldset = data.fieldset %><%
		%><%EXEC: errors || (errors = {}) %><%
		%><%IF: fieldset %><%
			%><%EXEC: source = data.getData() %><%
			%><%EXEC: target = {} %><%
			%><%EXEC: fieldset.dataRetrieve(source, target) %><%
			%><%RECURSION: target = target, fieldset = fieldset, prefix = "", splitters = true, constant = false %><%
				%><%ITERATE: Current : fieldset %><%
					%><%EXEC: attributes = Current.attributes %><%
					%><%INCLUDE: 'lookup.inc' %><%
					%><%EXEC: error = errors[ Current.getKey() ] %><%
					%><%CHOOSE: attributes.type %><%
						%><%MATCH: 'block','transparent' %><%
				
						%><%MATCH: 'select' %><%
							%><tr><%
								%><td valign="top<%IF: error %> class=error<%/IF%>"><%
									%><%= Current.getTitle() %>:&nbsp;<%
								%></td><%
								%><%EXEC: value = target[ Current.getKey() ] %><%
								%><%CHOOSE: constant || attributes.constant %><%
									%><%MATCH: true, 'true' %><%
										%><td><%
											= Format.xmlNodeValue( lookup[ value ] || value );
										%></td><%
					
									%><%MATCH%><%
										%><%CHOOSE: attributes.variant %><%
											%><%MATCH: 'bigselect' %><%
												%><td><%
													%><%ITERATE: key : lookupOrder %><%
														%><%EXEC: title = lookup[key] %><%
														%><%IF: (key != null || Integer(key,1) == 0) && key != "" %><%
															%><%EXEC: cid = prefix + "__" + Current.getKey() + "__" + Math.abs((Current.getKey()+key).hashCode()) %><%
															%><input<%
																%> type=radio<%
																%> id=<%= Format.xmlAttributeValue( cid ) %><%
																%> name=<%= Format.xmlAttributeValue( prefix + '__' + Current.getKey() ) %><%
																%><%IF: key == value %> checked<%/IF%><%
																%> value=<%= Format.xmlAttributeValue(key) %>><%
															%><label for="<%= cid %>"><%
																%>&nbsp;<%
																%><%= title %><%
															%></label><%
															%><br/><%
														%><%ELSE%><%
															%><%CHOOSE: title %><%
																%><%MATCH: '+' %><blockquote style="margin-top: 0; margin-bottom: 0"><%
																%><%MATCH: '-' %></blockquote><%
																%><%MATCH%>&nbsp; &nbsp;<!-- <%= key %> --><%= title %><br/><%
															%><%/CHOOSE%><%
														%><%/ELSE%><%
														%><%/IF%><%
													%><%/ITERATE%><%
												%></td><%
						
											%><%MATCH%><%
												%><%EXEC: ident = "" %><%
												%><%EXEC: level = 0 %><%
												%><td><%
													%><select style="width:100%" name="<%= prefix %>__<%= Current.getKey() %>"><%
														%><%ITERATE: key : lookupOrder %><%
															%><%EXEC: title = lookup[key] %><%
															%><%IF: key !== null && key !== undefined && key !== "" %><%
																%><option <%
																	%><%IF: key == value%><%
																		%>selected <%
																	%><%/IF%><%
																	%>value=<%= Format.xmlAttributeValue(key) %><%
																%>><%
																	= Format.xmlNodeValue(title);
																%></option><%
															%><%ELSE%><%
																%><%CHOOSE: title %><%
																	%><%MATCH: '+' %><%
																		%><%EXEC: level ++ %><%
																		%><%EXEC: ident = level * "  " %><%
																	%><%MATCH: '-' %><%
																		%><%EXEC: level -- %><%
																		%><%EXEC: ident = level * "  " %><%
																%><%/CHOOSE%><%
															%><%/ELSE%><%
															%><%/IF%><%
														%><%/ITERATE%><%
													%></select><%
												%></td><%
										%><%/CHOOSE%><%
								%><%/CHOOSE%><%
							%></tr><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td><%
									%></td><%
									%><td><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'set' %><%
							%><%CHOOSE: attributes.variant %><%
								%><%MATCH: 'select', 'multiselect' %><%
								%><%EXEC: value = (target[ Current.getKey() ] || []) %><%
								%><input type=hidden name="<%= prefix %>set_<%=Current.getKey() %>" value=""><%
								%><tr><%
									%><td colspan=2<%IF: error %> class=error<%/IF%>><%
										%><%= Current.getTitle() %>:&nbsp;<br/><%
										%><div nowrap class=const style="height: 150px"><%
											%><%ITERATE: key : lookupOrder %><%
												%><%EXEC: title = lookup[key] %><%
												%><input type=checkbox name="<%= prefix %>toset__<%= Current.getKey() %>" <%IF: value.contains(key) %>checked <%/IF%>value=<%= Format.xmlAttributeValue(key) %>><%
												%>&nbsp;<%= title %><%
												%><br/><%
											%><%/ITERATE%><%
										%></div><%
									%></td><%
								%></tr><%
								
								%><%MATCH%><%
								%><tr><%
									%><td valign=top<%IF: error %> class=error<%/IF%>><%
										%><%= Current.getTitle() %>:&nbsp;<%
									%></td><%
									%><td><%
										%><%ITERATE: value : target[ Current.getKey() ] %><%
											%><%= value %><br/><%
										%><%/ITERATE%><%
									%></td><%
							%><%/CHOOSE%><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td colspan=2><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'boolean' %><%
							%><input type=hidden name="<%= prefix %>boolean_<%=Current.getKey() %>" value=""><%
							%><tr><%
								%><td colspan=2<%IF: error %> class=error<%/IF%>><%
									%><input id="<%= prefix %>__<%= Current.getKey() %>" name="<%= prefix %>__<%= Current.getKey() %>" <%IF: target[ Current.getKey() ] %>checked <%/IF%>value=1 type=checkbox><%
									%><label for="<%= prefix %>__<%= Current.getKey() %>"><%
										%>&nbsp;<%= Current.getTitle() %><%
									%></label><%
								%></td><%
							%></tr><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td><%
									%></td><%
									%><td><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint );
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'date' %><%
							%><%CHOOSE: constant || attributes.constant %><%
								%><%MATCH: true, 'true' %><%
									%><tr><%
										%><td valign=top<%IF: error %> class=error<%/IF%>><%
											%><%= Current.getTitle() %>:&nbsp;<%
										%></td><%
										%><td><%
											= Format.xmlNodeValue( target[ Current.getKey() ] );
										%></td><%
									%></tr><%
				
								%><%MATCH%><%
									%><tr><%
										%><td valign=top<%IF: error %> class=error<%/IF%>><%
											%><%= Current.getTitle() %>:&nbsp;<%
										%></td><%
										%><td><%
											%><input<%
												%> type=text<%
												%> name="<%= prefix %>__<%= Current.getKey() %>"<%
												%> value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>"<%
												%> size=80<%
												%> style="width:100%"<%
											%>><%
										%></td><%
									%></tr><%
							%><%/CHOOSE%><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td><%
									%></td><%
									%><td><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><%
									%><td colspan=2><hr/></td><%
								%></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'number','floating' %><%
							%><%CHOOSE: constant || attributes.constant %><%
								%><%MATCH: true, 'true' %><%
									%><tr><%
										%><td valign=top<%IF: error %> class=error<%/IF%>><%
											%><%IF: Current.getTitle() %><%
												%><%= Current.getTitle() %>:&nbsp;<%
											%><%/IF%><%
										%></td><%
										%><td><%
											= Format.xmlNodeValue( target[ Current.getKey() ] );
										%></td><%
									%></tr><%
				
								%><%MATCH%><%
									%><%CHOOSE: attributes.variant %><%
										%><%MATCH: 'integer' %><%
											%><tr><%
												%><td valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %>:&nbsp;<%
												%></td><%
												%><td><%
													%><input type=text name="<%= prefix %>__<%= Current.getKey() %>" value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>" size=12><%
												%></td><%
											%></tr><%
						
										%><%MATCH%><%
											%><tr><%
												%><td valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %>:&nbsp;<%
												%></td><%
												%><td><%
													%><input type=text name="<%= prefix %>__<%= Current.getKey() %>" value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>" size=12><%
												%></td><%
											%></tr><%
								%><%/CHOOSE%><%
							%><%/CHOOSE%><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td><%
									%></td><%
									%><td><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><%
									%><td colspan=2><hr/></td><%
								%></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'string' %><%
							%><%CHOOSE: constant || attributes.constant %><%
								%><%MATCH: true, 'true' %><%
									%><tr><%
										%><td valign=top<%IF: error %> class=error<%/IF%>><%
											%><%IF: Current.getTitle() %><%
												%><%= Current.getTitle() %>:&nbsp;<%
											%><%/IF%><%
										%></td><%
										%><%EXEC: value = target[ Current.getKey() ] %><%
										%><%EXEC: lookup && (value = (lookup[ value ] || value)) %><%
										%><td><%
											= Format.xmlNodeValue( value );
										%></td><%
									%></tr><%
				
								%><%MATCH%><%
									%><%CHOOSE: attributes.variant %><%
										%><%MATCH: 'link', 'url' %><%
											%><tr><%
												%><td valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %><%IF: attributes.min > 0 %><b>*</b><%/IF%>:&nbsp;<%
												%></td><%
												%><td><%
													%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
														%><tr><%
															%><td width=100%><%
																%><!-- cannot use 'type=url' cause we support URIs as well --><%
																%><input type=text name="<%= prefix %>__<%= Current.getKey() %>" value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>" size=80 style="width:100%"><%
															%></td><%
															%><td><%
																%><input type=submit name="formcmd_link_<%= Current.getKey() %>" value="..."><%
															%></td><%
														%></tr><%
													%></table><%
												%></td><%
											%></tr><%
					
										%><%MATCH: 'password' %><%
											%><tr><%
												%><td valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %><%IF: attributes.min > 0 %><b>*</b><%/IF%>:&nbsp;<%
												%></td><%
												%><td><%
													%><input type=password name="<%= prefix %>__<%= Current.getKey() %>" value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>" size=20><%
												%></td><%
											%></tr><%

										%><%MATCH: 'email' %><%
											%><tr><%
												%><td valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %><%IF: attributes.min > 0 %><b>*</b><%/IF%>:&nbsp;<%
												%></td><%
												%><td><%
													%><input type=email name="<%= prefix %>__<%= Current.getKey() %>" value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>" size=80><%
												%></td><%
											%></tr><%

										%><%MATCH%><%
											%><tr><%
												%><td valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %><%IF: attributes.min > 0 %><b>*</b><%/IF%>:&nbsp;<%
												%></td><%
												%><td><%
													%><input type=text name="<%= prefix %>__<%= Current.getKey() %>" value="<%= Format.xmlAttributeFragment( target[ Current.getKey() ] ) %>" size=80 style="width:100%"><%
													%><%EXEC: requireJs.add( 'Inputs/String' ) %><%
													%><%EXEC: requireCss.add( 'Inputs/String' ) %><%
												%></td><%
											%></tr><%
											
								%><%/CHOOSE%><%
							%><%/CHOOSE%><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td><%
									%></td><%
									%><td><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'text' %><%
							%><%CHOOSE: constant || attributes.constant %><%
								%><%MATCH: true, 'true' %><%
									%><tr><%
										%><td colspan=2<%IF: error %> class=error<%/IF%>><%
											%><%IF: Current.getTitle() %><%
												%><%= Current.getTitle() %>:&nbsp;<br/><%
											%><%/IF%><%
											%><div nowrap class=const><%
												= Format.xmlNodeValue( target[ Current.getKey() ] );
											%></div><%
										%></td><%
									%></tr><%
				
								%><%MATCH%><%
									%><%CHOOSE: attributes.variant %><%
										%><%MATCH: 'template' %><%
											%><tr><%
												%><td colspan=2<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %><%
													%><%IF: attributes.min > 0 %><%
														%><b>*</b><%
													%><%/IF%><%
													%>:<br/><%
													%><textarea wrap=off cols=90 style="width:100%" rows=25<%IF: !(constant || attributes.constant) %> name="<%= prefix %>__<%= Current.getKey() %>"<%/IF%>><%
														= Format.xmlNodeValue( target[ Current.getKey() ] );
													%></textarea><%
												%></td><%
											%></tr><%
					
										%><%MATCH: 'html' %><%
											%><%CODE: 'ACM.ECMA' %>
												// ecma code
												%><tr><%
													%><td colspan=2<% error && (= ' class=error'); %>><%
														= Current.getTitle();
														if( attributes.min > 0 ) {
															%><b>*</b><%
														}
														%>:<br/><%
														var rte =	!constant && 
																	!attributes.constant &&
																	VlapanRichedit && 
																	(flags.dhtml || (flags.dhtml = new VlapanRichedit( editorName111 = "fckeditor" )));
														%><textarea<%
															%> wrap="soft"<%
															%> cols="90"<%
															%> style="width:100%"<%
															%> rows="8"<%
															if( rte ) {
																%> id="<%= prefix %>__<%= Current.getKey() %>"<%
																%> name="<%= prefix %>__<%= Current.getKey() %>"<%
															}
														%>><%
															= Format.xmlNodeValue( target[ Current.getKey() ] );
														%></textarea><%
														if( rte ) {
															= rte.replace( id = prefix + "__" + Current.getKey() );
														}
													%></td><%
												%></tr><%
												// end of ecma code
											<%/CODE%><%
					
										%><%MATCH%><%
											%><%CODE: 'ACM.ECMA' %>
												// ecma code
												%><tr><%
													%><td colspan=2<% error && (= ' class=error'); %>><%
														= Current.getTitle();
														if( attributes.min > 0 ) {
															%><b>*</b><%
														}
														%>:<br/><%
														%><textarea <%
															%>wrap="soft" <%
															%>cols="90" <%
															%>style="width:100%" <%
															%>rows="8"<%
															if( !(constant || attributes.constant) ) {
																%> name="<%= prefix %>__<%= Current.getKey() %>"<%
															}
														%>><%
															= Format.xmlNodeValue( target[ Current.getKey() ] );
														%></textarea><%
													%></td><%
												%></tr><%
												// end of ecma code
											<%/CODE%><%
	
									%><%/CHOOSE%><%
	
							%><%/CHOOSE%><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td colspan=2><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint );
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'binary' %><%
							%><tr><%
								%><td valign=top<%IF: error %> class=error<%/IF%>><%
									%><%= Current.getTitle() %>:&nbsp;<%
								%></td><%
								%><td><%
									%><%EXEC: value = target[ Current.getKey() ] %><%
									%><%IF: value && binarySize( value ) > 0 %><%
										%><%EXEC: contentType = guessContentTypeFromBinary(value, target[ Current.getKey() + "_contenttype" ] || '') %><%
										%><%EXEC: contentName = target[ Current.getKey() + "_contentname" ] || '' %><%
										%><%EXEC: dimensions = contentType.startsWith("image/") 
																			? Imaging.getImageDimensions( value )
																			: null %><%
										%><%IF: dimensions %><%
											%><img src="field.htm?<%= Request.getParameterString() %>&fieldname=<%= Current.getKey() %>"<%IF: dimensions.width > 350%> width=300<%/IF%>><%
											%><%IF: !(constant || attributes.constant) %><%
												%><br/><input type=submit name=formcmd_imageclear_<%= Current.getKey() %> value="<%= intl( en = "clear", ru = "очистить" ) %>">&nbsp;<input type=submit name=formcmd_imageset_<%= Current.getKey() %> value="<%= intl( en = "replace", ru = "заменить" ) %>"><%
											%><%/IF%><%
											%><br/><a target=_blank href="field.htm?<%= Request.getParameterString() %>&fieldname=<%= Current.getKey() %>"><b><%= intl( en = "Open / Download", ru = "Открыть / Скачать" ) %>...</b></a><%
											%><br/><%= intl( en = "Dimensions", ru = "Площадь" ) %>: <i><%= dimensions.width %>px * <%= dimensions.height %>px</i><%
											%><%IF: dimensions.width > 350 %><%
												%><br/><%= intl( en = "Image is scaled", ru = "Уменьшено" ) %>: <i><a target=_blank href="field.htm?<%= Request.getParameterString() %>&preview=true&fieldname=<%= Current.getKey() %>"><%= intl( en = "Full size preview", ru = "Просмотр в полном размере" ) %>...</a></i><%
											%><%/IF%><%
											%><br/><%= intl( en = "Content-Type", ru = "Тип данных" ) %>: <i><%= contentType %></i><%
											%><%IF: contentName %><br/><%= intl( en = "Content-Name", ru = "Имя данных" ) %>: <i><%= contentName %></i><%/IF%><%
											%><br/><%= intl( en = "Size", ru = "Размер" ) %>: <i><%= formatByteSize( binarySize(value) ) %> (<%= binarySize(value) %> bytes)</i><%
										%><%ELSE%><%
											%><a target=_blank href="field.htm?<%= Request.getParameterString() %>&fieldname=<%= Current.getKey() %>"><b><%= intl( en = "Open / Download", ru = "Открыть / Скачать" ) %>...</b></a><%
											%><%IF: !(constant || attributes.constant) %><%
												%><br/><input type=submit name=formcmd_imageclear_<%= Current.getKey() %> value="<%= intl( en = "clear", ru = "очистить" ) %>">&nbsp;<input type=submit name=formcmd_imageset_<%= Current.getKey() %> value="<%= intl( en = "replace", ru = "заменить" ) %>"><%
											%><%/IF%><%
											%><br/><%= intl( en = "Content-Type", ru = "Тип данных" ) %>: <i><%= contentType %></i><%
											%><%IF: contentName %><%
												%><br/><%= intl( en = "Content-Name", ru = "Имя данных" ) %>: <i><%= contentName %></i><%
											%><%/IF%><%
											%><br/><%= intl( en = "Size", ru = "Размер" ) %>: <i><%= formatByteSize( binarySize(value) ) %> (<%= binarySize(value) %> bytes)</i><%
										%><%/ELSE%><%
										%><%/IF%><%
									%><%ELSE%><%
										%>empty<%
										%><%IF: !(constant || attributes.constant) %><%
											%><br/><input type=submit name=formcmd_imageset_<%= Current.getKey() %> value="set / upload"><%
										%><%/IF%><%
									%><%/ELSE%><%
									%><%/IF%><%
								%></td><%
							%></tr><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td><%
									%></td><%
									%><td><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
						%><%MATCH: 'list' %><%
							%><%EXEC: key = Current.getKey() %><%
							%><%EXEC: value = target[ key ] %><%
							%><%EXEC: container = (!(constant || attributes.constant) && attributes.content_handler)
																	? attributes.content_handler.call( target, value )
																	: null %><%
							%><%EXEC: styles = prefix ? ['le','lo'] : ['le','l1'] %><%
							%><%EXEC: styleCounter = 0 %><%
							
							%><tr><%
								%><td colspan=2 valign=top<%IF: error %> class=error<%/IF%>><%
									%><%= Current.getTitle() %>:&nbsp;<%

									%><%IF: ControlAPI.isListing(value) %><%
										%><div<%IF: ArrayLength( value ) > 16 %><%EXEC: styles = prefix ? ['l1','le'] : ['lo','le'] %> nowrap class=const<%/IF%>><%
											%><table width=100% border=0 cellpadding=6 cellspacing=0 class=ti style="position:relative;text-align:left"><%
											
												%><%EXEC: fieldset = attributes.content_fieldset %><%
												%><%EXEC: fieldNames = [] %><%
												%><%EXEC: fieldKeys = [] %><%
												%><%EXEC: fieldLookups = [] %><%
												%><%ITERATE: Current : fieldset %><%
													%><%EXEC: fieldNames.add( Current.getTitle() ) %><%
													%><%EXEC: fieldKeys.add( Current.getKey() ) %><%
													%><%EXEC: fieldLookups.add( Current.attributes.lookup ) %><%
												%><%/ITERATE%><%
												
												%><%IF: !fieldset || (!container && !(constant || attributes.constant)) %><%
													%><%ITERATE: Current : value %><%
														%><%EXEC: listIndex = styleCounter ++ %><%
														%><tr class=<%= styles[styleCounter % 2] %>><%
															%><%EXEC: fieldset && (itemdata = (Current.getData() || Current.attributes)) %><%
															%><td valign=top class=lt align=left><%
															%><%IF: !fieldset %><%
																%><%= Current.title || Current %><br/><%
																%><%CONTINUE%><%
															%><%/IF%><%
															%><%EXEC: contentInfo = "" %><%
															%><%EXEC: fieldKeyIndex = 0 %><%
															%><%ITERATE: fieldKey : fieldKeys %><%
																%><%EXEC: value = fieldLookups[fieldKeyIndex] 
																	? fieldLookups[fieldKeyIndex][ itemdata[fieldKey] ]
																	: itemdata[fieldKey] %><%
																%><%EXEC: line = ControlAPI.toLine( value ) %><%
																%><%OUTAPPEND: contentInfo %><%
																	%>, <%= fieldNames[fieldKeyIndex] %><%
																	%>: <i><%
																	%><%IF: line == Format.jsObject(value) %><%
																		= Format.xmlNodeValue( line );
																	%><%ELSE%><%
																		%><a href="field.htm?fromlist=<%= key %>&fromdata=<%= fieldKey %>&index=<%= listIndex %>&<%= Request.getParameterString() %>" target=_blank><%
																			= Format.xmlNodeValue( line );
																		%></a><%
																	%><%/ELSE%><%
																	%><%/IF%><%
																	%></i><%
																%><%/OUTAPPEND%><%
																%><%EXEC: fieldKeyIndex++ %><%
															%><%/ITERATE%><%
															%><span class=ti><%
																%><%IF: !fieldset %><%
																	%><b><%= Current.getKey() %></b><%
																%><%ELSE%><%
																	%><%= intl( en = "item", ru = "элемент" ) %><%
																%><%/ELSE%><%
																%><%/IF%><%
																%><%= contentInfo %><%
															%></span><%
															%></td><%
														%></tr><%
														%><%OUTPUT: contentMenu %><%
															%><%IF: container %><%
																%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, container.getContentCommands( listIndex ) ) %><%
																	%><input type=submit debug="001" name="formcmd_containeritemcmd_<%= key %>___<%= listIndex %>___<%= command.getKey() %>" value="<%= command.getTitle() %>">&nbsp;<%
																%><%/ITERATE%><%
															%><%ELSE%><%
																%><%IF: !(constant || attributes.constant) %><%
																	%><input type=submit name="formcmd_listitemedit_<%= key %>___<%= listIndex %>" value="edit">&nbsp;<input type=submit name="formcmd_listitemremove_<%= key %>___<%= listIndex %>" value="remove"><%
																%><%/IF%><%
															%><%/ELSE%><%
															%><%/IF%><%
														%><%/OUTPUT%><%
														%><tr class=<%= styles[styleCounter % 2] %>><%
															%><td valign=top class=tm align=right><%
																%><%= contentMenu %><%
															%></td><%
														%></tr><%
													%><%/ITERATE%><%
												%><%ELSE%><%
													%><tr><%
														%><%FOR: index = 0; index < fieldKeys.length; index ++ %><%
															%><th><%
																%><%= fieldNames[index] %><%
															%></th><%
														%><%/FOR%><%
													%></tr><%
													%><%ITERATE: Current : value %><%
														%><%EXEC: listIndex = styleCounter ++ %><%
														%><tr class=<%= styles[styleCounter % 2] %>><%
															%><%EXEC: itemdata = Current.getData() %><%
															%><%EXEC: itemdata || (itemdata = Current.attributes) %><%
															%><%EXEC: fieldKeyIndex = 0 %><%
															%><%ITERATE: fieldKey : fieldKeys %><%
																%><%EXEC: value = fieldLookups[fieldKeyIndex] 
																	? fieldLookups[fieldKeyIndex][ itemdata[fieldKey] ] 
																	: value = itemdata[fieldKey] %><%
																%><%EXEC: line = ControlAPI.toLine( value ) %><%
																%><td><%
																	%><%IF: line == Format.jsObject(value) %><% 
																		= Format.xmlNodeValue( line ); 
																	%><%ELSE%><%
																		%><a href="field.htm?fromlist=<%= key %>&fromdata=<%= fieldKey %>&index=<%= listIndex %>&<%= Request.getParameterString() %>" target=_blank><%
																			= Format.xmlNodeValue( line ); 
																		%></a><%
																	%><%/ELSE%><%
																%><%/IF%><%
																%></td><%
																%><%EXEC: fieldKeyIndex++ %><%
															%><%/ITERATE%><%
														%></tr><%
														%><%OUTPUT: contentMenu %><%
															%><%IF: container %><%
																%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, container.getContentCommands( listIndex ) ) %><%
																	%><input type=submit debug="002" name="formcmd_containeritemcmd_<%= key %>___<%= listIndex %>___<%= command.getKey() %>" value="<%= command.getTitle() %>">&nbsp;<%
																%><%/ITERATE%><%
															%><%ELSE%><%
																%><%IF: !(constant || attributes.constant) %><% 
																	%><input type=submit name="formcmd_listitemedit_<%= key %>___<%= listIndex %>" value="edit">&nbsp;<input type=submit name="formcmd_listitemremove_<%= key %>___<%= listIndex %>" value="remove"><%
																%><%/IF%><%
															%><%/ELSE%><%
															%><%/IF%><%
														%><%/OUTPUT%><%
														%><%IF: contentMenu %><%
															%><tr class=<%= styles[styleCounter % 2] %>><%
																%><td colspan="<%= fieldset.size() %>" valign=top class=tm align=right><%= contentMenu %></td><%
															%></tr><%
														%><%/IF%><%
													%><%/ITERATE%><%
												%><%/ELSE%><%
												%><%/IF%><%
											%></table><%
										%></div><%
										%><div align=right><%
											%><%IF: container %><%
												%><%ITERATE: command : container.getCommands() %><% 
													%><input type=submit name=formcmd_containercmd_<%= key %>___<%= command.getKey() %> value="<%= command.getTitle() %>"><%
													%>&nbsp;<%
												%><%/ITERATE%><%
												%><%EXEC: container = null %><%
											%><%ELSE%><%
												%><%IF: !(constant || attributes.constant) %><%
													%><input type=submit name="formcmd_listadd_<%= key %>" value="<%= intl( en = "add", ru = "добавить" ) %>"><%
												%><%/IF%><%
											%><%/ELSE%><%
											%><%/IF%><%
										%></div><%
									%><%ELSE%><%
										%><div<%IF: !(constant || attributes.constant) && ArrayLength(value) > 6 %><%EXEC: styles = prefix ? ['l1','le'] : ['lo','le'] %>  nowrap class=const<%/IF%>><%
											%><table width=100% class=ti style="font-weight: bold; color: #777777" cellpadding=1 cellspacing=0><%
												%><%EXEC: lookup = Current.attributes.lookup %><%
												%><%ITERATE: Current : value %><%
													%><%EXEC: listIndex = styleCounter++ %><%
													%><%EXEC: lookup && (Current = lookup[Current]) %><%
													%><%EXEC: line = ControlAPI.toLine(Current) %><%
													%><tr class=<%= styles[styleCounter % 2] %>><%
														%><td valign=top><%
															%><%IF: line == Format.jsObject(Current) %><%
																= Format.xmlNodeValue( line );
															%><%ELSE%><%
																%><a href="field.htm?fromlist=<%= key %>&index=<%= listIndex %>&<%= Request.getParameterString() %>" target=_blank><%
																	= Format.xmlNodeValue( line );
																%></a><%
															%><%/ELSE%><%
															%><%/IF%><%
														%></td><%
													%></tr><%
													%><%OUTPUT: contentMenu %><%
														%><%IF: container %><%
															%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, container.getContentCommands( listIndex ) ) %><%
																%><input type=submit debug="003" name="formcmd_containeritemcmd_<%= prefix %><%= key %>___<%= listIndex %>___<%= command.getKey() %>" value="<%= command.getTitle() %>"><%
																%>&nbsp;<%
															%><%/ITERATE%><%
														%><%ELSE%><%
															%><%IF: !(constant || attributes.constant) %><% 
																%><input type=submit name="formcmd_listitemedit_<%= key %>___<%= listIndex %>" value="<%= intl( en = "edit", ru = "изменить" ) %>"><%
																%>&nbsp;<%
																%><input type=submit name="formcmd_listitemremove_<%= key %>___<%= listIndex %>" value="<%= intl( en = "remove", ru = "удалить" ) %>"><%
															%><%/IF%><%
														%><%/ELSE%><%
														%><%/IF%><%
													%><%/OUTPUT%><%
													%><tr class=<%= styles[styleCounter % 2] %>><%
														%><td valign=top class=tm align=right><%
															%><%= contentMenu %><%
														%></td><%
												%><%/ITERATE%><%
											%></table><%
										%></div><%
										%><div align=right><%
											%><%IF: container %><%
												%><%ITERATE: command : container.getCommands() %><% 
													%><input type=submit name=formcmd_containercmd_<%= prefix %><%= key %>___<%= command.getKey() %> value="<%= command.getTitle() %>"><%
													%>&nbsp;<%
												%><%/ITERATE%><%
												%><%EXEC: container = null %><%
											%><%ELSE%><%
												%><%IF: !(constant || attributes.constant) %><%
													%><input type=submit name="formcmd_listadd_<%= key %>" value="<%= intl( en = "add", ru = "добавить" ) %>"><%
												%><%/IF%><%
											%><%/ELSE%><%
											%><%/IF%><%
										%></div><%
									%><%/ELSE%><%
									%><%/IF%><%
								%></td><%
							%></tr><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td colspan=2><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ) 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
						
						%><%MATCH: 'map' %><%
							%><%EXEC: key = Current.getKey() %><%
							%><%EXEC: value = target[ key ] %><%
							%><%EXEC: fieldfieldset = attributes.fieldset %><%
							%><%EXEC: container = (!(constant || attributes.constant) && attributes.content_handler)
																	? attributes.content_handler.call( target, value )
																	: null %><%
							%><%CHOOSE: constant || attributes.constant %><%
								%><%MATCH: 'true', true %><%
								%><%EXEC: styles = ['lo', 'le'] %><%
								%><%EXEC: mapSize = HashSize( value ) %><% 
								%><tr><%
									%><td colspan=2 valign=top<%IF: error %> class=error<%/IF%>><%
										%><%= Current.getTitle() %> (<%= mapSize %> <%= intl( en = "element(s)", ru = "элемент(ов)" ) %>):&nbsp;<%
										%><div<%
											%><%IF: mapSize > 16 %><%
											%> nowrap class=const<%
											%><%/IF%><%
											%>><%
											%><table width=100% class=ti style="font-weight: bold; color: #777777" cellpadding=1 cellspacing=0><%
												%><%IF: fieldfieldset %><%
													%><%CALL: ForHash( value ) %><%
														%><tr class=<%= styles[CurrentIndex % 2] %>><%
															%><td colspan=2 valign=top><%
																%><%= lookup[CurrentKey] %>:&nbsp;<%
															%></td><%
														%></tr><%
														%><%EXEC: newTarget = {} %><%
														%><%EXEC: fieldfieldset.dataRetrieve( Current , newTarget ) %><%
														%><tr class=<%= styles[CurrentIndex % 2] %>><%
															%><td>&nbsp;</td><%
															%><td valign=top><%
																%><table class=ti align=center border=0 cellpadding=0 cellspacing=0><%
																	%><%DEEPER: target = newTarget, fieldset = fieldfieldset, prefix = "ignore_"+key+"___"+CurrentKey+"___", splitters = false, constant = false , value = value, key = key, lookup = lookup, Current = Current %><%
																%></table><%
															%></td><%
														%></tr><%
													%><%/CALL%><%
												%><%ELSE%><%
													%><%CALL: ForHash( value ) %><%
														%><%EXEC: line = ControlAPI.toLine(Current) %><%
														%><tr class=<%= styles[CurrentIndex % 2] %>><%
															%><td valign=top><%
																%><%= CurrentKey %>:&nbsp;<%
															%></td><%
															%><td valign=top><%
																%><%IF: line == Format.jsObject(Current) %><%
																	= Format.xmlNodeValue( line );
																%><%ELSE%><%
																	%><a href="field.htm?frommap=<%= key %>&fieldname=<%= CurrentKey %>&<%= Request.getParameterString() %>" target=_blank><%
																		= Format.xmlNodeValue( line );
																	%></a><%
																%><%/ELSE%><%
																%><%/IF%><%
															%></td><%
														%></tr><%
													%><%/CALL%><%
												%><%/ELSE%><%
												%><%/IF%><%
											%></table><%
										%></div><%
									%></td><%
								%></tr><%
				
								%><%MATCH%><%
									%><%CHOOSE: attributes.variant || fieldfieldset && 'fieldset' %><%
										%><%MATCH: 'select' %><%
											%><tr><%
												%><td colspan=2 valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %>:&nbsp;<%
													%><div <%EXEC: styles = ['lo', 'le'] %> nowrap class=const><%
														%><table width=100% class=ti style="font-weight: bold; color: 777777" cellpadding=1 cellspacing=0><%
															%><%CALL: ForHash( value ) %><%
																%><%IF: fieldfieldset %><%
																	%><tr class=<%= styles[CurrentIndex % 2] %>><%
																		%><td colspan=2 valign=top><%
																			%><%= lookup[CurrentKey] %>:&nbsp;<%
																		%></td><%
																	%></tr><%
																	%><%EXEC: newTarget = {} %><%
																	%><%EXEC: fieldfieldset.dataRetrieve( Current , newTarget ) %><%
																	%><%EXEC: easyForm = !prefix %><%
																	%><%IF: easyForm %><%
																		%><%ITERATE: field : fieldfieldset %><%
																			%><%IF: !field.attributes.constant %><%
																				%><%CHOOSE: field.attributes.type %><%
																					%><%MATCH: 'binary', 'set', 'list', 'map' %><%
																						%><%EXEC: easyForm = false %><%
																				%><%/CHOOSE%><%
																			%><%/IF%><%
																		%><%/ITERATE%><%
																	%><%/IF%><%
																	%><%OUTPUT: contentMenu %><%
																		%><%IF: container %><%
																			%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, container.getContentCommands( CurrentKey ) ) %><%
																				%><input type=submit debug="004" name="formcmd_containeritemcmd_<%= key %>___<%= CurrentKey %>___<%= command.getKey() %>" value="<%= command.getTitle() %>">&nbsp;<%
																			%><%/ITERATE%><%
																		%><%ELSE%><%
																			%><%IF: !easyForm %><input type=submit name="formcmd_mapentryedit_<%= key %>___<%= CurrentKey %>" value="edit">&nbsp;<%/IF%><input type=submit name="formcmd_mapentryremove_<%= key %>___<%= CurrentKey %>" value="remove"><%
																		%><%/ELSE%><%
																		%><%/IF%><%
																	%><%/OUTPUT%><%
																	%><tr class=<%= styles[CurrentIndex % 2] %>><td>&nbsp;</td><td valign=top><table class=ti align=center border=0 cellpadding=0 cellspacing=0><%
																		%><%DEEPER: target = newTarget, fieldset = fieldfieldset, prefix = "tomapfield_"+key+"___"+CurrentKey+"___", splitters = false, constant = !easyForm, value = value, key = key, lookup = lookup, Current = Current %><%
																	%></table></td></tr><%
																%><%ELSE%><%
																	%><%OUTPUT: contentMenu %><%
																		%><%IF: container %><%
																			%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, container.getContentCommands( CurrentKey ) ) %><%
																				%><input type=submit debug="005" name="formcmd_containeritemcmd_<%= key %>___<%= CurrentKey %>___<%= command.getKey() %>" value="<%= command.getTitle() %>">&nbsp;<%
																			%><%/ITERATE%><%
																		%><%ELSE%><%
																			%><input type=submit name="formcmd_mapentryedit_<%= key %>___<%= CurrentKey %>" value="edit">&nbsp;<input type=submit name="formcmd_mapentryremove_<%= key %>___<%= CurrentKey %>" value="remove"><%
																		%><%/ELSE%><%
																		%><%/IF%><%
																	%><%/OUTPUT%><%
																	%><%EXEC: line = ControlAPI.toLine(Current) %><%
																	%><tr class=<%= styles[CurrentIndex % 2] %>><%
																		%><td valign=top><%
																			%><%= CurrentKey %>:&nbsp;<%
																		%></td><%
																		%><td valign=top><%
																			%><%IF: line == Format.jsObject(Current) %><%
																				= Format.xmlNodeValue( line );
																			%><%ELSE%><%
																				%><a href="field.htm?frommap=<%= key %>&fieldname=<%= CurrentKey %>&<%= Request.getParameterString() %>" target=_blank><%
																					= Format.xmlNodeValue( line );
																				%></a><%
																			%><%/ELSE%><%
																			%><%/IF%><%
																		%></td><%
																	%></tr><%
																%><%/ELSE%><%
																%><%/IF%><%
																%><tr class=<%= styles[CurrentIndex % 2] %>><%
																	%><td colspan=2 align=right><%
																		%><%= contentMenu %><%
																	%></td><%
																%></tr><%
															%><%/CALL%><%
														%></table><%
													%></div><%
													%><div align=right><%
														%><%IF: container %><%
															%><%ITERATE: command : container.getCommands() %><% 
																%><input type=submit name=formcmd_containercmd_<%= key %>___<%= command.getKey() %> value="<%= command.getTitle() %>">&nbsp;<%
															%><%/ITERATE%><%
														%><%ELSE%><%
															%><%IF: !(constant || attributes.constant) && !lookup.fill({}).keySet().equals(value.keySet()) %><%
																%><input type=submit name="formcmd_mapselectadd_<%= key %>" value=add><%
															%><%/IF%><%
														%><%/ELSE%><%
														%><%/IF%><%
													%></div><%
												%></td><%
											%></tr><%
					
										%><%MATCH: 'fieldset' %><%
											%><tr><%
												%><td colspan=2 valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %>:&nbsp;<%
													%><div <%EXEC: styles = ['lo', 'le'] %> nowrap class=inner><%
														%><table width=100% class=ti style="font-weight: bold; color: 777777" cellpadding=1 cellspacing=0><%
															%><%EXEC: newTarget = {} %><%
															%><%EXEC: fieldfieldset.dataRetrieve( value , newTarget ) %><%
															%><%DEEPER: target = newTarget, fieldset = fieldfieldset, prefix = "tomap_"+key+"___", splitters = false, constant = false , value = value, key = key, lookup = lookup, Current = Current, attributes = attributes %><%
														%></table><%
													%></div><%
												%></td><%
					
										%><%MATCH%><%
											%><tr><%
												%><td colspan=2 valign=top<%IF: error %> class=error<%/IF%>><%
													%><%= Current.getTitle() %>:&nbsp;<%
													%><div <%EXEC: styles = ['lo', 'le'] %> nowrap class=const><%
														%><table width=100% class=ti style="font-weight: bold; color: 777777" cellpadding=1 cellspacing=0><%
															%><%CALL: ForHash( value ) %><%
																%><%OUTPUT: contentMenu %><%
																	%><%IF: container %><%
																		%><%ITERATE: command : ControlAPI.filterAccessibleCommands(path, container.getContentCommands( CurrentKey ) ) %><%
																			%><input type=submit debug="006" name="formcmd_containeritemcmd_<%= key %>___<%= CurrentKey %>___<%= command.getKey() %>" value="<%= command.getTitle() %>">&nbsp;<%
																		%><%/ITERATE%><%
																	%><%ELSE%><%
																		%><input type=submit name="formcmd_mapentryedit_<%= key %>___<%= CurrentKey %>" value="<%= intl( en = "edit", ru = "изменить" ) %>">&nbsp;<input type=submit name="formcmd_mapentryremove_<%= key %>___<%= CurrentKey %>" value="<%= intl( en = "remove", ru = "удалить" ) %>"><%
																	%><%/ELSE%><%
																	%><%/IF%><%
																%><%/OUTPUT%><%
																%><%IF: fieldfieldset %><%
																	%><tr class=<%= styles[CurrentIndex % 2] %>><%
																		%><td colspan=2 valign=top><%
																			%><%= lookup[CurrentKey] %>:&nbsp;<%
																		%></td><%
																	%></tr><%
																	%><%EXEC: newTarget = {} %><%
																	%><%EXEC: fieldfieldset.dataRetrieve( Current , newTarget ) %><%
																	%><tr class=<%= styles[CurrentIndex % 2] %>><%
																		%><td><%
																			%>&nbsp;<%
																		%></td><%
																		%><td valign=top><%
																			%><table class=ti align=center border=0 cellpadding=0 cellspacing=0><%
																				%><%DEEPER: target = newTarget, fieldset = fieldfieldset, prefix = "tomapfield_"+key+"___"+CurrentKey+"___", splitters = false, constant = false , value = value, key = key, lookup = lookup, Current = Current, attributes = attributes %><%
																			%></table><%
																		%></td><%
																	%></tr><%
																%><%ELSE%><%
																	%><%EXEC: line = ControlAPI.toLine(Current) %><%
																	%><tr class=<%= styles[CurrentIndex % 2] %>><%
																		%><td valign=top><%
																			%><%= CurrentKey %>:&nbsp;<%
																		%></td><%
																		%><td valign=top><%
																			%><%IF: line == Format.jsObject(Current) %><%
																				= Format.xmlNodeValue( line );
																			%><%ELSE%><%
																				%><a href="field.htm?frommap=<%= key %>&fieldname=<%= CurrentKey %>&<%= Request.getParameterString() %>" target=_blank><%
																					= Format.xmlNodeValue( line );
																				%></a><%
																			%><%/ELSE%><%
																			%><%/IF%><%
																		%></td><%
																	%></tr><%
																%><%/ELSE%><%
																%><%/IF%><%
																%><tr class=<%= styles[CurrentIndex % 2] %>><td colspan=2 align=right><%= contentMenu %></td></tr><%
															%><%/CALL%><%
														%></table><%
													%></div><%
													%><div align=right><%
														%><%IF: container %><%
															%><%ITERATE: command : container.getCommands() %><% 
																%><input type=submit name=formcmd_containercmd_<%= key %>___<%= command.getKey() %> value="<%= command.getTitle() %>">&nbsp;<%
															%><%/ITERATE%><%
														%><%ELSE%><%
															%><%IF: !(constant || attributes.constant) %><%
																%><input type=submit name="formcmd_mapadd_<%= key %>" value="<%= intl( en = "add", ru = "добавить" ) %>"><%
															%><%/IF%><%
														%><%/ELSE%><%
														%><%/IF%><%
													%></div><%
												%></td><%
											%></tr><%
											
									%><%/CHOOSE%><%
									
							%><%/CHOOSE%><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td colspan=2><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
				
						%><%MATCH: 'drawing' %><%
							%><tr><%
								%><td colspan=2 valign=top<%IF: error %> class=error<%/IF%>><%
									%><%= Current.getTitle() %>:&nbsp;<br/><%
									%><img src="field.htm?<%= Request.getParameterString() %>&fieldname=<%= Current.getKey() %>&gwidth=600&gheight=300" alt="<%= Current.getTitle() %>" width=600 height=300><%
								%></td><%
							%></tr><%
							%><tr><%
								%><td colspan=2 valign=top align=right><%
									%><a target=_blank href="field.htm?<%= Request.getParameterString() %>&fieldname=<%= Current.getKey() %>" alt="<%= Current.getTitle() %>"><%
										%>preview...<%
									%></a><%
								%></td><%
							%></tr><%
							%><%IF: attributes.hint %><%
								%><tr><%
									%><td colspan=2><%
										%><i><small><%
											= Format.xmlNodeValue( attributes.hint ); 
										%></small></i><%
									%></td><%
								%></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
				
				
						%><%MATCH%><%
							%><tr><td colspan=2<%IF: error %> class=error<%/IF%>><%= attributes.type %></td></tr><%
							%><%IF: attributes.hint %><%
								%><tr><td></td><td><i><small><%
									= Format.xmlNodeValue( attributes.hint ); 
								%></small></i></td></tr><%
							%><%/IF%><%
							%><%IF: splitters %><%
								%><tr><td colspan=2><hr/></td></tr><%
							%><%/IF%><%
					%><%/CHOOSE%><%
				%><%/ITERATE%><%
			%><%/RECURSION%><%
			%><%IF: Object.isFilled(errors) %><%
				%><tr><%
					%><td class=tt colspan=2><%
						%><%= intl( en = "All Errors", ru = "Все ошибки" ) %>:<%
						%><table class=ti><%
							%><%CALL: ForHash(errors) %><%
								%><tr><%
									%><td valign=top><%
										%><b><%
											%><%= fieldset.getField(CurrentKey).getTitle() %>:&nbsp;<%
										%></b><%
									%></td><%
									%><td><%
										= Format.xmlNodeValue(Current);
									%></td><%
								%></tr><%
							%><%/CALL%><%
						%></table><%
					%></td><%
				%></tr><%
			%><%/IF%><%
		%><%ELSE%><%
			%><tr><td colspan=2>Form has no fields.</td><tr><%
		%><%/ELSE%><%
		%><%/IF%><%
		%><tr><%
			%><td colspan=2 align=right>&nbsp;<br/><%
				%><script><%
					%>options = [];<%
					%>menuItems.push({ title : "<%= intl(en = "Commands", ru = "Команды") %>", submenu : options });<%
				%></script><%
				%><%ITERATE: Current : data.getCommands() %><%
					%><button<%
						%> class=sm<%
						%> style="background-image: url(/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif)"<%
						%> type=submit<%
						%> id=<%= Format.xmlAttributeValue( 'cmd_' + Current.getKey() ) %><%
						%> name=<%= Format.xmlAttributeValue( 'cmd_' + Current.getKey() ) %><%
					%>><%
						= Format.xmlNodeValue( Current.getTitle() );
					%></button><%
					%>&nbsp;<%
					%><script><%
						%>options.push({<%
							%>icon:"/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(Current) %>.32.gif",<%
							%>title:<%= Format.jsString( Current.getTitle() ) %>,<%
							%>onclick:function(){document.getElementById(<%= Format.jsString( 'cmd_' + Current.getKey() ) %>).click()}<%
						%>});<%
					%></script><%
				%><%/ITERATE%><%
				%><button<%
					%> class=sm<%
					%> style="background-image: url(/!/skin/ctrl-simple/icons/command-close.32.gif)"<%
					%> type=submit<%
					%> id=close<%
					%> name=close<%
				%>><%
					= intl(en = "Close", ru = "Закрыть");
				%></button><%
				%><script><%
					%>menuItems.push({<%
						%>icon:"/!/skin/ctrl-simple/icons/command-close.32.gif",<%
						%>title:"<%= intl(en = "Close", ru = "Закрыть") %>",<%
						%>onclick:function(){document.getElementById('close').click()}<%
					%>});<%
				%></script><%
			%></td><%
		%></tr><%
	%></table><%
	%></form><%
	
%><%/OUTPUT%><%

%><%RETURN: content %><%
%>