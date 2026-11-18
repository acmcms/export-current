/**
 * this must be bint to XmlSkinHelper instance
 */

const UrlParseFn = URL.parse;

/**
 * The login commands for a reply that has no client yet.
 *
 * @param query
 * @param share
 * @returns
 */
function internMakeLoginOptions(query, share){
	var url = query.url;
	var xml = "";
	$output(xml){
		if(url.startsWith("http://") && query.toSecureChannel()){
			const parsed = UrlParseFn(url);
			= Format.xmlElement("command", {
				icon : "lock_go",
				title : "Switch to secure connection",
				key : parsed.port 
					? "/?secure-login" 
					: "https" + url.substring(4)
			});
			if(share.settings?.["custom-root-ca-pki-location"]){
				= Format.xmlElement("command", {
					icon : "accept",
					title : "The certificate to be trusted for secure connection with this server",
					key : share.settings["custom-root-ca-pki-location"]
				});
			}else{
				= Format.xmlElement("command", {
					key : "?login",
					icon : "error_delete",
					ui : false,
					hidden : true,
					access : "public",
					title : "(Non-Secure) Login using basic http authentication"
				});
			}
		}else{
			= Format.xmlElement("command", {
				key : "?login",
				icon : "key_go",
				ui : true,
				access : "public",
				title : "Login using basic http authentication"
			});
		}
	}
	return xml;
}

module.exports = internMakeLoginOptions;
