const ae3 = require("ae3");



function runCliBridge(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	const query = context.query;

	context.title = this.title;
	
	const parameters = query.parameters;
	
	const script = parameters.script;
	const failOnError = parameters.mode === 'fail-on-error';
	const detailOutput = parameters.detail === 'true';

	if( script && parameters.format === 'html-chunked' ){
		var HtmlChunkedConsoleClass = require("ae3").Util.ConsoleHtmlChunked;
		var console = new HtmlChunkedConsoleClass(query);
		console.enqueueTask((function(script){
			// TODO
		}).bind(console, script));
		console.enqueueTask((function(){
			this.close();
		}).bind(console));
		return console.detach();
	}
	
	var output;
	var results;
	if(script && parameters.run === 'true'){
		var commands = script.split('\n');
		var Shell = require('ae3.util/Shell');
		var CollectConsole = require("ae3.util/CollectConsole");
		var console = new CollectConsole();
		results = [];
		detailOutput && console.sendMessage("+ started: " + new Date().toISOString());
		commands.some(function(x){
			try{
				x = String(x).trim();
				detailOutput && console.log("> " + x);
				// var result = Shell.executeNativeInline(x);
				var result = Shell.executeNativeCommandWithConsole(console, x);
				results.push(result);
				detailOutput && console.log("< " + Format.jsDescribe(result));
				return false;
			}catch(e){
				console.error("! error: %s, cmd: %s", (e.message || e), Format.jsString(x));
				return failOnError;
			}
		});
		results.length == 1 && (results = results[0]);
		detailOutput && console.sendMessage("- finished: " + new Date().toISOString());
		$output(output){
			var collected = console.getCollected();
			if(collected) for(var i = 0, l = collected.length; i < l; ++i){
				var line = collected[i];
				= line.text + "\n";
			}
		}
	}
	
	
	var xml;

	$output(xml){
		%><?xml version="1.0" encoding="UTF-8"?><%
		%><?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?><%
		
		if(output){
			%><form<%= Format.xmlAttribute('title', this.title) %> layout="form" method="post"><%
				= Format.xmlElement('client', share.clientElementProperties(context));
				%><fields><%
					%><field name="script" title="Original Script" type="hidden"/><%
					%><field name="scriptPreview" title="Script" cssClass="style--code" type="constant" variant="text"/><%
					%><field name="output" title="Output" cssClass="style--code" type="constant" variant="table" /><%
					%><field name="result" title="Result" cssClass="style--code" type="constant" variant="table" /><%
					%><field name="detail" title="Detail" type="constant" variant="select" <%= Format.xmlAttribute('value', parameters.detail || ''); %>><%
						%><option value="false" title="Show only raw script output"/><%
						%><option value="true" title="Show detail of execution process"/><%
					%></field><%
					%><field name="mode" title="Mode" type="constant" variant="select" <%= Format.xmlAttribute('value', parameters.mode || ''); %>><%
						%><option value="run-through" title="Run through"/><%
						%><option value="fail-on-error" title="Stop on first error"/><%
					%></field><%
					
					if(parameters.back){
						= Format.xmlElement('field', {
							name : 'back',
							type : 'hidden',
							value : parameters.back,
						});
					}
	
					%><submit icon="arrow_refresh_small" name="run" value="true" title="Re-run again" /><%
					%><submit icon="script_edit" title="Edit CLI Command" /><%
					%><help src="/resource/documentation.xml#administration/tools/CliBridge" /><%
				%></fields><%
				%><script><%= Format.xmlNodeValue(script); %></script><%
				%><output><%= Format.xmlNodeValue(output); %></output><%
				%><result><%= Format.xmlNodeValue(Format.jsDescribe(results)); %></result><%
				%><scriptPreview><%= Format.xmlNodeValue(script); %></scriptPreview><%
			%></form><%
		}else{
			%><form<%= Format.xmlAttribute('title', this.title) %> layout="form" method="post"><%
				= Format.xmlElement('client', share.clientElementProperties(context));
				%><fields><%
					%><field name="run" title="Instruction" type="hidden" value="true"/><%
					%><field name="script" title="Script" cssClass="style--code" type="editor" variant="text/plain" value="uname -a"/><%
					%><field name="detail" title="Detail" type="select" <%= Format.xmlAttribute('value', parameters.detail || ''); %>><%
						%><option value="false" title="Show only raw script output"/><%
						%><option value="true" title="Show detail of execution process"/><%
					%></field><%
					%><field name="mode" title="Mode" type="select" <%= Format.xmlAttribute('value', parameters.mode || ''); %>><%
						%><option value="run-through" title="Run through"/><%
						%><option value="fail-on-error" title="Stop on first error"/><%
					%></field><%
					
					if(parameters.back){
						= Format.xmlElement('field', {
							name : 'back',
							type : 'hidden',
							value : parameters.back,
						});
					}

					%><submit icon="bullet_go" title="Run / Execute" /><%
					%><help src="/resource/documentation.xml#administration/tools/CliBridge" /><%
				%></fields><%

				if(script){
					%><script><%= Format.xmlNodeValue(script); %></script><%
				}
			%></form><%
		}
	}
	return {
		layout	: "final",
		type	: "text/xml",
		content	: xml
	};
}


const CliBridge = module.exports = ae3.Class.create(
	"CliBridge",
	undefined,
	function(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "cliBridge (CLI Bridge)";
		return this;
	},
	{
		authRequired : {
			value : true
		},
		handle : {
			value : runCliBridge
		}
	}
);
