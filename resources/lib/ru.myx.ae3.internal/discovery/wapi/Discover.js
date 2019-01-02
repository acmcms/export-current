const Discovery = require('java.class/ru.myx.ae3.discovery.Discovery');
const CollectConsole = require("ae3.util/CollectConsole");
const Engine = require('java.class/ru.myx.ae3.Engine');

function Discover(lib, systemName, pathPrefix){
	this.title = systemName + "::" + pathPrefix + "discover (Discover Now)";
}

function runDiscover(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	const query = context.query;

	const console = new CollectConsole();
	console.sendMessage("clientId: " + client);
	Discovery.discover( console );
	const collected = console.getCollected();

	switch(query.parameters.format){
	case 'text':{
		return {
			layout	:	"final",
			type	:	"text/plain",
			content	:	Format.jsObjectReadable(collected)
		};
	}
	case 'json':{
		return {
			layout	:	"final",
			type	:	"application/json",
			content	:	Format.jsObject(collected)
		};
	}
	}
	
	
	/**
	<code>
	return {
		layout : 'data-view',
		fields : {
			host : {
				title : "Using Host",
				variant : "FQDN",
			},
			output : {
				title : "Output"
			}
		},
		content : {
			host : Engine.HOST_NAME,
			output : {
				layout : "sequence",
				elementName : "div",
				elements : collected
			}
		}
	};
	</code>
	**/
	
	var xml;
	$output(xml){
		%><output layout="view"<%= Format.xmlAttribute('title', this.title) %>><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><fields><%
				%><field name="host" title="Using Host" variant="FQDN"/><%
				%><field name="output" title="Output" variant="sequence" elementName="div" />
			%></fields><%
			%><host><%= Engine.HOST_NAME %></host><%
			%><output layout="sequence"><%
				for(var row of collected){
					%><div class="hl-bn-<%= row.state != 'NORMAL' %>"><%
						= Format.xmlNodeValue( row.text );
					%></div><%
				}
			%></output><%
		%></output><%
	}
	
	return {
		layout	:	"xml",
		xsl		:	"/!/skin/skin-standard-xml/show.xsl",
		content	:	xml
	};
}

const PROTOTYPE = Discover.prototype = {
	handle : runDiscover
};

module.exports = Discover;
