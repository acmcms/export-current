<%REDIRECT: Request.language 
					? Runtime.getLanguageSelectionUrl( Request.language, Request.Referer() ) 
					: ( Request.url || '/' ) %>