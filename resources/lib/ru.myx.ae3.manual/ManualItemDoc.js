var ae3 = require("ae3");
var vfs = ae3.vfs;
var Dom = ae3.Util.Dom;

function ManualItemDoc(manual, tree){
	this.ManualItemAbstract(manual, tree);
	return this;
}

ManualItemDoc.prototype = Object.create(require('./ManualItemAbstract').prototype, {
	ManualItemDoc : {
		value : ManualItemDoc
	},
	icon : {
		get : function(){
			return this.manual.icon || "book_next";
		}
	},
	title : {
		get : function(){
			return this.manual.title || ("Document: " + this.manual.name);
		}
	},
	handle : {
		value : function(context){
			const client = context.share.authCheckDefault(context);

			// for debug info in traces
			const manual = this.manual.vfs;
			const result = Dom.toElement(vfs.UNION.relativeText(manual));

			if(false){
				function append(path){
					var root = Dom.toElement(ndssRoot.relativeText(path));
					root.setAttribute('layout', 'documentation');
					root.setAttribute('disposition', 'section');
					this.appendChild(this.ownerDocument.importNode(root, true));
				}
				append.call(result, 'docs-cloud-features.xml');
				append.call(result, 'docs-device-requirements.xml');
				append.call(result, 'docs-vendor-interface.xml');
				append.call(result, 'docs-administration.xml');
				append.call(result, 'docs-ndss-web-api.xml');
				append.call(result, 'docs-ndss-user-interface.xml');
				append.call(result, 'ndbs/docs-ndbs.xml');
				append.call(result, 'ndns/docs-ndns.xml');
				append.call(result, 'ndrs/docs-ndrs.xml');
			}
			
			const clientElement = Format.xmlElement('client', context.share.clientElementProperties(context));
			if(clientElement){
				result.appendChild(result.ownerDocument.importNode(Dom.toElement(clientElement), true));
			}
			
			return {
				layout : 'xml',
				xsl		: "/!/skin/skin-standard-xml/show.xsl",
				content	: Dom.toXmlCompact(result)
			};
		}
	},
	toString : {
		value : function(){
			return "[ManualItemDoc]";
		}
	}
});

module.exports = ManualItemDoc;