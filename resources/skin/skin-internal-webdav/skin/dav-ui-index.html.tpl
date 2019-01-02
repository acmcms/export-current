<%CODE: 'ACM.ECMA' %>

var folder = content.folder;
var path = content.path;
var children = content.children;
var parameters = Request.getParameters();

switch(parameters.cmd){
case 'create-text':
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Create text file',
		body : 'Not yet!'
	});
case 'create-folder':
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Create folder',
		body : 'Not yet!'
	});
case 'delete':{
	var name = parameters.name;
	
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Delete: ' + name,
		body : 'Not yet!'
	});
}
case 'edit-as-text':{
	var name = parameters.name;
	
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Edit: ' + name,
		body : 'Not yet!'
	});
}
case 'preview':{
	var name = parameters.name;
	
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Preview: ' + name,
		body : 'Not yet!'
	});
}
case 'upload':
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Upload',
		body : 'Not yet!'
	});
case 'archive':{
	var ae3 = require('a3');
	var fileName = folder.key + '.zip';
	return ae3.Reply.binary(
			"DAV-UI", 
			query, 
			{
				"Content-Type" : "application/zip",
				"Content-Disposition" : 'attachment; filename=' + fileName,
			},
			require('ae3.util/Codecs').mapToZip(folder), 
			fileName
		)
		.setFinal()
	;
	/**
	return require('ae3.util/Codecs').mapToZip(folder);
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : 'Upload',
		body : 'Not yet!'
	});
	*/
}
default:{
	var insertInHead, body;
	$output( insertInHead ){
		%><style><%
			%>div.a{<%
				%>font-size:1.2em;<%
				%>padding:0.5em;<%
				%>background-color:#FFDFFF;<%
			%>}<%
			%>div.b{<%
				%>font-size:1.2em;<%
				%>padding:0.5em;<%
				%>background-color:#FFFFDF;<%
			%>}<%
			%>div.b div,div.a div{<%
				%>font-size:0.9em;<%
			%>}<%
		%></style><%
	}
	$output( body ){
	
		var folders = 0;
		var files = 0;
		var bodyList;
		
		$output( bodyList ){
			var counter = 0;
			
			for(var current in children){
				if( current.isContainer() ){
					folders ++;
					%><div class="<% = ((counter++) & 1) ? 'a' : 'b' %>"><%
						%><div style="float:right"><%
							%>folder<%
						%></div><%
						%><a href="<% = current.getKey() %>/index.html"><%
							%><b><%
							= current.getKey();
							%></b><%
						%></a><%
					%></div><%
				}
			}
			
			for(var current in children){
				if( !current.isContainer() ){
					files ++;
					%><div class="<% = ((counter++) & 1) ? 'a' : 'b' %>"><%
						%><div style="float:right"><%
							if( current.isBinary() ){
								= formatByteSize( current.toBinary().binaryContentLength );
								%>byte(s)<%
							}else//
							if( current.isPrimitive() ){
								%>(<%
								= Format.xmlNodeValue(Format.jsObject(current.toPrimitive().primitiveValue));
								%>)<%
							}
						%></div><%
						%><a href="index.html?cmd=preview&name=<% = current.getKey() %>"><%
							= current.getKey();
						%></a><%
						%><div align="right"><%
							%>&nbsp;[<a title="Use 'Save Linked Resource As...' to download" href="<% = current.getKey() %>"><%
								%>open...<%
							%></a>]&nbsp;<%
							%>&nbsp;[<a href="index.html?cmd=edit-as-text&name=<% = current.getKey() %>"><%
								%>edit as text...<%
							%></a>]&nbsp;<%
							%>[<a onclick="return confirm('Are you sure?')" href="index.html?cmd=delete&name=<% = current.getKey() %>"><%
								%>delete<%
							%></a>]<%
						%></div><%
					%></div><%
				}
			}
		}
		 
		%><div style="float: left"><%
			= folders %> folders, <%
			= files %> files.<%
			%><!-- <% 
			= Format.jsDescribe({ folder : folder, children : children });
			%> /--><%
		%></div><%
		%><div style="float: right"><%
			%>&nbsp;[<a href="index.html?cmd=archive"><%
				%>download as zip<%
			%></a>]<%
			%>&nbsp;[<a href="index.html?cmd=create-folder"><%
				%>create folder...<%
			%></a>]<%
			%>&nbsp;[<a href="index.html?cmd=upload"><%
				%>upload file...<%
			%></a>]<%
			%>&nbsp;[<a href="index.html?cmd=create-text"><%
				%>create text file...<%
			%></a>]<%
		%></div><%
		%><br clear="all"/><%
		%><hr><%
		
		= bodyList;
	}
	return Layouts.extend(content,{
		template : "dav-ui-document",
		title : Join(path, '/'),
		insertInHead : insertInHead,
		body : body
	});
}
}

<%/CODE%>