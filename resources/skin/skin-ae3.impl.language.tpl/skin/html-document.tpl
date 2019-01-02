<%
	// Slightly augments the response and passes it to 'html-page' template of 
	// 'skin-standard-html' skin.

%><%RETURN: content.tplhtml ? content :
	Layouts.extend( content, {
		title		: "ACM.TPL" + (
			content.title 
				? ", " + content.title 
				: ""
		),
		template	: 'html-document',
		tplhtml		: true
	})
%>