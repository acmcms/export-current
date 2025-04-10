/**
 * 
 */

const formatXmlElement = Format.xmlElement;



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
			execute : "once", get : require.bind(null, "./helper/MakeMessageReplyFn")
			// value : require("./helper/MakeMessageReplyFn")
		},
		/** makeDataViewReply(context, layout) **/
		"makeDataViewReply" : {
			execute : "once", get : require.bind(null, "./helper/MakeDataViewReplyFn")
			// value : require("./helper/MakeDataViewReplyFn")
		},
		"makeDataFormReply" : {
			execute : "once", get : require.bind(null, "./helper/MakeDataFormReplyFn")
			// value : require("./helper/MakeDataFormReplyFn")
		},
		"makeDataTableReply" : {
			execute : "once", get : require.bind(null, "./helper/MakeDataTableReplyFn")
			// value : require("./helper/MakeDataTableReplyFn")
		},
		"makeDocumentationReply" : {
			execute : "once", get : require.bind(null, "./helper/MakeDocumentationReplyFn")
			// value : require("./helper/MakeDocumentationReplyFn")
		},
		"makeSequenceReply" : {
			execute : "once", get : require.bind(null, "./helper/MakeSequenceReplyFn")
			// value : require("./helper/MakeSequenceReplyFn")
		},
		"makeSelectViewReply" : {
			execute : "once", get : require.bind(null, "./helper/MakeSelectViewReplyFn")
			// value : require("./helper/MakeSelectViewReplyFn")
		},

		"buildAuthenticationFailedReply" : { 
			execute : "once", get : require.bind(null, "./helper/AuthenticationFailedReplyFn")
			// value : require("./helper/AuthenticationFailedReplyFn")
		},
		"buildAuthenticationSuccessReply" : {
			execute : "once", get : require.bind(null, "./helper/AuthenticationSuccessReplyFn")
			// value : require("./helper/AuthenticationSuccessReplyFn")
		},
		"buildAuthenticationLogoutReply" : {
			execute : "once", get : require.bind(null, "./helper/AuthenticationLogoutReplyFn")
			// value : require("./helper/AuthenticationLogoutReplyFn")
		},
		"buildAuthenticateReply" : {
			execute : "once", get : require.bind(null, "./helper/AuthenticateReplyFn")
			// value : require("./helper/AuthenticateReplyFn")
		},

		"internUiMessageEnrich" : {
			execute : "once", get : require.bind(null, "./helper/InternUiMessageEnrichFn")
			// value : require("./helper/InternUiMessageEnrichFn")
		},
		
		"internReplaceField" : {
			execute : "once", get : require.bind(null, "./helper/InternReplaceFieldFn")
			// value : require("./helper/InternReplaceFieldFn")
		},
		"internReplaceValue" : {
			execute : "once", get : require.bind(null, "./helper/InternReplaceValueFn")
			// value : require("./helper/InternReplaceValueFn")
		},
		"internOutputValue" : {
			execute : "once", get : require.bind(null, "./helper/internOutputValueFn")
			// value : require("./helper/internOutputValueFn")
		},
	},
	/** STATIC **/
	{
		
	}
);
