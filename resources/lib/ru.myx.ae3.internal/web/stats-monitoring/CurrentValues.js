function CurrentValues(systemName, pathPrefix){
	this.title = systemName + "::" + pathPrefix + "currentValues (Current Telemetry Values)";
	this.systemName = systemName;
	this.pathPrefix = pathPrefix;
}

function groupsIterate(groups, filter){
	var g, r, c, v, f;
	for(g of groups){
		if(filter && !g.hasKeyword(filter)){
			continue;
		}
		r = g.readOwnValues({});
		%><field <%= Format.xmlAttribute('title', g.title) %> variant="view"><%
			%><fields><%
				for(c of r.columns){
					if(!c.evaluate){
						v = r.values[c.name];
						f = Object.create(c);
						f['default'] = v;
						f.titleShort && f.title && (f.hint ||= f.title);
						= Format.xmlElement('field', f);
					}
				}
				g.extra && groupsIterate(g.extra, filter);
			%></fields><%
		%></field><%
	}
}

function runCurrentValues(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	const query = context.query;

	const parameters = query.parameters;
	const filter = parameters.filter || undefined;

	const Stats = require('ae3.stats/Stats');
	const groups = Stats.getGroups();
	
	var xml;
	$output(xml){
		%><status<%= Format.xmlAttribute('title', this.title) %> layout="view"><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			
			%><fields><%
				groups && groupsIterate(groups, filter);
			%></fields><%
		%></status><%
	}
	return {
		layout	: "xml",
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

CurrentValues.prototype = {
	handle : runCurrentValues
};

module.exports = CurrentValues;
