const formatXmlElement = Format.xmlElement;
const formatXmlElements = Format.xmlElements;



/**
 * TODO: leave XML in XML, but move 'html-js', etc in other places.
 */


const XmlSkinHelper = module.exports = require("ae3").Class.create(
	"XmlSkinHelper",
	require("ae3.web/UiBasic").prototype,
	function() {
		this.UiBasic();
		return this;
	},
	/** INSTANCE **/
	{
		"authenticationProvider" : {
			value : undefined
		},
		
		/** makeDoneRefreshReply(title, forward) **/
		"makeDoneRefreshReply" : {
			value : function makeDoneRefreshReply(title, forward){
				return {
					layout : "xml",
					xsl : "/!/skin/skin-standard-xml/showState.xsl",
					content : formatXmlElement("done", {
						title : title || "updated...",
						updated : (new Date()).toISOString(),
						forward : forward || undefined
					})
				};
			}
		},
		/** makeMessageReply(context, layout) **/
		"makeMessageReply" : {
			value : require("./helper/MakeMessageReplyFn")
		},
		/** makeDataViewReply(context, layout) **/
		"makeDataViewReply" : {
			value : require("./helper/MakeDataViewReplyFn")
		},
		"makeDataFormReply" : {
			value : require("./helper/MakeDataFormReplyFn")
		},
		"makeDataTableReply" : {
			value : require("./helper/MakeDataTableReplyFn")
		},
		"makeDocumentationReply" : {
			value : require("./helper/MakeDocumentationReplyFn")
		},
		"makeSequenceReply" : {
			value : require("./helper/MakeSequenceReplyFn")
		},
		"makeSelectViewReply" : {
			value : require("./helper/MakeSelectViewReplyFn")
		},

		"buildAuthenticationFailedReply" : { 
			value : require("./helper/AuthenticationFailedReplyFn")
		},
		"buildAuthenticationSuccessReply" : {
			value : require("./helper/AuthenticationSuccessReplyFn")
		},
		"buildAuthenticationLogoutReply" : {
			value : require("./helper/AuthenticationLogoutReplyFn")
		},
		"buildAuthenticateReply" : {
			value : require("./helper/AuthenticateReplyFn")
		},

		"internReplaceField" : {
			value : require("./helper/InternReplaceFieldFn")
		},
		"internReplaceValue" : {
			value : require("./helper/InternReplaceValueFn")
		},
		"internOutputValue" : {
			value : function internOutputValue(key, value){
				return formatXmlElements(key, this.internReplaceValue(value));
			}
		},
	},
	/** STATIC **/
	{
		
	}
);
