<script>
<%INCLUDE: 'ListFieldFrame.js' %>
</script>

<%EXEC: path = Request.path || '/' %>
<%EXEC: path.endsWith('/') || (path += '/') %>

<TABLE border=0 cellpadding=0 cellspacing=0 width=100% height=100% id="childrenList" path="<%=StringToUrl(path)%>">
<TR>
	<TD class=FrameBorder2>

		<TABLE border=0 cellpadding=0 cellspacing=0 style="width:100%">
		<TR>
			<TD style="padding:2" cla2ss=FrameBorder2 width=100%>
				<TABLE border=0 cellpadding=0 cellspacing=0 style="width:100%">
				<TR>
					<TD width=100% class=SubmenuFrame nowrap id=TDPaging>&nbsp;</TD>
					<%IF:!mode%>
						<TD class=SubmenuFrame nowrap id=TDPath style="padding-top:0; padding-bottom:0"><table border=0 cellpadding=0 cellspacing=0><tr><td><b><%=intl(en="path", ru="путь")%>:</b>&nbsp;</td><td><input style="width:150" re2adonly value="<%=path%>"></td></tr></table></TD>


						<%IGNORE%>
						<TD width=150 class=SubmenuFrame nowrap id=TDPath><nobr><b><%=intl(en="path", ru="путь")%>:</b> <a href="#" onclick="Windows.open('defaultAction?path=<%=path%>','','','height=400,width=700');return false;"><%=path%></a></nobr></div></TD>
						<%/IGNORE%>
					<%/IF%>
					<!--
					<TD class=SubmenuFrame style="padding:1px"><input type="text" style="padding:1; margin-top:-1; margin-bottom:-1; width:18;"></TD>
					-->
				</TR>
				</TABLE>
			</TD>
			
			<TD style="padding:1px">
			<%IF:path != '/'%>
				<%EXEC:goToPath = substr(path,0,lastIndexOf(path,'/'))%>
				<%EXEC:goToPath = substr(goToPath,0,lastIndexOf(goToPath,'/')+1)%>
				<button class=icon onclick="changeLocationSetList('<%=goToPath%>','childrenList');"><img src="icons/command-escape.16.gif" width=16 height=16 title="<%=intl(en="Up", ru="Вверх")%>"></button>
			<%/IF%>			
			<button class=icon onclick="refreshSetList('childrenList');"><img src="icons/command-reload.16.gif" width=16 height=16 title="<%=intl(en="Refresh", ru="Обновить")%>"></button></TD>

		</TR>
		</TABLE>

	</TD>
</TR>

<TR>
	<TD height=100%>
		<iframe name="childrenListFrm" src="ObjectChidrenView.list?path=<%=StringToUrl(path)%><%=mode=='link' ? '&mode=link' : ''%>" style="width:100%; height:100%" frameborder=0></iframe>
	</TD>
</TR>
</TABLE>