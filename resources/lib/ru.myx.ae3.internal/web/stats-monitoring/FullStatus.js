function FullStatus(systemName, pathPrefix){
	this.title = systemName + "::" + pathPrefix + "fullStatus (Show Full System Status)";
	this.systemName = systemName;
	this.pathPrefix = pathPrefix;
}

function runFullStatus(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	const query = context.query;

	const StatusRegistry = require('java.class/ru.myx.ae3.status.StatusRegistry');

	var xml;
	$output(xml){
		%><status<%= Format.xmlAttribute('title', this.title) %> layout="view"><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			
			%><fields><%
				function f(arr){
					for(var p of arr){
						var status = p.status;
						%><field <%= Format.xmlAttribute('title', status.title) %> variant="view">
							%><fields><%
								for(var s of status.statusAsList){
									= Format.xmlElement('field', {
										title : s.key,
										'default' : s.value,
									});
								}
								p.statusDecomposition && f(p.statusDecomposition());
								p.childProviders && f(p.childProviders());
							%></fields><%
						%></field><%
					}
				}
				f(StatusRegistry.ROOT_REGISTRY.statusDecomposition());
			%></fields><%
		%></status><%
	}
	return {
		layout	: "xml",
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

const PROTOTYPE = FullStatus.prototype = {
	handle : runFullStatus
};

module.exports = FullStatus;
