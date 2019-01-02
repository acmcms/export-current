<%
	//
	// main handler:
	//	
	//
	
%><%FORMAT: 'html' %><%

	%><%CODE: 'ACM.ECMA' %>
		Storage || (Storage = {
			getByGuid : function(key){
				throw "GUID: " + Format.jsObjectReadable(key);
			}
		});
	<%/CODE%><%

	%><%IGNORE%><%

	%><%OUTPUT: menu %><%
		%><noindex><%
		%><table class=contentright width=<%= contentMenuWidth %> cellpadding="0" cellspacing="0" border="<%= border %>"><%
		%><tr><%
			%><td class=menu width=<%= contentMenuWidth %> valign=top align=left><%
				%><%RECURSION: selection = content.selection, limit = 5, depth = 0 %><%
					%><%ITERATE: Current : selection && selection.list %><%
						%><%EXEC: location = Current.getLocation() %><%
						%><%EXEC: active = selected.contains( Current.getGuid() ) || Current.getKey() == "catalogue" %><%
						%><%EXEC: deeper = (active && limit) && (Object.isFilled( selection.deeper ) || Current.getKey() == "catalogue") %><%

						%><%IF: !depth && active && selected.contains( Current.getGuid() ) %><%
							%><%EXEC: Object.isFilled( selection.deeper ) || (active = false) %><%
						%><%/IF%><%

						%><%IF: depth || active %><%

							%><div height="1" class=menub><%
								%><img src=/__i/1.gif width="1" height="1" alt=""><%
							%></div><%

							%><%EXEC: (depth && depth < selected.size() - 2) && (active = false) %><%
							%><%EXEC: highlite = active ? "menua" : "menui" %><%

							%><div class=<%= highlite %> onclick="document.location.href='<%= location %>'; return false;"><%
								%><table width=100% cellpadding=0 cellspacing=0 border=0><%
								%><tr><%
									%><td width=8><%
										%><img src="/$files/sidemenuarrow.gif" width=4 height=7 border=0><%
									%></td><%
									%><td><%
										%><a href="<%= location %>"><%
										%><%= afterPoint( Current.getTitle() ) %><%
										%></a><%
									%></td><%
								%></tr><%
								%></table><%
							%></div><%
							%><%IF: active && selection.deeper && selection.deeper.calendar %><%
								%><div class="archive menud"><%
									%><%EXEC: calendar = Current.searchLocalCalendar(false, -1, -1, null) %><%
									%><%IF: calendar && calendar.size && calendar.size() %><%
										%><%IF: content.calendar %><%
											%><%EXEC: archiveYear = Calendar.getYear( content.calendar ) %><%
											%><%EXEC: archiveMonth = Calendar.getMonth( content.calendar ) %><%
											%><%EXEC: archiveDay = Calendar.getDayOfMonth( content.calendar ) %><%
											%><%EXEC: startMonth = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = 1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
											%><%EXEC: endMonth = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth+1, DAY_OF_MONTH = 1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
											%><%EXEC: start = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = archiveDay, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
											%><%EXEC: end = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = archiveDay+1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
										%><%ELSE%><%
											%><%EXEC: archive = request.resourceIdentifier %><%
											%><%IF: archive %><%
												%><%IF: (pos = archive.indexOf('-')) == -1 %><%
													%><%EXEC: archiveYear = Int( archive.substring( 0, 4 ) ) %><%
													%><%EXEC: archiveMonth = Int( archive.substring( 4 ) ) %><%
													%><%EXEC: startMonth = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = 1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
													%><%EXEC: endMonth = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth+1, DAY_OF_MONTH = 1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
													%><%EXEC: start = startMonth %><%
													%><%EXEC: end = endMonth %><%
												%><%ELSE%><%
													%><%EXEC: archiveYear = Int( archive.substring( 0, 4 ) ) %><%
													%><%EXEC: archiveMonth = Int( archive.substring( 4, pos ) ) %><%
													%><%EXEC: archiveDay = Int( archive.substring( pos + 1 ) ) %><%
													%><%EXEC: startMonth = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = 1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
													%><%EXEC: endMonth = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth+1, DAY_OF_MONTH = 1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
													%><%EXEC: start = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = archiveDay, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
													%><%EXEC: end = Calendar.build( YEAR = archiveYear, MONTH = archiveMonth, DAY_OF_MONTH = archiveDay+1, HOUR_OF_DAY = 0, MINUTE = 0, SECOND = 0 ) %><%
												%><%/ELSE%><%
												%><%/IF%><%
												%><%IF: content.list %><%
													%><%EXEC: content.list = Current.searchLocal(0, false, "history", start, end, null ) %><%
												%><%/IF%><%
											%><%/IF%><%
										%><%/ELSE%><%
										%><%/IF%><%
										%><table align=center cellpadding=1 cellspacing=0><%
										%><%EXEC: months = Calendar.ARRAY_MONTHNAMES3 %><% 
										%><%EXEC: location = Current.getLocation() %><%
										%><td><%
											%><img src=/__i/1.gif alt="" width=1 height=5><%
										%></td><%
										%><%ITERATE: current : Sort.array( calendar.entrySet(), Sort.MAP_KEY_NUMERIC_DESC ) %><%
											%><%EXEC: activeMonth = false %><%
											%><tr><%
												%><td colspan=6 align=center class=archiveyear><%
													%><%= yearNumber = current.key %><%
													%><%EXEC: year = current.value %><%
												%></td><%
											%></tr><%
											%><tr><%
												%><%CALL: ForArray(months) %><%
													%><%EXEC: infomap = year[ CurrentIndex ] %><%
													%><%EXEC: count = 0 %><%
													%><%IF: infomap %><%
														%><%EXEC: count = infomap.created %><%
													%><%/IF%><%
													%><%IF: (archiveYear == yearNumber) && (archiveMonth == CurrentIndex) %><%
														%><%EXEC: activeMonth = infomap %><%
														%><td class=archivemonthselection><%
															%>&nbsp;<%
															%><%IF: count %><%
																%><a href="<%= location + yearNumber + CurrentIndex %>"><%= Current %></a><%
															%><%ELSE%><%
																%><%= Current %><%
															%><%/ELSE%><%
															%><%/IF%><%
															%>&nbsp;<%
														%></td><%
													%><%ELSE%><%
														%><td class=archivemonth><%
															%>&nbsp;<%
															%><%IF: count %><%
																%><a href="<%= location + yearNumber + CurrentIndex %>"><%= Current %></a><%
															%><%ELSE%><%
																%><%= Current %><%
															%><%/ELSE%><%
															%><%/IF%><%
															%>&nbsp;<%
														%></td><%
													%><%/ELSE%><%
													%><%/IF%><%
													%><%IF: CurrentIndex % 6 == 5 %><%
														%></tr><%
														%><tr><%
													%><%/IF%><% 
												%><%/CALL%><%
											%></tr><%
											%><%IF: activeMonth %><%
												%><%EXEC: dayShift = (Calendar.getDayOfWeek( startMonth ) + 5) % 7 %><%
												%><%EXEC: dayCount = Calendar.getDayOfMonth( endMonth - 1000L ) %><%
												%><%EXEC: archiveDay = archiveDay || -15 %><%
												%><tr><%
												%><td><img src=/__i/1.gif alt="" width=1 height=5></td><%
												%></tr><%
												%><tr><%
												%><td colspan=6 align=center><%
												%><table align=center border=0 cellpadding=1 cellspacing=0><%
													%><tr><%
													%><%ITERATE: current : Calendar.ARRAY_WEEKDAYS2 %><%
														%><td align=center class=archiveweekday><%
														%>&nbsp;<%= current %>&nbsp;<%
														%></td><%
													%><%/ITERATE%><%
													%></tr><%
													%><tr><%
													%><%FOR: currentIndex = -dayShift+1; currentIndex <= dayCount; currentIndex++ %><%
														%><td class=archiveday<%
														%><%IF: archiveDay == currentIndex %><%
															%>selection<%
														%><%/IF%><%
														%>><%
														%><%IF: currentIndex > 0 %><%
															%><%IF: activeMonth["created"+currentIndex] %><%
																%><a href="<%= location+yearNumber+archiveMonth %>-<%= currentIndex %>"><%= currentIndex %></a><%	
															%><%ELSE%><%
																%><%= currentIndex %><%
															%><%/ELSE%><%
														%><%/IF%><%
														%><%/IF%><%
														%></td><%
														%><%IF: (currentIndex+dayShift) % 7 == 0 && currentIndex > 0 && currentIndex < dayCount %><%
															%></tr><%
															%><tr><%
														%><%/IF%><%
													%><%/FOR%><%
													%></tr><%
												%></table><%
												%></td><%
												%></tr><%
											%><%/IF%><%
											%><tr><%
											%><td><img src=/__i/1.gif alt="" width=1 height=5></td><%
											%></tr><%
										%><%/ITERATE%><%
										%></table><%
									%><%/IF%><%
								%></div><%
							%><%/IF%><%

							%><%IF: deeper %><%
								%><div class=menud><%
									%><%IF: selected.contains( Current.getGuid() ) %><%
										%><%DEEPER: selection = selection.deeper, limit = limit - 1, depth = depth + 1 %><%
									%><%ELSE%><%
										%><%EXEC: deeper = {} %><%
										%><%EXEC: deeper.list = catalogue %><%
										%><%DEEPER: selection = deeper, limit = limit - 1, depth = depth + 1 %><%
									%><%/ELSE%><%
									%><%/IF%><%
								%></div><%
							%><%/IF%><%
						%><%/IF%><%
					%><%/ITERATE%><%
				%><%/RECURSION%><%
			%></td><%
		%></tr><%
		%></table><%
		%></noindex><%
	%><%/OUTPUT%><%
	
	%><%/IGNORE%><%
	
	%><%EXEC: pageTitle = content.title %><%
	%><%OUTPUT: gradusnik %><%
		%><%EXEC: selected = content.selected %><%
		%><%IF: Array.isArray( selected ) %><%
			%><%FOR: CurrentIndex = selected.length - 2; CurrentIndex >= 0; CurrentIndex -- %><%
				%><%EXEC: current = selected[ CurrentIndex ] %><%
				%><%EXEC: current = Storage.getByGuid( current ) %><%
				%><%IF: current %><%
					%><a href="<%= current.getLocation() %>"><%
						%><%EXEC: key = afterPoint( current.getTitle() ) %><%
						%><%EXEC: (key != content.bodyTitle && key != content.title) && (pageTitle += " :: " + key) %><%
						%><%= key %><%
					%></a><%
					%><%IF: CurrentIndex %><%
						%>&nbsp;&raquo; <%
					%><%/IF%><%
				%><%/IF%><%
			%><%/FOR%><%
		%><%/IF%><%
	%><%/OUTPUT%><%


%><%/FORMAT%><%
%><%RETURN: Layouts.extend( content, {
		template	: 'beresite-document',
		menu		: menu,
		gradusnik	: gradusnik,
		body		: content.text 
			? Format.xmlTextAsHtml( content.text ) 
			: content.html
				? content.html
				: content.section
					? (function f(element){
						if(element){
							= '<h4><a href="' + Format.xmlAttributeFragment( element.name ) + '">';
							= Format.xmlNodeValue( element.title );
							= '</a></h4>';
							if( element.description ){
								// <h4> element does not need newline
								// = '<br />';
								= Format.xmlNodeValue( element.description );
							}
							= '<br />';
							= '&nbsp;';
							= '<br />';
							return;
						}
						var result, n = Array(content.section);
						$output(result){
							n.forEach(f);
						}
						return result;
					})()
					: intl( en = 'no content.', ru = 'содержания нет.' )
	})
 %>