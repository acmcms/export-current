<%
	//
	// beresite document
	//	
	//
	
%><%FORMAT: 'html' %><%

%><%EXEC: requireCss = ['/$build/style0' + (1 + (true
	? (context.query.attributes.skinner.name.hashCode() & 0x7FFFFFFF) % 5
	: Math.floor(Math.random() * 5)
))] %><%

%><%OUTPUT: head %><%
	%><%ITERATE: meta : Array( context.query.attributes.skinner.skinSettings.meta ) %><%
		%><meta <%
			%>name="<%= Format.xmlAttributeFragment(meta.name) %>" <%
			%>content="<%= Format.xmlAttributeFragment(meta.content) %>" <%
		%>/><%
		%><!-- settings --><%
	%><%/ITERATE%><%
	%><%ITERATE: meta : Array( content.meta ) %><%
		%><meta <%
			%>name="<%= Format.xmlAttributeFragment(meta.name) %>" <%
			%>content="<%= Format.xmlAttributeFragment(meta.content) %>" <%
		%>/><%
		%><!-- content --><%
	%><%/ITERATE%><%
%><%/OUTPUT%><%

%><%OUTPUT: body %><%
	%><!-- <%= context.query.attributes.skinner.name %> --><%
	%><%IF: content.header %><%
		%><header><%
			%><%= content.header %><%
			%><hr /><%
		%></header><%
	%><%/IF%><%
	%><table width="100%" cellpadding="5" cellspacing="0" border="0"><%
		%><tr><%
			%><td width="75%" height="*"><%
				%><article class="document_body"><%
					%><h1><%= content.title %></h1><%
					= content.body;
				%></article><%
				%><div class="gradusnik" align="right"><%
					%><%CODE: 'ACM.ECMA' %>
						var selected = [];
						for keys( var current in content.selected ){
							selected.push( content.selected[current] );
						}
						for( var CurrentIndex = selected.length - 1; CurrentIndex >= 0; CurrentIndex -- ){
							var current = selected[ CurrentIndex ];
							%><span><%
								%>&nbsp;&raquo; <%
								%><a href="<%
									= Format.xmlAttributeFragment(
										current.name == 'index.htm'
											? context.query.urlBase + '/'
											: current.name
									); 
								%>"><%
									// key = afterPoint( current.title );
									var key = current.title;
									(key != content.bodyTitle && key != content.title) && (pageTitle += " :: " + key);
									= Format.xmlNodeValue( key );
								%></a><%
							%></span><%
						}
						%><span><%
							%>&nbsp;&raquo; <%
							%><a href="<%
								= Format.xmlAttributeFragment( context.query.urlBase + '/' ); 
							%>"><%
								= intl(
									en = "Home page",
									ru = "Начало сайта"
								);
							%></a><%
						%></span><%
						// end of ecma code
					<%/CODE%><%
					%><%IGNORE%><%
						%>&nbsp;&raquo; <%
						%><a href="<%= context.query.urlBase %>/" style="vertical-align: bottom;"><%
							%><img src="/!/public/resources/data/images/famfamfam.com/silk/house.png" style="height: 1em; width: 1em;vertical-align: bottom;"><%
						%></a><%
					%><%/IGNORE%><%
					%><%IGNORE%><%
						= {
							layout	: 'gradusnik',
							$layout	: 'graduskin',
							value	: 'noone knows'
						};
					%><%/IGNORE%><%
				%></div><%
				%><br />&nbsp;<br /><%
			%></td><%
			%><td width="25%" class="navi_td"><%
				%><nav class="navi_menu"><%
					%><%RECURSION: navi = content.navigation, naviItem = null, naviKey = null, depth = 1 %><%
						%><ul><%
						%><%ITERATE: naviItem : navi %><%
							%><%EXEC: naviItem = navi[naviItem] %><%
							%><li><%
								%><a<%
									%> class="<%= content.name == naviItem.name ? "current" : "inactive" %>"<%
									%><%IF: content.name != naviItem.name %><%
										%> href="<%
											= Format.xmlAttributeFragment(
												naviItem.name == 'index.htm'
													? context.query.urlBase + '/'
													: naviItem.name
											); 
										%>"<%
									%><%/IF%>><%
									= naviItem.title
								%></a><%
								%><%IF: naviItem.deeper && (depth < 2 || content.selected[naviItem.name]) %><%
									%><%DEEPER: navi = naviItem.deeper, depth = depth + 1 %><%
								%><%/IF%><%
							%></li><%
						%><%/ITERATE%><%
						%></ul><%
					%><%/RECURSION%><%
				%></nav><%
				%><!-- <%
				%>navi: <%= Format.jsObjectReadable(content.navigation) %><br /><%
				%>menu: <%= Format.jsObjectReadable(content.menu) %><br /><%
				%> --><%
				%><br />&nbsp;<br /><%
			%></td><%
		%></tr><%
	%></table><%
	%><%IF: content.footer %><%
		%><footer><%
			%><hr /><%
			%><%= content.footer %><%
		%></footer><%
	%><%/IF%><%
%><%/OUTPUT%><%
%><%/FORMAT%><%

%><%RETURN: Layouts.extend(content, {
	template	: 'html-document',
	defaultTitle: content.title + ' &#160; @ \u00A0 ' + context.query.attributes.skinner.title,
	title		: null,
	head		: head,
	requireCss	: requireCss,
	body		: body
}) %>