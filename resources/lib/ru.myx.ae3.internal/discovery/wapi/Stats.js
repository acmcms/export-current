const Discovery = require('java.class/ru.myx.ae3.discovery.Discovery');
const CollectConsole = require("ae3.util/CollectConsole");

const net = require('ae3/net');

function StatsXmlWithXsl(lib, systemName, pathPrefix){
	this.title = systemName + "::" + pathPrefix + "stats (Discovery Stats)";
}

function runStatsXmlWithXsl(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	const query = context.query;

	var console = new CollectConsole();
	console.sendMessage("clientId: " + client);
	Discovery.dump( console );
	var collected = console.getCollected();
	var xml;
	$output(xml){
		%><dump<%= Format.xmlAttribute('title', this.title) %> layout="view"><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><fields><%
				%><field name="host" title="Using Host" variant="FQDN"/><%
				%><field name="grp4" title="IPv4 Group" variant="string"/><%
				%><field name="list" title="Known Peers" variant="list"/><%
			%></fields><%
			%><host><%= net.HOST_NAME %></host><%
			%><grp4><%= Discovery.MCAST_ADDRESS + ':' + Discovery.MCAST_PORT %></grp4><%
			%><date><%= Format.date(Date.now()) %></date><%
			%><list layout="list"><%
				%><columns><%
					%><column id="id" title="Instance"/><%
					%><column id="address" title="Address" type="string" variant="IP"/><%
					%><column id="updated" title="Updated" type="date" variant="date"/><%
					%><column id="took" title="Took" type="number" variant="period" scale="1"/><%
					%><column id="avg" title="Avg." type="number" variant="period" scale="1"/><%
				%></columns><%
				if(collected) for(var i = 0, l = collected.length; i < l; ++i){
					var line = collected[i];
					if(!line.text.startsWith("peer: ")){
						continue;
					}
					var obj = eval("(function(vfs,Discovery){return "+line.text.substring(6)+";})()");
					var avg = obj.spent / obj.replies;
					%><item hl="<%= line.state != 'NORMAL' %>" id="<%= obj.identity %>" address="<%= obj.address %>" took="<%= obj.took %>" updated="<%= (new Date(obj.updated)).toISOString() %>" avg="<%= avg %>"/><%
				}
			%></list><%
		%></dump><%
	}
	return {
		layout	:	"xml",
		xsl		:	"/!/skin/skin-standard-xml/show.xsl",
		content	:	xml
	};
}

const PROTOTYPE = StatsXmlWithXsl.prototype = {
	handle : runStatsXmlWithXsl
};

module.exports = StatsXmlWithXsl;
