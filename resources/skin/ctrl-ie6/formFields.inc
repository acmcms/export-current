<%

%><%EXEC: styleSheets || (styleSheets = []) %><%
%><%EXEC: scripts || (scripts = []) %><%
%><%EXEC: fieldTypeList = [] %><%

%><%RECURSION: target = target, fieldset = fieldset, prefix = (prefix || ""), mapPath = "", fieldsetFlag = fieldsetFlag %><%
	
	%><%CALL: ForArray( fieldset ) %><%
		%><%EXEC: attributes = Current.attributes %><%
		
		%><%EXEC: name = Current.key %><%
		%><%EXEC: title = Current.title %><%
		%><%EXEC: error = errors[ name ] %><%
		%><%EXEC: value = target[ name ] %><%
		
		%><%EXEC: hint = attributes.hint ? '<div class=DescriptionPlain>'+attributes.hint+'</div>' : '' %><%
		
		%><%INCLUDE: 'lookupPrepare.inc' %><%
		
		%><%CHOOSE: attributes.type %><%
		%><%MATCH: 'string' %><%
		
			%><%IF: !scripts.contains('formFields.string.js') && !attributes.constant %><%
				%><%EXEC: scripts.add('formFields.string.js') %><%
				%><%INCLUDE: 'formFields.string.js' %><%
			%><%/IF%><%
		
			%><%EXEC: lookup && (value = lookup[ value ] || value) %><%
		
			%><%CHOOSE:attributes.variant%><%
				%><%MATCH: 'link', 'url' %><%
					%><tr id="fld<%=prefix%>__<%=name%>" type="string"><%
						%><td valign=top align=right class=fieldhead nowrap><%=title%>:</td><%
						%><td valign=top width=100%><%
							%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
								%><tr><%
									%><td width=100%><%
										%><!-- cannot use 'type=url' cause we support URIs as well --><%
										%><input type=text name="<%=prefix%>__<%=name%>"<%IF:attributes.constant%> readonly class=disable<%/IF%> style="width:100%" value="<%=Format.xmlAttributeFragment(value)%>"><%
										%><%= StringToHtml(hint) %><%
									%></td><%
									%><%IF: !attributes.constant %><%
										%><td style="padding-left:2px"><%
											%><button type=button class=button1 width=20 onclick="getUrl('<%=prefix%>__<%=name%>')">...</button><%
										%></td><%
									%><%/IF%><%
									%><td style="padding-left:2px"><%
										%><button type=button class=button1 width=25 onclick="goToUrl('<%=prefix%>__<%=name%>')">GO</button><%
									%></td><%
									%><%IF: !scripts.contains('formFields.url.js') %><%
										%><%EXEC: scripts.add('formFields.url.js') %><%
										%><%INCLUDE: 'formFields.url.js' %><%
									%><%/IF%><%
								%></tr><%
							%></table><%
						%></td><%
					%></tr><%
				%><%MATCH:'password' %><%
					%><%CHOOSE: attributes.method%><%
						%><%MATCH:'get' %><%
							%><tr id="fld<%=prefix%>__<%=name%>" type="string"><%
								%><td valign=top align=right class=fieldhead nowrap><%=title%>:</td><%
								%><td valign=top width=100%><%
									%><input type=password<%IF: !attributes.constant%> name="<%=prefix%>__<%=name%>"<%ELSE%> readonly class=disable<%/ELSE%><%/IF%> style="width:130px" value="<%=Format.xmlAttributeFragment(value) %>"><%
									%><%=StringToHtml(hint) %><%
								%></td><%
							%></tr><%
						%><%MATCH%><%
		
							%><%IF: !scripts.contains('formFields.password.js') && !attributes.constant%><%
								%><%EXEC: scripts.add('formFields.password.js') %><%
								%><%INCLUDE: 'formFields.password.js' %><%
							%><%/IF%><%
		
							%><tr id="fld<%=prefix%>__<%=name%>" ondeactivate="ConfirmPassword(this)" type="string"><%
								%><td valign=top align=right class=fieldhead nowrap><%=title%>:</td><%
								%><td valign=top width=100%><%
									%><table border=0 cellpadding=0 cellspacing=0 width=260><%
										%><tr><%
											%><td width=50%><%
												%><input type=password<%IF: !attributes.constant%> name="<%=prefix%>__<%=name%>"<%ELSE%> readonly class=disable<%/ELSE%><%/IF%> style="width:100%" value="<%=Format.xmlAttributeFragment(value) %>" onkeyup="ControllPassword(this)"><%
											%></td><%
											%><td width=50% style="padding-left:2px"><%
												%><input type=password id="<%=prefix%>__<%=name%>_confirm" style="width:100%" readonly class=disable><%
											%></td><%
										%></tr><%
									%></table><%
								%></td><%
							%></tr><%
					%><%/CHOOSE%><%
		
				%><%MATCH%><%
					%><%EXEC:rows = GetOccuranceCount(Format.xmlNodeValue(value),'\n',4) + 1 %><%
					%><tr id="fld<%= prefix %>__<%= name %>" type="string"><%
						%><td valign=top align=right class=fieldhead nowrap><%=title%>:</td><%
						%><td valign=top width=100%><%
							%><input type=text<%IF: !attributes.constant %> name="<%= prefix %>__<%= name %>"<%ELSE%> readonly class=disable<%/ELSE%><%/IF%> style="width:100%" value="<%= Format.xmlAttributeFragment( value ) %>"><%
							%><%= StringToHtml( hint ) %><%
						%></td><%
					%></tr><%
			%><%/CHOOSE%><%
		
			%><%IF: !attributes.constant%><%
				%><%FORMAT:'default' %><%
				%><script><%
					%>stringIni('fld<%=prefix%>__<%=name%>');<%
				%></script><%
				%><%/FORMAT%><%
			%><%/IF%><%
		
		%><%MATCH: 'boolean' %><%
			%><tr><%
				%><td></td><%
				%><td><%
					%><table border=0 cellpadding=0 cellspacing=1><%
						%><tr><%
							%><td><%
								= Format.xmlElement('input', {
									id : 'label' + name,
									value : 1,
									type : 'checkbox',
									'class' : 'checkbox1',
									checked : Int(value, 0) ? 'checked' : undefined,
									onclick : "this.nextSibling.value = (Number(this.checked));"
								});
								= Format.xmlElement('input', {
									type : 'hidden', 
									name : prefix + '__' + name,
									value : value
								});
							%></td><%
							%><td class=t><%
								%><LABEL FOR="label<%=name%>"><%=title%></LABEL><%
							%></td><%
						%></tr><%
					%></table><%
					%><%=StringToHtml(hint) %><%
				%></td><%
			%></tr><%
		
		%><%MATCH:'number' %><%
			%><%IF: !scripts.contains('formFields.string.js') && !attributes.constant%><%
				%><%EXEC: scripts.add('formFields.string.js') %><%
				%><%INCLUDE: 'formFields.string.js' %><%
			%><%/IF%><%
		
			%><tr id="fld<%=prefix%>__<%=name%>" type="number"><%
				%><td valign=top align=right class=fieldhead nowrap><%
					%><%=title%>:<%
				%></td><%
				%><td valign=top width=100%><%
					%><input<%IF: !attributes.constant%> name="<%=prefix%>__<%=name%>"<%ELSE%> readonly class=disable<%/ELSE%><%/IF%> type=text style="width:100%" value="<%= Format.xmlAttributeFragment(value) %>" min=<%=Min%> max=<%=Max%>><%
					%><%=StringToHtml(hint) %><%
				%></td><%
			%></tr><%
		
			%><%IF: !attributes.constant%><%
				%><%FORMAT:'default' %><%
				%><script><%
					%>stringIni('fld<%=prefix%>__<%=name%>');<%
				%></script><%
				%><%/FORMAT%><%
			%><%/IF%><%
		
		%><%MATCH:'date' %><%
			%><%IF: !scripts.contains('formFields.date.js') && !attributes.constant%><%
				%><%EXEC: scripts.add('formFields.date.js') %><%
				%><%INCLUDE: 'formFields.date.js' %><%
			%><%/IF%><%
		
			%><tr id="fld<%=prefix%>__<%=name%>" type="date"><%
				%><td valign=top align=right class=fieldhead nowrap><%
					%><%=title%>:<%
				%></td><%
				%><td valign=top width=100%><%
					%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
						%><tr><%
							%><td width=100%><%
								%><input<%
									%><%IF: !attributes.constant %><%
										%> name="<%=prefix%>__<%=name%>"<%
									%><%ELSE%><%
										%> readonly class=disable<%
									%><%/ELSE%><%
									%><%/IF%><%
									%> type=text<%
									%> style="width:100%"<%
									%> value="<%= Format.xmlAttributeFragment(value) %>"<%
									%> Format="<%= attributes.format %>"<%
									%> Millis="<%= value.getTime() %>"<%
								%>><%
							%></td><%
							%><%IF:!attributes.constant%><%
								%><td style="padding-left:2px"><%
									%><button class=button1 width=20 onclick="getCalendarDate('<%=prefix%>__<%=name%>')">...</button><%
								%></td><%
							%><%/IF%><%
						%></tr><%
					%></table><%
					%><%= Format.xmlNodeValue(hint) %><%
				%></td><%
			%></tr><%
		
			%><%IF:!attributes.constant%><%
				%><%FORMAT:'default'%><%
					%><script><%
						%>dateIni('fld<%=prefix%>__<%=name%>');<%
					%></script><%
				%><%/FORMAT%><%
			%><%/IF%><%
		
		
		%><%MATCH: 'select' %><%
			%><%CHOOSE: attributes.variant%><%
				%><%MATCH:'bigselect' %><%
					%><%IF: attributes.constant%><%
						%><tr id="fld<%=prefix%>__<%=name%>"><%
							%><td valign=top align=right class=fieldhead nowrap><%=title%>:</td><%
							%><td valign=top width=100%><input type=text readonly class=disable style="width:100%" value="<%=Format.xmlAttributeFragment(lookup[value] || value) %>"><%=StringToHtml(hint) %></td><%
						%></tr><%
					%><%ELSE%><%
						%><tr id="fld<%=prefix%>__<%=name%>"><%
						%><td colspan=2 style="height:<%=singleField ? '100%' : '' %>"><%
							%><fieldset style="width:100%; height:100%; padding:0 10px 0 10px"><%
								%><legend>&nbsp;<%=title%>&nbsp;</legend><%
								
								%><%ITERATE: cKey : lookupOrder %><%
									%><%EXEC: cTitle = lookup[cKey] || cKey %><%
									%><%IF: cKey != '' %><%
										%><table border=0 cellpadding=0 cellspacing=0><%
											%><tr><%
												%><td valign=top style="padding-left:<%=level*15%>px"><%
													= Format.xmlElement('input', {
														type : 'radio',
														id : prefix + '__' + name + '_' + cKey,
														name : prefix + '__' + name,
														value : cKey,
														checked : cKey == value ? 'checked' : undefined,
													});
												%></td><%
												%><td style="padding:3px 0 3px 3px" valign=top><%
													%><label for="<%=prefix%>__<%=name%>_<%=cKey%>"><%=Format.xmlNodeValue(cTitle) %></label><%
												%></td><%
											%></tr><%
										%></table><%
									%><%ELSE%><%
										%><%EXEC: (cTitle == '+') && (ident = Create.list(++level, '&nbsp;&nbsp;&nbsp;').join('')) %><%
										%><%EXEC: (cTitle == '-') && (ident = Create.list(--level, '&nbsp;&nbsp;&nbsp;').join('')) %><%
									%><%/ELSE%><%
									%><%/IF%><%
								%><%/ITERATE%><%
							%></fieldset><%
						%></td><%
						%></tr><%
					%><%/ELSE%><%
					%><%/IF%><%
				%><%MATCH%><%
					%><tr id="fld<%=prefix%>__<%=name%>"><%
						%><td valign=top align=right class=fieldhead nowrap><%=title%>:</td><%
						%><td width=100% valign=top><%
							%><select<%IF: !attributes.constant%> name="<%=prefix%>__<%=name%>"<%/IF%> style="width:100%" class=input2><%
								%><%EXEC: ident = "" %><%
								%><%EXEC: level = 0 %><%
								%><%ITERATE: cKey : lookupOrder %><%
									%><%EXEC: cTitle = lookup[cKey] || cKey %><%
									%><%IF: cKey != '' %><%
										%><option<%
											%><%IF: String(cKey) === String(value) %> selected<%/IF%><%
											%> value="<%= Format.xmlAttributeFragment(cKey) %>"<%
											%>><%
											%><%=ident + Format.xmlNodeValue(cTitle) %><%
										%></option><%
									%><%ELSE%><%
										%><%EXEC: (cTitle == '+') && (ident = Create.list(++level, '&nbsp;&nbsp;&nbsp;').join('')) %><%
										%><%EXEC: (cTitle == '-') && (ident = Create.list(--level, '&nbsp;&nbsp;&nbsp;').join('')) %><%
									%><%/ELSE%><%
									%><%/IF%><%
								%><%/ITERATE%><%
							%></select><%
							%><%=StringToHtml(hint) %><%
						%></td><%
					%></tr><%
			%><%/CHOOSE%><%
		
		%><%MATCH: 'set'%><%
			%><%CHOOSE: attributes.variant%><%
				%><%MATCH:'calendar' %><%
					%><%INCLUDE: 'formFields.inc.calendar' %><%
		
				%><%MATCH%><%
					%><%IF:!styleSheets.contains('zakladka.css')%>
						<style>
							<%INCLUDE: 'zakladki.css' %>
						</style>
						<%EXEC:styleSheets.add('zakladka.css')%>
					<%/IF%>
		
					<%IF:!scripts.contains('zakladki.splitters.js')%>
						<script>
							<%INCLUDE: 'zakladki.splitters.js' %>
						</script>
						<%EXEC:scripts.add('zakladki.splitters.js')%>
					<%/IF%>
		
					<%IF:!scripts.contains('formFields.setmultiple.js')%>
						<%IF:!attributes.constant%>
							<%EXEC:scripts.add('formFields.setmultiple.js')%>
							<%INCLUDE: 'formFields.setmultiple.js' %>
						<%/IF%>
					<%/IF%>
		
					<%IF:!styleSheets.contains('formFields.setmultiple.css')%>
						<%IF:!attributes.constant%>
							<%EXEC:styleSheets.add('formFields.setmultiple.css')%>
							<%INCLUDE: 'formFields.setmultiple.css' %>
						<%/IF%>
					<%/IF%><%
		
					%><tr id="fld<%=prefix%>__<%=name%>"><%
						%><td colspan=2 style="height:<%=singleField || oneBigField ? '100%' : '236px'%>; padding:5px 0 5px 0"><%
							%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="fld<%=prefix%>__<%=name%>_obj"><%
								%><tr><%
									%><td><%
										%><table border=0 cellpadding=0 cellspacing=0 class=zakladka width=100%><%
											%><tr><%
												%><TD><script>document.write(tabSplitter3)</script></TD><%
												%><td class=TabOn id="holder" nowrap onclick="mForm.switchWholeWindowMode('fld<%=prefix%>__<%=name%>')"><%
													%><div><%
														%><table border=0 cellpadding=0 cellspacing=0><%
															%><tr><%
																%><td class=title nowrap><%
																	%><%=title%>&nbsp;<%
																	%><span style="font-family:Webdings;line-height:5px;font-size:11px"><%
																		%>5<%
																	%></span><%
																%></td><%
															%></tr><%
														%></table><%
													%></div><%
												%></td><%
												%><TD><script>document.write(tabSplitter4)</script></TD><%
												%><td style="width:100%" valign=bottom><%
													%><div class=submenu><%
														%><span>Help</span><img align=absmiddle><%
													%></div><%
												%></td><%
											%></tr><%
											%><tr class=border><%
												%><td class=TabOffl><img width=0 height=0></td><%
												%><td><img width=0 height=0></td><%
												%><td class=TabOffr><img width=0 height=0></td><%
												%><td class=TabOn><img width=0 height=0></td><%
											%></tr><%
										%></table><%
									%></td><%
								%></tr><%
								%><tr><%
									%><td height=100%><%
										%><table border=0 cellpadding=0 cellspacing=0 style="border-left:1px solid buttonhighlight; border-right:1px solid buttonshadow; border-bottom:1px solid buttonshadow;padding:5px;height:100%;width:100%"><%
											%><%IF: lookupOrder && lookupOrder.length > 15 %><%
												%><%EXEC: selected = [] %><%
												%><%ITERATE: element : value %><%
													%><%EXEC: lookup[element] && selected.add(element) %><%
												%><%/ITERATE%><%
												%><%EXEC: showAllSet = !selected.length || 1.0 * lookupOrder.length / selected.length < 2 %><%
											%><%ELSE%><%
												%><%EXEC: showAllSet = true %><%
											%><%/ELSE%><%
											%><%/IF%><%
											%><tr><%
												%><td valign=top style="width:100%"><%
													%><div style="width:100%;height:100%;overflow:auto;padding:2px 4px;background-color:window" class="FrameBorder" fieldName="<%=prefix%>__<%=name%>"><%
														%><table class="formSetMultiple blockParent" border=0 cellpadding=0 cellspacing=0 style="margin:2px 0; display:none" fieldName="<%=prefix+'__'+name%>" mapPath="<%=mapPath + name%>"><%
															%><%ITERATE: cKey : lookupOrder %><%
																%><%EXEC: cTitle = lookup[cKey] || cKey %><%
																%><%EXEC: isInArray = value.contains(cKey) %><%
																%><tr key="<%=Format.xmlAttributeFragment(cKey) %>"<%IF: isInArray%> checked=true<%/IF%><%IF: !showAllSet && !isInArray%> style="display:none"<%/IF%>><%
																	%><td class=check valign=top><%
																	%><div><%
																		%><%IF:isInArray%>a<%/IF%><%
																	%></div><%
																	%></td><%
																	%><td class=title width=100% nowrap <%=isInArray ? ' style="font-weight:bold"':'' %>><%
																		%><%=Format.xmlNodeValue(cTitle)%><%
																		%><%IF:isInArray%><%
																			%><input type=hidden name="<%=prefix+'__'+name%>" value="<%=Format.xmlAttributeFragment(cKey)%>"><%
																		%><%/IF%><%
																	%></td><%
																%></tr><%
															%><%/ITERATE%><%
														%></table><%
													%></div><%
												%></td><%
												%><td valign=top style="width:100px;padding-left:0"><%
													%><button info="filter" state="<%=showAllSet ? 'all' : 'selected' %>" onclick="setFilterSetMultiple('<%=prefix%>__<%=name%>')" style="width:100%"><%
														%><%=intl(en="Selected", ru="Выбранные") %><%
													%></button><br><%
													%><button info="selectall" onclick="setAllSetMultiple('<%=prefix%>__<%=name%>')" style="width:100%; margin-top:5px"><%
														%><%=intl(en="Select all", ru="Выбрать все") %><%
													%></button><br><%
													%><button info="clearall" onclick="clearSetMultiple('<%=prefix%>__<%=name%>')" style="width:100%"><%
														%><%=intl(en="Remove all", ru="Очистить список") %><%
													%></button><%
												%></td><%
											%></tr><%
											%><%IF: hint %><%
												%><tr><td style="height:0;padding-top:0"><%= StringToHtml(hint) %></td></tr><%
											%><%/IF%><%
										%></table><%
									%></td><%
								%></tr><%
							%></table><%
						%></td><%
					%></tr><%
		
			%><%/CHOOSE%><%
		
		
		%><%MATCH: 'list'%><%
			%><%CHOOSE: attributes.variant %><%
				%><%MATCH: 'multiselect' %><%
					%><%IF:!styleSheets.contains('zakladka.css')%>
						<style>
							<%INCLUDE: 'zakladki.css' %>
						</style>
						<%EXEC:styleSheets.add('zakladka.css')%>
					<%/IF%>
		
					<%IF:!scripts.contains('zakladki.splitters.js')%>
						<script>
							<%INCLUDE: 'zakladki.splitters.js' %>
						</script>
						<%EXEC:scripts.add('zakladki.splitters.js')%>
					<%/IF%>
		
					<%IF:!scripts.contains('formFields.listmultiple.js')%>
						<%IF:!attributes.constant%>
							<%EXEC:scripts.add('formFields.listmultiple.js')%>
							<%INCLUDE: 'formFields.listmultiple.js' %>
						<%/IF%>
					<%/IF%>
		
					<%IF:!styleSheets.contains('formFields.listmultiple.css')%>
						<%IF:!attributes.constant%>
							<%EXEC:styleSheets.add('formFields.listmultiple.css')%>
							<%INCLUDE: 'formFields.listmultiple.css' %>
						<%/IF%>
					<%/IF%><%
		
		
					%><tr id="fld<%=prefix%>__<%=name%>"><%
						%><td colspan=2 style="height:80px; padding:5px 0"><%
							%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="fld<%=prefix%>__<%=name%>_obj"><%
								%><tr><%
									%><td><%
										%><table border=0 cellpadding=0 cellspacing=0 class=zakladka width=100%><%
											%><tr><%
												%><TD><script>document.write(tabSplitter3)</script></TD>
												<TD class=TabOn id="holder" nowrap style="width:100"><div><%=title%></div></TD>
												<TD><script>document.write(tabSplitter4)</script></TD><%
												%><td style="width:100%"></td><%
											%></tr><%
											%><tr class=border><%
												%><td class=TabOffl><img width=0 height=0></td><%
												%><td><img width=0 height=0></td><%
												%><td class=TabOffr><img width=0 height=0></td><%
												%><td class=TabOn><img width=0 height=0></td><%
											%></tr><%
										%></table><%
									%></td><%
								%></tr><%
								%><tr><%
									%><td height=100%><%
										%><table border=0 cellpadding=0 cellspacing=0 width=100% style="border-left:1px solid buttonhighlight;border-right:1px solid buttonshadow;border-bottom:1px solid buttonshadow;padding:5px;height:100%"><%
											%><tr><%
												%><td valign=top><%
													%><div style="width:100%; height:100%; overflow:auto; padding:2px 4px" class="FrameBorder formListMultiple" fieldName="<%=prefix%>__<%=name%>" mapPath="<%=mapPath + name%>"><%
														%><%EXEC: html = '' %><%
														%><%CALL: ForArray(value) %><%
															%><span canBeSelected=1 index="<%=CurrentIndex%>" key="<%= Format.xmlAttributeFragment(Current) %>"><%
																%><%=lookup[Current] || Current %><%
															%></span>;<%
															%><%EXEC: html += '<input type=hidden index="'+CurrentIndex+'" name="'+prefix+'__'+name+'" value="'+Current+'">' %><%
														%><%/CALL%><%
													%></div><%
												%></td><%
												
												%><%=html%><%
					
												%><td style="width:100px; padding-left:0"><%
													%><button onclick="openEditList('<%=prefix%>__<%=name%>','<%=mapPath + name%>')" style="width:100%"><%
														%><%=intl(en="Edit list", ru="Редактировать") %><%
													%></button><br><%
													%><button onclick="removeFromEditList('<%=prefix%>__<%=name%>')" style="width:100%"><%
														%><%=intl(en="Remove item", ru="Удалить текущий") %><%
													%></button><br><%
													%><button onclick="clearEditList('<%=prefix%>__<%=name%>')" style="width:100%"><%
														%><%=intl(en="Remove all", ru="Очистить список") %><%
													%></button><%
												%></td><%
											%></tr><%
											%><%IF: hint %><%
												%><tr><td style="height:0; padding-top:0"><%=StringToHtml(hint) %></td></tr><%
											%><%/IF%><%
										%></table><%
									%></td><%
								%></tr><%
							%></table><%
						%></td><%
					%></tr><%
		
				%><%MATCH%><%
					%><%IF:!styleSheets.contains('zakladka.css')%>
						<style>
							<%INCLUDE: 'zakladki.css' %>
						</style>
						<%EXEC:styleSheets.add('zakladka.css')%>
					<%/IF%>
		
					<%IF:!scripts.contains('zakladki.splitters.js')%>
						<script>
							<%INCLUDE: 'zakladki.splitters.js' %>
						</script>
						<%EXEC:scripts.add('zakladki.splitters.js')%>
					<%/IF%>
		
					<%IF:!scripts.contains('formFields.list-map.js')%>
						<script>
							<%INCLUDE: 'ListFieldFrame.js' %>
						</script>
						<%EXEC:scripts.add('formFields.list-map.js')%>
					<%/IF%><%
		
					%><tr id="fld<%=prefix%>__<%=name%>" valueObject="list_fld<%=prefix%>__<%=name%>"<%IF: !attributes.constant%> constant=1<%/IF%>><%
						%><td colspan=2 style="height:<%=singleField || oneBigField ? '100%' : '236px' %>; padding:5px 0"><%
							%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="fld<%=prefix%>__<%=name%>_obj"<%IF: !attributes.constant%> activate="key=<%=Request.id%>&fieldName=<%=prefix%><%=name%>" valueObject="list_fld<%=prefix%>__<%=name%>"<%/IF%>><%
								%><tr><%
									%><td><%
										%><table border=0 cellpadding=0 cellspacing=0 class=zakladka width=100%><%
											%><tr><%
												%><TD><script>document.write(tabSplitter3)</script></TD><%
												%><td class=TabOn id="holder" nowrap onclick="mForm.switchWholeWindowMode('fld<%=prefix%>__<%=name%>')"><%
													%><div><%
														%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
															%><tr><%
																%><td nowrap><%=title%></td><%
																%><td align=right style="font-family:Webdings; padding:0 10px 0 10px">5</td><%
															%></tr><%
														%></table><%
													%></div><%
												%></td><%
												%><TD><script>document.write(tabSplitter4)</script></TD><%
												%><td style="width:100%"></td><%
											%></tr><%
											%><tr class=border><%
												%><td class=TabOffl><img width=0 height=0></td><%
												%><td><img width=0 height=0></td><%
												%><td class=TabOffr><img width=0 height=0></td><%
												%><td class=TabOn><img width=0 height=0></td><%
											%></tr><%
										%></table><%
									%></td><%
								%></tr><%
								%><tr><%
									%><td height=100%><%
										%><table border=0 cellpadding=0 cellspacing=0 width=100% style="border-left: 1px solid buttonhighlight; border-right: 1px solid buttonshadow; border-bottom: 1px solid buttonshadow; padding:5px; height:100%"><%
											%><tr><%
												%><td valign=top><%
													%><div class=FrameBorder style="height:100%"><%
														%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="list_fld<%=prefix%>__<%=name%>" path="<%=path%>"><%
															%><tr><%
																%><td class=FrameBorder2><%
																	%><table border=0 cellpadding=0 cellspacing=0 style="width:100%"><%
																		%><tr><%
																			%><td style="padding:2px" cla2ss=FrameBorder2 width=100%><%
																				%><table border=0 cellpadding=0 cellspacing=0 style="width:100%"><%
																					%><tr><%
																						%><td width=100% class=SubmenuFrame nowrap id=TDPaging></td><%
																					%></tr><%
																				%></table><%
																			%></td><%
																			%><%EXEC: container = !attributes.constant && attributes.content_handler ? attributes.content_handler.call( target, value ) : null %><%
																			%><%IF: !attributes.constant%><%
																				%><td class=menuTollbar formID="<%=Request.id%>" fieldName="<%=prefix%><%=name%>"><%
																					%><span commandType="form" id="FieldCommands" group="FieldCommands"><%
																					%><%IF: container %><%
																						%><%ITERATE: command : container.getCommands() %><%
																							%><button cmd="formcmd_containercmd_<%= prefix %><%= name %>___<%= command.getKey() %>"><img src="icons/<%= ControlAPI.getIcon(command) %>.16.gif" title="<%= Format.xmlAttributeFragment( command.getTitle() ) %>" width=16 height=16></button><%
																						%><%/ITERATE%><%
																					%><%ELSE%><%
																						%><button myCmd="dialog" path="formDialog.listadd?id=<%=Request.id%>&data=<%=name%>"><img src="icons/command-add.16.gif" title="<%=intl(en="Add", ru="Добавить") %>" width=16 height=16></button><%
																					%><%/ELSE%><%
																					%><%/IF%><%
																					%></span><%
																				%></td><%
																			%><%/IF%><%
																			%><td style="padding:1px"><%
																				%><button class=icon onclick="list_fld<%=prefix%>__<%=name%>.refresh()"><%
																					%><img src="icons/command-reload.16.gif" width=16 height=16 title="<%= intl( en = "Refresh", ru = "Обновить" ) %>"><%
																				%></button><%
																			%></td><%
																		%></tr><%
																	%></table><%
																%></td><%
															%></tr><%
															%><tr><%
																%><td height=100%><%
																	%><iframe name="list_fld<%=prefix%>__<%=name%>Frm" src="formFields.listing.list?id=<%=Request.id%>&data=<%=prefix%><%=name%>" style="width:100%; height:100%" frameborder=0></iframe><%
																%></td><%
															%></tr><%
														%></table><%
													%></div><%
												%></td><%
											%></tr><%
											%><%IF: hint %><%
												%><tr><td style="height:0; padding-top:0"><%= StringToHtml(hint) %></td></tr><%
											%><%/IF%><%
										%></table><%
									%></td><%
								%></tr><%
							%></table><%
						%></td><%
					%></tr><%
			%><%/CHOOSE%><%
		
		
		%><%MATCH: 'map' %><%
			%><%EXEC: fieldfieldset = attributes.fieldset %><%
			%><%CHOOSE: attributes.variant || fieldfieldset && 'fieldset' %><%
				%><%MATCH:'select' %><%
					%><%INCLUDE: 'formFields.inc.mapselect' %><%
		
				%><%MATCH: 'fieldset' %><%
					%><%IF: (singleField || oneBigField) && 
							(StartsWith(zoomingFieldName, "tomap_"+name+"___") || StartsWith(bigFieldName, "tomap_"+name+"___")) %><%
						%><%EXEC: height = true %><%
					%><%/IF%><%
		
					%><%EXEC: newTarget = {} %><%
					%><%EXEC: fieldfieldset.dataRetrieve( value , newTarget ) %><%
		
					%><%IF: !fieldsetFlag %><%
						%><tr><%
							%><td colspan=2 style="height:<%=height ? '100%' : '' %>"><%
								%><fieldset style="width:100%; height:100%; padding:0 10px 0 10px"><%
									%><legend>&nbsp;<%=title%>&nbsp;</legend><%
									%><table border=0 cellpadding=0 cellspacing=1 width=100%<%=height ? ' height=100%' : '' %>><%
										%><%DEEPER: target = newTarget, fieldset = fieldfieldset, prefix = "tomap_"+name+"___", value = value, name = name, lookup = lookup, Current = Current, attributes = attributes, mapPath = name + "/" + mapPath, fieldsetFlag = true %><%
									%></table><%
								%></fieldset><%
							%></td><%
						%></tr><%
					%><%ELSE%><%
						%><tr<%IF: !First %> style="display:none"<%/IF%>><%
							%><td valign=top style="height:100%"><%
								%><div style="height:100%; overflow:auto; padding:3px;"><%
									%><table border=0 cellpadding=0 cellspacing=1 width=100%<%=height ? ' height=100%' : '' %>><%
										%><%DEEPER: target = newTarget, fieldset = fieldfieldset, prefix = "tomap_"+name+"___", value = value, name = name, lookup = lookup, Current = Current, attributes = attributes, mapPath = name + "/" + mapPath, fieldsetFlag = true %><%
									%></table><%
								%></div><%
							%></td><%
						%></tr><%
					%><%/ELSE%><%
					%><%/IF%><%
		
				%><%MATCH%><%
					%><%IF:!styleSheets.contains('zakladka.css')%>
						<style>
							<%INCLUDE: 'zakladki.css' %>
						</style>
						<%EXEC:styleSheets.add('zakladka.css')%>
					<%/IF%>
		
					<%IF:!scripts.contains('zakladki.splitters.js')%>
						<script>
							<%INCLUDE: 'zakladki.splitters.js' %>
						</script>
						<%EXEC:scripts.add('zakladki.splitters.js')%>
					<%/IF%>
		
					<%IF:!scripts.contains('formFields.list-map.js')%>
						<script>
							<%INCLUDE: 'ListFieldFrame.js' %>
						</script>
						<%EXEC:scripts.add('formFields.list-map.js')%>
					<%/IF%><%
		
					%><tr id="fld<%=prefix%>__<%=name%>"<%IF: !attributes.constant%> constant=1<%/IF%>><%
						%><td colspan=2 style="height:<%=singleField || oneBigField ? '100%' : '200px' %>; padding:5px 0 5px 0"><%
							%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="fld<%=prefix%>__<%=name%>_obj"<%IF: !attributes.constant%> activate="key=<%=Request.id%>&fieldName=<%=mapPath + name%>" valueObject="list_fld<%=prefix%>__<%=name%>"<%/IF%>><%
								%><tr><%
									%><td><%
										%><table border=0 cellpadding=0 cellspacing=0 class=zakladka width=100%><%
											%><tr><%
												%><TD><script>document.write(tabSplitter3)</script></TD><%
												%><td class=TabOn id="holder" nowrap onclick="mForm.switchWholeWindowMode('fld<%=prefix%>__<%=name%>')"><%
													%><div><%
														%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
															%><tr><%
																%><td nowrap><%=title%></td><%
																%><td align=right style="font-family:Webdings; padding:0 10px 0 10px">5</td><%
															%></tr><%
														%></table><%
													%></div><%
												%></td><%
												%><TD><script>document.write(tabSplitter4)</script></TD><%
												%><td style="width:100%"></td><%
											%></tr><%
											%><tr class=border><%
												%><td class=TabOffl><img width=0 height=0></td><%
												%><td><img width=0 height=0></td><%
												%><td class=TabOffr><img width=0 height=0></td><%
												%><td class=TabOn><img width=0 height=0></td><%
											%></tr><%
										%></table><%
									%></td><%
								%></tr><%
								%><tr><%
									%><td height=100%><%
										%><table border=0 cellpadding=0 cellspacing=0 width=100% style="border-left: 1px solid buttonhighlight; border-right: 1px solid buttonshadow; border-bottom: 1px solid buttonshadow; padding:5px; height:100%"><%
											%><tr><%
												%><td valign=top><%
													%><div class=FrameBorder style="height:100%"><%
														%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="list_fld<%=prefix%>__<%=name%>" path="<%=path%>"><%
															%><tr><%
																%><td class=FrameBorder2><%
																	%><table border=0 cellpadding=0 cellspacing=0 style="width:100%"><%
																		%><tr><%
																			%><td style="padding:2px" cla2ss=FrameBorder2 width=100%><%
																				%><table border=0 cellpadding=0 cellspacing=0 style="width:100%"><%
																					%><tr><%
																						%><td width=100% class=SubmenuFrame nowrap id=TDPaging></td><%
																					%></tr><%
																				%></table><%
																			%></td><%
																			%><%EXEC: container = !attributes.constant && attributes.content_handler
																										? attributes.content_handler.call( target, value )
																										: null %><%
																			%><%IF: !attributes.constant%><%
																				%><td class=menuTollbar formID="<%=Request.id%>" fieldName="<%=mapPath + name%>"><%
																					%><span commandType="form" id="FieldCommands" group="FieldCommands"><%
																					%><%IF: container%><%
																						%><%ITERATE: command : container.getCommands() %><%
																							%><button cmd="formcmd_containercmd_<%= name %>___<%= command.getKey() %>"><%
																								%><img src="icons/<%= ControlAPI.getIcon(command) %>.16.gif" title="<%= Format.xmlAttributeFragment( command.getTitle() ) %>" width=16 height=16><%
																							%></button><%
																						%><%/ITERATE%><%
																					%><%ELSE%><%
																						%><button myCmd="dialog" path="formDialog.mapadd?id=<%=Request.id%>&data=<%=mapPath + name%>"><%
																							%><img src="icons/command-add.16.gif" title="<%= intl( en = "Add", ru = "Добавить" ) %>" width=16 height=16><%
																						%></button><%
																					%><%/ELSE%><%
																					%><%/IF%><%
																					%></span><%
																				%></td><%
																			%><%/IF%><%
																			%><td style="padding:1px"><%
																				%><button class=icon onclick="refreshSetList('list_fld<%=prefix%>__<%=name%>')"><%
																					%><img src="icons/command-reload.16.gif" width=16 height=16 title="<%=intl(en="Refresh", ru="Обновить")%>"><%
																				%></button><%
																			%></td><%
																		%></tr><%
																	%></table><%
																%></td><%
															%></tr><%
															%><tr><%
																%><td height=100%><%
																	%><iframe name="list_fld<%=prefix%>__<%=name%>Frm" src="formFields.map.list?id=<%=Request.id%>&data=<%=mapPath + name%>" frameborder=0 style="width:100%; height:100%"></iframe><%
																%></td><%
															%></tr><%
														%></table><%
													%></div><%
												%></td><%
											%></tr><%
										%></table><%
									%></td><%
								%></tr><%
							%></table><%
						%></td><%
					%></tr><%
			%><%/CHOOSE%><%
		
		
		%><%MATCH: 'text' %><%
			%><%IF:!styleSheets.contains('zakladka.css')%>
				<style>
					<%INCLUDE: 'zakladki.css' %>
				</style>
				<%EXEC:styleSheets.add('zakladka.css')%>
			<%/IF%>
		
			<%IF:!scripts.contains('zakladki.splitters.js')%>
				<script>
					<%INCLUDE: 'zakladki.splitters.js' %>
				</script>
				<%EXEC:scripts.add('zakladki.splitters.js')%>
			<%/IF%>
		
			<%IF:!scripts.contains('Cookies.js')%>
				<script>
					<%INCLUDE: 'Cookies.js' %>
				</script>
				<%EXEC:scripts.add('Cookies.js')%>
			<%/IF%><%
		
			%><%IF: !attributes.constant %><%
				%><%IF: !styleSheets.contains('editor_style.css') %><%
					%><style><%
						%><%INCLUDE: 'editor_style.css' %><%
					%></style><%
					%><%EXEC: styleSheets.add('editor_style.css') %><%
				%><%/IF%><%
		
				%><%IF: !fieldTypeList.contains('text') %><%
					%><%EXEC: fieldTypeList.add('text') %><%
					%><%INCLUDE: 'formFields.text.js' %><%
				%><%/IF%><%
			%><%/IF%><%
		
		
			%><tr id="fld<%=prefix%>__<%=name%>"><%
				%><td colspan=2 style="height:<%=singleField || oneBigField ? '100%' : '200px' %>; padding:5px 0 5px 0"><%
					%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="fld<%=prefix%>__<%=name%>_obj"><%
						%><tr><%
							%><td><%
								%><table border=0 cellpadding=0 cellspacing=0 class=zakladka width=100%><%
									%><tr><%
										%><TD><script>document.write(tabSplitter3)</script></TD><%
										%><td class=TabOn id="holder" nowrap onclick="mForm.switchWholeWindowMode('fld<%=prefix%>__<%=name%>')"><%
											%><div><%
												%><table border=0 cellpadding=0 cellspacing=0><%
													%><tr><%
														%><td class=title nowrap><%
															%><%=title%>&nbsp;<%
															%><span style="font-family: Webdings; line-height:5px; font-size:11px">5</span><%
														%></td><%
													%></tr><%
												%></table><%
											%></div><%
										%></td><%
										%><TD><script>document.write(tabSplitter4)</script></TD><%
										%><td style="width:100%" valign=bottom><%
											%><%IF: attributes.variant == 'html' && !attributes.constant%><%
												%><div class=submenu><%
													%><span onclick="getHtmlText('<%=prefix%>__<%=name%>')">Edit</span><img align=absmiddle><%
												%></div><%
											%><%/IF%><%
										%></td><%
									%></tr><%
									%><tr class=border><%
										%><td class=TabOffl><img width=0 height=0></td><%
										%><td><img width=0 height=0></td><%
										%><td class=TabOffr><img width=0 height=0></td><%
										%><td class=TabOn><img width=0 height=0></td><%
									%></tr><%
								%></table><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td height=100%><%
								%><table border=0 cellpadding=0 cellspacing=0 width=100% style="border-left: 1px solid buttonhighlight; border-right: 1px solid buttonshadow; border-bottom: 1px solid buttonshadow; padding:5px; height:100%"><%
									%><%CHOOSE:attributes.variant%><%
										%><%MATCH:'html'%><%
											%><tr><%
												%><td valign=top><%
													%><iframe src="__blank" name="<%=prefix%>__<%=name%>preview" id="<%=prefix%>__<%=name%>preview" style="width:100%; height:100%;" marginWidth=2 marginHeight=2></iframe>
												%></td><%
												%><input type=hidden name="<%=prefix%>__<%=name%>" value="<%= Format.xmlAttributeFragment(value) %>"><%
												%><%IF: !attributes.constant && !scripts.contains('formFields.html.js') %><%
													%><%INCLUDE: 'formFields.html.js' %><%
													%><%EXEC: scripts.add('formFields.html.js') %><%
												%><%/IF%><%
											%></tr><%
											%><%IF: hint %><%
												%><tr><%
													%><td style="height:0; padding-top:0"><%
														%><%=StringToHtml(hint) %><%
													%></td><%
												%></tr><%
											%><%/IF%><%
					
										%><%MATCH%><%
											%><%IF: !attributes.constant%><%
												%><tr><%
													%><td style="height:0; padding-bottom:0"><%
														%><div class=toolbar id="toolbar<%=prefix%>__<%=name%>"><%
															%><%INCLUDE:'field.text.toolbar' %><%
														%></div><%
													%></td><%
												%></tr><%
											%><%/IF%><%
											%><tr><%
												%><td valign=top<%IF: !attributes.constant%> style="padding-top:0"<%/IF%>><%
													%><textarea<%
														%><%IF: !attributes.constant%><%
															%> name="<%=prefix%>__<%=name%>"<%
															%> onkeydown="return textOnkeydown(this,e);"<%
														%><%ELSE%><%
															%> readonly<%
															%> wrap=off<%
														%><%/ELSE%><%
														%><%/IF%><%
														%> id="editor<%=prefix%>__<%=name%>"<%
														%> style="width:100%; height:100%"<%
														%> <%=attributes.variant=='template' 
															? 'class=input2monospace wrap=off' 
															: 'wrap=soft' %><%
														%> tValue="<%=Format.xmlAttributeFragment(value) %>"<%
													%>><%
													%></textarea><%
												%></td><%
											%></tr><%
											%><%IF: hint%><%
												%><tr><%
													%><td style="height:0; padding-top:0"><%
														%><%=StringToHtml(hint) %><%
													%></td><%
												%></tr><%
											%><%/IF%><%
					
											%><%IF: !attributes.constant%><%
												%><script><%
													%>ToolbarIni(toolbar<%=prefix%>__<%=name%>,document.all.editor<%=prefix%>__<%=name%>);<%
												%></script><%
											%><%/IF%><%
									%><%/CHOOSE%><%
								%></table><%
							%></td><%
						%></tr><%
					%></table><%
			
					
			
				%></td><%
			%></tr><%
		
		
		%><%MATCH: 'binary'%><%
			%><%IF: !fieldTypeList.contains('binary') %><%
				%><%EXEC: fieldTypeList.add('binary') %><%
				%><%INCLUDE: 'formFields.binary.js' %><%
			%><%/IF%><%
		
		
			%><%EXEC: contentType = guessContentTypeFromBinary(value, target[ name + "_contenttype" ] || '') %><%
		
			%><%EXEC: size = binarySize(value) %><%
			%><%EXEC: width = false %><%
			%><%EXEC: height = false %><%
			%><%EXEC: dimensions = false%><%
			%><%EXEC: isImage = contentType.startsWith("image/") %><%
		
			%><%IF: isImage && size %><%
				%><%EXEC: dimensions = Imaging.getImageDimensions( value ) %><%
			%><%/IF%><%
			%><%IF: dimensions %><%
				%><%EXEC: width = dimensions.width %><%
				%><%EXEC: height = dimensions.height %><%
			%><%ELSE%><%
				%><%EXEC: isImage = false %><%
			%><%/ELSE%><%
			%><%/IF%><%
			
			%><tr id="fld<%=prefix%>__<%=name%>"><%
				%><td colspan=2 valign=top><%
					%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
						%><tr><%
							%><td valign=top height=100% style="width:200px"><%
								%><fieldset style="width:100%; height:100%; padding:0 10px 0 10px"><%
									%><legend>&nbsp;<%=title%>&nbsp;</legend><%
									%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
										%><tr><%
											%><td align=right nowrap><%=intl(en="content type", ru="тип содержания") %>:</td><%
											%><td nowrap info=contenttype><%IF: size%><%=contentType%><%/IF%></td><%
										%></tr><%
										%><tr><%
											%><td align=right nowrap><%=intl(en="size", ru="размер") %>:</td><%
											%><td nowrap info=size><%IF: size%><%=formatByteSize(size) %><%/IF%></td><%
										%></tr><%
										%><tr<%IF: !dimensions%> style="display:none"<%/IF%>><%
											%><td align=right nowrap><%=intl(en="width", ru="ширина") %>:</td><%
											%><td nowrap info=width><%IF: dimensions%><%=width%> px<%/IF%></td><%
										%></tr><%
										%><tr<%IF: !dimensions%> style="display:none"<%/IF%>><%
											%><td align=right nowrap><%=intl(en="height", ru="высота") %>:</td><%
											%><td nowrap info=height><%IF: dimensions%><%=height%> px<%/IF%></td><%
										%></tr><%
									%></table><%
		
									%><div style="margin:4px 0 4px 0"><%
										%><%IF: !attributes.constant%><%
											%><button style="width:100%" onclick="setImage('fld<%=prefix%>__<%=name%>','<%=mapPath + name%>')"><%=intl(en="Upload", ru="Загрузить") %></button><br><nobr><button style="width:50%" info=remove onclick="removeImage('fld<%=prefix%>__<%=name%>','<%=name%>')"<%IF: !size%> disabled<%/IF%>><%=intl(en="Remove", ru="Удалить") %></button><button style="width:50%" info=download onclick="document.location='show.field?type=form&id=<%=Request.id%>&fieldname=<%=mapPath + Current.getKey() %>'"<%IF: !size%> disabled<%/IF%>><%=intl(en="Download", ru="Скачать") %></button></nobr><%
										%><%ELSE%><%
											%><button style="width:100%" info=download onclick="document.location='show.field?type=form&id=<%=Request.id%>&fieldname=<%=mapPath + Current.getKey() %>'"<%IF: !size%> disabled<%/IF%>><%=intl(en="Download", ru="Скачать") %></button><%
										%><%/ELSE%><%
										%><%/IF%><%
									%></div><%
								%></fieldset><%
							%></td><%
							%><td valign=top style="padding:5px 0 0 2px" height=100% wi2dth=100%><%
								%><fieldset style="width:100%; height:100%"><%
									%><table border=0 cellpadding=0 cellsapcing=0 width=100% height=100%><%
										%><tr><%
											%><td height=100% info=img><%
												%><%IF: size%><%
													%><%IF: dimensions%><%
														%><%EXEC: k = 1 %><%
														%><%EXEC: max = width > height ? width : height%><%
														%><%EXEC: max > 200 && (k = Math.ceil(max/200.0)) %><%
														%><a href="show.field?type=form&id=<%=Request.id%>&fieldname=<%=mapPath + Current.getKey() %>"><img class=FrameBorder width="<%=width/k %>" height="<%=height/k %>" src="show.field?type=form&id=<%=Request.id%>&fieldname=<%=mapPath + Current.getKey() %>&gwidth=<%=width/k %>&gheight=<%=height/k %>" border=0></a><%
													%><%ELSE%><%
														%><a href="show.field?type=form&id=<%=Request.id%>&fieldname=<%=mapPath + Current.getKey() %>"><img width="32" height="32" src="icons/command-save.32.gif" border=0></a><%
													%><%/ELSE%><%
													%><%/IF%><%
												%><%/IF%><%
											%></td><%
											%><%IF: hint %><%
												%><td style="padding:5px"><%=StringToHtml(hint) %></td><%
											%><%/IF%><%
										%></tr><%
									%></table><%
								%></fieldset><%
							%></td><%
						%></tr><%
					%></table><%
					%><input info=commandRemove type=hidden name="fieldcmd_fieldRemove_<%=name%>"><%
				%></td><%
			%></tr><%
		
		
		%><%MATCH:'drawing' %><%
			%><%IF:!styleSheets.contains('zakladka.css')%>
				<style>
					<%INCLUDE: 'zakladki.css' %>
				</style>
				<%EXEC:styleSheets.add('zakladka.css')%>
			<%/IF%>
		
			<%IF:!scripts.contains('zakladki.splitters.js')%>
				<script>
					<%INCLUDE: 'zakladki.splitters.js' %>
				</script>
				<%EXEC:scripts.add('zakladki.splitters.js')%>
			<%/IF%><%
		
			%><tr i2d="fld<%=prefix%>__<%=name%>"<%IF: !attributes.constant%> constant=1<%/IF%>><%
				%><td colspan=2 style="height:<%=singleField || oneBigField ? '100%' : '250px' %>; padding:5px 0 5px 0"><%
					%><table border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="fld<%=prefix%>__<%=name%>_obj"><%
						%><tr><%
							%><td><%
								%><table border=0 cellpadding=0 cellspacing=0 class=zakladka width=100%><%
									%><tr><%
										%><td><script>document.write(app.Zakladki.tabSplitter3)</script></td><%
										%><td class=TabOn id="holder" nowrap onclick="mForm.switchWholeWindowMode('fld<%=prefix%>__<%=name%>')"><%
											%><div><%
												%><table border=0 cellpadding=0 cellspacing=0 width=100%><%
													%><tr><%
														%><td nowrap><%=title%></td><%
														%><td align=right style="font-family:Webdings; padding:0 10px 0 10px">5</td><%
													%></tr><%
												%></table><%
											%></div><%
										%></td><%
										%><td><script>document.write(app.Zakladki.tabSplitter4)</script></td><%
										%><td style="width:100%"></td><%
									%></tr><%
									%><tr class=border><%
										%><td class=TabOffl><img width=0 height=0></td><%
										%><td><img width=0 height=0></td><%
										%><td class=TabOffr><img width=0 height=0></td><%
										%><td class=TabOn><img width=0 height=0></td><%
									%></tr><%
								%></table><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td height=100%><%
								%><table border=0 cellpadding=0 cellspacing=0 width=100% style="border-left: 1px solid buttonhighlight; border-right: 1px solid buttonshadow; border-bottom: 1px solid buttonshadow; padding:5px; height:100%"><%
									%><tr><%
										%><td valign=top><%
											%><img id="fld<%=prefix%>__<%=name%>" class=drawingImage source="show.field?type=form&<%=Request.getParameterString() %>&fieldname=<%=Current.getKey() %>" alt="<%=Current.getTitle() %>" style="width:100%; height:100%"><%
										%></td><%
									%></tr><%
								%></table><%
							%></td><%
						%></tr><%
					%></table><%
				%></td><%
			%></tr><%
		
		
		%><%MATCH:'block','transparent' %><%
			// draw nothing for this type of field
		
		%><%MATCH%><%
			%><tr><%
				%><td style="border:solid 1px buttonhighlight; padding:5px;" colspan=2><%
					%> <b><font style="color:buttonhighlight"><%
						%>[<%= attributes.type %> / <%= attributes.variant %>]<%
					%></font></b> <%
					%><%= title %> : <%= value %><%
				%></td><%
			%></tr><%
		
		%><%/CHOOSE%><%
	%><%/CALL%><%
	
%><%/RECURSION%>

