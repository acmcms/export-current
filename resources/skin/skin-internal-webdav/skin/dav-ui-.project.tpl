<%FINAL: 'text/xml' %><%
	//
	// fake eclipse project file, to be able to mount web-dav folders as eclipse projects.
	//
	//
%><?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name><%= content.folder.getKey() %>@<%= Request.getTarget() %></name>
	<comment><%= Format.xmlNodeValue( "WebDAV at " Request.getUrl() ) %></comment>
	<projects>
	</projects>
	<buildSpec>
	</buildSpec>
	<natures>
	</natures>
</projectDescription><%
%><%/FINAL%>