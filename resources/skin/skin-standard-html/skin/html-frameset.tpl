<%
	// Slightly augments the response and passes it to 'html-page' template of 
	// 'skin-standard-html' skin.

%><%RETURN:
	Layouts.extend( content, {
		template	: 'html-page',
		doctype		: 'frameset'
	})
%>