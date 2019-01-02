<%CODE: 'ACM.ECMA' %>

var folder = content.folder;
var path = content.path;
var children = content.children;

var gradusnik;
$output( gradusnik ){
	%><div style="font-style:italic"><%
		%><a href="/">&laquo;welcome&raquo;</a> / <%
		var pathLeft = path.length;
		for(var current in path){
			%><a href="<%
				pathLeft --;
				for(var i = pathLeft; i > 0; --i){ 
					= "../"; 
				}
			%>index.html"><% = current || "&laquo;root&raquo;" %></a> / <%
		}
	%></div><%
}

return {
	template : 'html-document',
	title : content.title,
	insertInHead : content.insertInHead,
	body : gradusnik + "<hr />" + content.body
};

<%/CODE%>