<%

	// This lives only on ctrl-simple-abstract and is never overridden further down the
	// prototype chain (ctrl-simple, -browse, -form, -execute all inherit this one copy),
	// so it is the single language-switch redirect for the whole ctrl-simple-* skin family.
	// If a language was requested, bounce through Runtime's language-selection URL for it;
	// otherwise just bounce back to wherever the request came from (or site root).
	
%><%REDIRECT: Request.language
					? Runtime.getLanguageSelectionUrl( Request.language, Request.getAttributes()?.Referer )
					: ( Request.url || '/' ) %>