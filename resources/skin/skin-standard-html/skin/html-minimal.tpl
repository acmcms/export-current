<%
	// Slightly augments the response and passes it to 'html-page' template of 
	// 'skin-standard-html' skin.
	
			Layout:
					bodyAttributes		: the optional map of attributes to append to body element
					
					requireJsLater		: default: undefined, use boolean true to move JS imports 
											to the very end of the resulting document
				
	

%><%CODE: 'ACM.ECMA' %>
	var body = '', result = Object.create(content);
	
	$output(body){
		%><body<%= Format.xmlAttributes(content.bodyAttributes) %>><%
			= content.body || 'No content!&nbsp;<br />';
			
			if( content.requireJsLater === true ){
				var pathPrefix = content.pathPrefix || (request.urlBase + '/client/');
				var requireJsSeen = {};

				// without require.js
				var jsCurrent, href;
				for( jsCurrent in content.requireJs ){
					if( !requireJsSeen[jsCurrent] ){
						requireJsSeen[ jsCurrent ] = true;
						href = jsCurrent.startsWith("http:") || jsCurrent.startsWith("https:") 
							? jsCurrent 
							: ((jsCurrent.startsWith("/") 
								? "" 
								: pathPrefix + "js/")
									+ jsCurrent + ".js");
						%><script type="text/javascript" src="<%= Format.xmlAttributeFragment( href ) %>"></script><%
					}
				}
			
				result.requireJs = null;
			}
			
		%></body><%
	}
	
	result.template = 'html-page';
	result.body = body;
	
	return result;
<%/CODE%><%

%>