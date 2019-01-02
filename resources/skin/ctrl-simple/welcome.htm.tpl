<%
%><%EXEC: content = {
	layout			: "simple-page",
	template		: "simple-page",
	contentVariant	: intl(en = "Home", ru = "Начало"),
	contentTitle	: intl(en = "Welcome", ru = "Добро пожаловать"),
	contentIcon		: "welcome",
	contentInfo		: intl(
		en = 'Screen: View, Application: text/html',
		ru = 'Экран: Просмотр, Приложение: text/html')
} %><%

%><%OUTPUT: content.body %><%
	%><table class=ip width=100% border=0 cellpadding=6 cellspacing=0><%
		%><tr class=ao><%
			%><td valign=top class=ti><%
				%><big><%
				%><%= intl(
					en = "Welcome to a 'simple' control interface, a place to manage your ACM site from everywhere in many different ways! This interface is fully functional - any " + Runtime.getSystemName() + " view, form, field and command is fully supported",
					ru = "Добро пожаловать в упрощенный интерфейс управления системой " + Runtime.getSystemName() + ". С помощью этого интерфейса Вы сможете осуществлять любые операции по управлению сайтом где бы Вы не находились.") %>.<%
				%></big><%
				%><p><%
				%><table align=center width=80% class=ti border=0 cellpadding=16><%
				%><tr><%
					%><td valign=top width=50%><%
						%><form action="/!/skin/ctrl-simple-browse/" actionOld="Browse/"><%
							%><span class=tn><%
								%><%= intl(
									en = "Control anything",
									ru = "Управление") %>...<%
							%></span><%
							%><hr><%
							%><%= intl(
								en = "To access control tree of your site. To manage users, publications and anything else",
								ru = "Для доступа к дереву управления сайтом. Для управления пользователями, публикациями и прочим") %>... <%
							%><input class=ti type=submit value="&nbsp;&gt;&nbsp;&gt;&nbsp;&gt;&nbsp;"><%
						%></form><%
					%></td><%
					%><td valign=top width=50%><%
						%><form target=_blank action="http://acmcms.ru"><%
							%><span class=tn><%
								%><%= intl(
									en = "Read more",
									ru = "Узнать больше") %>...<%
							%></span><%
							%><hr><%
							%><%= intl(
								en = "To learn about our services and policy. To know about advanced multitype represantation engine and more",
								ru = "Чтобы узнать обо всех возможностях системы. Получить помощь по использованию системы") %>... <%
							%><input class=ti type=submit value="&nbsp;&gt;&nbsp;&gt;&nbsp;&gt;&nbsp;"><%
						%></form><%
					%></td><%
					%></tr><%
				%></table><%
			%></td><%
		%></tr><%
		%><tr class=ao><%
			%><td colspan=5 valign=top align=center><%
				%><%EXEC: quick = ControlAPI.getQuickActor() %><%
				%><%EXEC: options = quick.getCommands() %><%
				%><%IF: Array.isFilled(options) %><%
					%><p>&nbsp;<%
					%><table align=center width=50% border=0 cellpadding=4 cellspacing=0><%
						%><tr><%
							%><td colspan=3><%
								%><div class=tn><%
									%><%= intl(
										en = "Quick Commands",
										ru = "Быстрые ссылки") 
									%>:<%
								%></div><%
								%><hr><%
							%></td><%
						%></tr><%
						%><%EXEC: optionStyles = ['le', 'l1'] %><%
						%><%EXEC: optionStyleCounter = 0 %><%
			
						%><%ITERATE: option : options %><%
							%><%CONTINUE: UNLESS: option.getKey() %><%
				
							%><%BREAK: IF: optionStyleCounter ++ >= 9 %><%
							
							%><tr class=<%= optionStyles[optionStyleCounter % 2] %>><%
								%><td width=32 valign=top class=tt><%
									%><img src="/!/skin/ctrl-simple/icons/<%= ControlAPI.getIcon(option) %>.32.gif" width=32 height=32><%
								%></td><%
								%><td valign=top class=tt align=left><%
									%><%= option.getTitle() %><br><%
									%><%EXEC: description = option.commandDescription() %><%
									%><%IF: description%><%
										%><span class=ti><%
											%><%= description %><%
										%></span><%
									%><%/IF%><%
								%></td><%
								%><td valign=top class=ti align=right><%
									%>[&nbsp;<a class=ac href="/!/skin/ctrl-simple-form/execute.htm?type=quick&cmd_<%= option.getKey() %>=1&back=<%= encodeURIComponent(Request.getUrl()) %>">&nbsp;&gt;&nbsp;&gt;&nbsp;&gt;&nbsp;</a>&nbsp;]<%
								%></td><%
							%></tr><%
						%><%/ITERATE%><%
					%></table><%
					%>&nbsp;<br><%
				%><%/IF%><%
			%></td><%
		%></tr><%
		%><tr class=ao><%
			%><td valign=top class=ti><%
				%><table align=center width=80% class=ti border=0 cellpadding=16><%
					%><tr><%
						%><td valign=top width=50%><%
							%><form action="<%=Runtime.ENTRANCE%>/_sys/logout?back=<%= encodeURIComponent(Runtime.ENTRANCE) %>" method=post><%
								%><span class=tn><%
									%><%= intl(
										en = "Logout",
										ru = "Выход") %>...<%
								%></span><%
								%><hr><%
								%><%= intl(
									en = "To finish gracefully your current control session. To discard logged-in state",
									ru = "Для корректного завершения текущей сессии управления и сброса статуса авторизации") %>... <%
								%><input class=ti type=submit value="&nbsp;&gt;&nbsp;&gt;&nbsp;&gt;&nbsp;"><%
							%></form><%
						%></td><%
						%><td valign=top width=50%><%
							%><form action="re-login?uid=<%=User.getUserID() %>" method=post><%
								%><span class=tn><%
									%><%= intl(
										en = "Change user",
										ru = "Смена пользователя") %>...<%
								%></span><%
								%><hr><%
								%><%= intl(
									en = "To change current auth information. To log-in using another account",
									ru = "Для смены текущей авторизационной информации. Для входа другим пользователем") %>... <%
								%><input class=ti type=submit value="&nbsp;&gt;&nbsp;&gt;&nbsp;&gt;&nbsp;"><%
							%></form><%
						%></td><%
					%></tr><%
				%></table><%
			%></td><%
		%></tr><%
	%></table><%
%><%/OUTPUT%><%
%><%RETURN: content %><%
%>