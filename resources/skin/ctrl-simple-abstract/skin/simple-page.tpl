<%
%><%EXEC: requireCss = content.requireCss || [] %><%
%><%EXEC: requireCss.add('/!/skin/ctrl-simple/client/css/style') %><%
%><%EXEC: requireCss.add('lib/menu') %><%

%><%EXEC: requireJs = content.requireJs || [] %><%
%><%EXEC: requireJs.add("debug") %><%
%><%EXEC: requireJs.add('require') %><%
%><%EXEC: requireJs.add('lib/menu') %><%

%><%OUTPUT: head %><%
	%><script><%
		%>menuItems = [];<%
	%></script><%
%><%/OUTPUT%><%
%><%OUTPUT: body %><%
	%><body bgcolor=white text=black><%
		%><table id=ht class=ht width=100% border=0><%
		%><tr><%
			%><td width=64 align=center valign=top class=tt><%
				%><img src="/!/skin/ctrl-simple/icons/<%= content.contentIcon %>.32.gif" width=32 height=32><%
			%></td><%
			%><td class=cclass><%
				%><i><%= content.contentTitle %><br><%
				%></i><%
				%><%IF: content.contentInfo %><%
					%><span class=cinfo><%
						%><%= content.contentInfo %><%
					%></span><%
				%><%/IF%><%
			%></td><%
			%><td class=ti align=right><%
				%><span id="content-menu"><%= content.contentMenu || '' %></span><%
				%><span id="menu-span"></span><%
			%></td><%
		%></tr><%
		%></table><%
		%><div id=hp></div><%
		%><script><%
			%>false && setTimeout(function(){<% // menu is not working with 'fixed', such a pity!
				%>var hp=document.getElementById("hp");<%
				%>var ht=document.getElementById("ht");<%
				%>ht.style.position='fixed';<%
				%>hp.style.height=ht.clientHeight+'px';<%
			%>},500);<%
		%></script><%
		
		%><%= content.body %><%
		
		%><br><%
		%><hr><%
		
		%><script><%
			%>if(menuItems.length){<%
				%>Menu.makeButtons(document.getElementById("menu-span"), { title : "focus menu", submenu : menuItems });<%
			%>}<%
		%></script><%
		
		%><table width=100% border=0><%
		%><tr><%
			%><td width=33% class=ti valign=top align=left><%
				%><form method=get action=redirect.htm><%
					%><%RECURSION: language = Runtime && Runtime.getLanguage(), languages = null, languageName = null %><% 
						%><%IF: language %><%
							%><table border=0 cellpadding=0 cellspacing=0><%
							%><tr><%
								%><td><%
									%><img src="/!/skin/ctrl-simple/$files/localization.gif" width=16 height=16 hspace=5><%
								%></td><%
								%><td><%
									%><select name="language" onchange="submit(); return false;"><%
										%><%EXEC: languageName = Runtime.getLanguage() %><%
										%><%EXEC: languages = Runtime.getLanguages() %><%
										%><%ITERATE: language : languages %><%
											%><option <%
											%><%IF: languageName == language.name %><%
												%>selected="selected" <%
											%><%/IF%><%
												%>value="<%= language.name %>"><%
													%><%= language.nativeName %> (<%= language.commonName %>) <%
											%></option><%
										%><%/ITERATE%><%
									%></select><%
									%><noscript><%
										%>&nbsp;<%
										%><input type=submit value=ok><%
									%></noscript><%
									%></td><%
							%></tr><%
							%></table><%
						%><%/IF%><%
					%><%/RECURSION%><%
				%></form><%
			%></td><%
			%><td width=34% class=ti valign=bottom align=center><%
				%>&copy; 2001-2018<!--, <a href=policy.htm>Service policy</a>--><%
			%></td><%
			%><td width=33% class=ti valign=top align=right><%
				%><span id="content-menu-clone"></span><%
			%></td><%
			%><script><%
				%>document.getElementById("content-menu-clone").appendChild(<%
					%>document.getElementById("content-menu").cloneNode(true)<%
				%>);<%
			%></script><%
		%></tr><%
		%></table><%
	
	%></body><%
%><%/OUTPUT%><%
%><%RETURN: {
		title		: content.contentVariant + ' :: ' + content.contentTitle,
		template	: "html-page",
		requireCss	: requireCss,
		requireJs	: requireJs,
		head		: head,
		body		: body
	} %><%
%>