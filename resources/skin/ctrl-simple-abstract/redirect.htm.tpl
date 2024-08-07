<%REDIRECT: Request.language 
					? Runtime.getLanguageSelectionUrl( Request.language, Request.getAttributes()?.Referer ) 
					: ( Request.url || '/' ) %>