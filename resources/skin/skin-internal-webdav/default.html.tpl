<%OUTPUT: body %><%FORMAT: 'html' %><%
%><body style="padding:0 10%;color:black;background-color:white;">
		<h1 style="font-size:2.4em;text-decoration:underline;font-style:italic;font-weight:bold">Welcome!</h1>
		<div style="font-size:1.4em">
			<div style="font-weight:bold">This is generic file-tree interface of ACM system.<br>It supports:</div>
			<ul>
				<li><a href="http://webdav.org/">DAV</a> (aka WebDAV, Web Folders, iFolders) as primary file management protocol.
					It requires special settings or software agents\drivers to be installed<b>*</b>, or</li>
				<li>Simple <a href="index.html">web-based HTML interface</a> also. 
					It doesn't require third party software to be installed, works in most browsers and useful when you roam.</p></li>
			</ul>
		</div>
		<p><i>
			&nbsp;<br>
			<b>*</b>
			<div style="padding-left: 1.5em">
			- <a href="http://webdrive.com/products/webdrive/index.html">WebDrive</a>/<a href="http://netdrive.net/">NetDrive</a> - for windows, connects such shares as an ordinary disk drives, <br>
			- <a href="http://www.adobe.com/products/homesite/">Macromedia HomeSite</a> - for windows, web-developer IDE with ability to connect to DAV shares, <br>
			- Windows: Internet Explorer (File/Open, "Open as Web Folder") - allows to browse, delete, cut, copy and paste contents as files, <br>
			- MacOS X: Finder (Go/Connect to Server menu) - allows to mount WebDAV resources to a file system, <br>
			etc...
			</div>
		</i></p>
		<p>See also: <ul>
			<li><a href="http://en.wikipedia.org/wiki/WebDAV">Wikipedia's article on WebDAV</a></li>
			<li><a href="http://www.webdav.org/specs/rfc4918.html">RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning</a></li>
		</ul></p> 
	</body>
</html><%
%><%/FORMAT%><%/OUTPUT%><%RETURN: {
	template : 'html-document',
	title : 'Welcome!',
	body : body
} %>