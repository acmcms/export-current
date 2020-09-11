const FiltersFormLayout = require('./FiltersFormLayout');

/**
 * TODO: leave XML in XML, but move 'html-js', etc in other places.
 */

function Helper(){
	this.UiBasic();
	return this;
}

Helper.prototype = Object.create(require('ae3.web/UiBasic').prototype, {
	Helper : {
		value : Helper
	},
	toString : {
		value : function(){
			return '[require ae3.l3.xml/helper]';
		}
	}
});

var web = module.exports = new Helper();


/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticationFailedReply(context){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.___output || 'xml'){
	case 'html-js':{
		var html = '';
		$output(html){
			%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><%
			%><html><%
				%><head><%
					%><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><%
					%><script><%
						%>alert("Authentication failed!");<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			layout	: "html",
			code : 403,
			content	: html
		};
	}
	case 'json':{
		return {
			layout : 'final',
			code : 403,
			contentType : 'text/json',
			content : Format.jsObject({
				layout : 'message',
				code : '403',
				message : 'Autentication failed!'
			})
		};
	}
	case 'xml':{
		var xml;
		$output(xml){
			%><authentication-failed<%= Format.xmlAttribute('title', context.title || 'Authentication failed') %> layout="menu" zoom="document"><%
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				%><message><%
					%>This service requires all clients to sign-in. There was an authentication failure.<%
				%></message><%
				= internMakeLoginOptions(query, Index);
				// <command key="/?login" icon="arrow_refresh" title="Login / Retry"/>
			%></authentication-failed><%
		}
		return {
			layout	: "xml",
			code : 403,
			xsl	: "/!/skin/skin-standard-xml/show.xsl",
			content	: xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}
web.buildAuthenticationFailedReply = buildAuthenticationFailedReply;

/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticationSuccessReply(context){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.___output || 'xml'){
	case 'html-js':{
		var html = '';
		$output(html){
			%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><%
			%><html><%
				%><head><%
					%><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><%
					%><script><%
						%>alert("Authentication success!");<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			layout	: "html",
			content	: html
		};
	}
	case 'json':{
		return {
			layout : 'final',
			contentType : 'text/json',
			content : Format.jsObject({
				layout : 'message',
				message : 'Autentication success!'
			})
		};
	}
	case 'xml':{
		var xml;
		$output(xml){
			%><authentication-success<%= Format.xmlAttribute('title', context.title || 'Authentication Success') %>><%
				= Format.xmlElement('client', context.share.clientElementProperties(context));
			%></authentication-success><%
		}
		return {
			layout	: "xml",
			xsl	: "/!/skin/skin-standard-xml/showAuth.xsl",
			content	: xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}
web.buildAuthenticationSuccessReply = buildAuthenticationSuccessReply;

/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticationLogoutReply(context){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.___output || 'xml'){
	case 'html-js':{
		var html = '';
		$output(html){
			%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><%
			%><html><%
				%><head><%
					%><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><%
					%><script><%
						%>alert("Authentication credentials invalidated!");<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			layout	: "html",
			content	: html
		};
	}
	case 'json':{
	}
	case 'xml':{
		var url = "//" + query.targetExact + '/';
		var xml;
		$output(xml){
			%><authentication-logout<%= Format.xmlAttribute('title', context.title || 'Log-Out') %>><%
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				%><redirect><%= Format.xmlNodeValue(url) %></redirect><%
			%></authentication-logout><%
		}
		return {
			layout	: "xml",
			xsl	: "/!/skin/skin-standard-xml/showAuth.xsl",
			content	: xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}
web.buildAuthenticationLogoutReply = buildAuthenticationLogoutReply;


/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticateReply(context){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.___output || 'xml'){
	case 'html-js':{
		var html = '';
		$output(html){
			%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><%
			%><html><%
				%><head><%
					%><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><%
					%><script><%
						%>alert("Authentication required!");<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			layout	: "html",
			content	: html
		};
	}
	case 'json':{
	}
	case 'xml':{
		var url = query.url;
		var xml;
		$output(xml){
			%><authenticate<%= Format.xmlAttribute('title', context.title || message) %> layout="menu" zoom="document"><%
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				if(query.attributes["Secure"] !== "true" && url.startsWith("http://")){
					%><message><%
						%>This service requires all clients to sign-in. Encrypted communication required to proceed.<%
					%></message><%
				}else{
					%><message><%
						%>This service requires all clients to sign-in.<%
					%></message><%
				}
				= internMakeLoginOptions(query, Index);
			%></authenticate><%
		}
		return {
			layout : 'xml',
			xsl : "/!/skin/skin-standard-xml/show.xsl",
			content : xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}
web.buildAuthenticateReply = buildAuthenticateReply;


web.authenticationProvider = undefined;




function formatterPlain(v/*, column, row*/){
	return v;
}

function formatterDate(v/*, column, row*/){
	return v.toISOString();
}

function makeDoneRefreshReply(title, forward){
	return {
		layout : 'xml',
		xsl : '/!/skin/skin-standard-xml/showState.xsl',
		content : Format.xmlElement('done', {
			title : title || 'updated...',
			updated : (new Date()).toISOString(),
			forward : forward || undefined
		})
	};
}
web.makeDoneRefreshReply = makeDoneRefreshReply;

function makeMessageReply(context, layout){
	const code = layout.code;
	
	var element = layout.rootName;
	var hl = layout.hl;
	var icon = layout.icon;
	
	var message = layout.message || layout.content;
	var reason = layout.reason || (message && (message.reason || message.title));
	
	
	if(code && !(hl || icon) && Number(code) === code){
		switch(code){
		case 400:{
			hl || (hl = 'error');
			icon || (icon = 'stop');
			element || (element = 'invalid');
			reason || (reason = 'Invalid Request');
			message || (message = 'Some of request arguments or format are unacceptable, out of range or malformed.');
			break;
		}
		case 403:{
			hl || (hl = 'error');
			icon || (icon = 'delete');
			element || (element = 'denied');
			reason || (reason = 'Access Denied');
			message || (message = 'The account is not granted with permission to execute the operation requested.');
			break;
		}
		case 404:{
			hl || (hl = 'error');
			icon || (icon = 'error_delete');
			element || (element = 'failed');
			reason || (reason = 'Resource Not Found');
			message || (message = 'The client request references to resource that cannot be found or identified. Please, check the URL and other parameters of your request or contact an administrator if you believe that request is correct.');
			break;
		}
		case 500:{
			hl || (hl = 'error');
			icon || (icon = 'exclamation');
			element || (element = 'failed');
			reason || (reason = 'Internal Server Failure');
			message || (message = 'The server encountered an internal problem while trying to satisfy the client request. Please, contact the administrator if you are concerned or if problem persists.');
			break;
		}
		default:{
			switch((code / 100)^0){
			case 2:{
				hl || (hl = 'true');
				icon || (icon = 'tick');
				element || (element = 'updated');
				reason || (reason = 'Operation Successful');
				message || (message = 'The request seems to be satisfied with no further detail provided.');
				break;
			}
			case 4:{
				hl || (hl = 'error');
				icon || (icon = 'error_delete');
				element || (element = 'failed');
				reason || (reason = 'Unclassified Client Failure');
				message || (message = 'The client request is not considered valid and will not be served.');
				break;
			}
			case 5:{
				hl || (hl = 'error');
				icon || (icon = 'exclamation');
				element || (element = 'failed');
				reason || (reason = 'Unclassified Server Failure');
				message || (message = 'The server encountered an unsolvable problem while trying to satisfy the client request.');
				break;
			}
			}
		}
		}
	}
	
	element || (element = 'message');
	reason || (reason = ('string' === typeof message && message) || layout.title);
	
	const title = layout.title || context.title || (context.share || '').systemName || 'Message';
	const detail = layout.detail;
	
	const filters = layout.filters || (message||'').filters;
	
	var xml = '';
	$output(xml){
		%><<%= element; = 'string' === typeof title 
			? Format.xmlAttributes({
				title : title,
				code : code,
				icon : icon,
				hl : hl,
				zoom : layout.zoom
			})
			: Format.xmlAttributes(Object.create(title, {
				code : {
					value : code,
					enumerable : true
				},
				icon : {
					value : icon,
					enumerable : true
				},
				hl : {
					value : hl,
					enumerable : true
				}
			}));
		 %> layout="message"<%
		%>><%
			if(context.share){
				= Format.xmlElement('client', context.share.clientElementProperties(context));
			}
			if(filters && filters.fields){
				= Format.xmlElement('prefix', new FiltersFormLayout(filters));
			}
			%><reason><%= Format.xmlNodeValue(reason || 'Unclassified message.') %></reason><%
			if(message && message !== reason){
				if('string' === typeof message){
					%><message class="code style--block"><%= Format.xmlNodeValue(message) %></message><%
				}else //
				if(message.layout){
					= internOutputValue('message', message || reason);
				}
			}
			if(detail){
				if('string' === typeof detail){
					%><detail class="code style--block"><%= Format.xmlNodeValue(detail) %></detail><%
				}else{
					= internOutputValue('detail', detail);
				}
			}
			if((layout.help || message && message.help) && context.query.parameters.format !== 'clean'){
				%><help src="<%= Format.xmlAttributeFragment(layout.help || message.help) %>"/><%
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		code	: code,
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml,
		cache	: message.cache,
		delay	: message.delay
	};
}
web.makeMessageReply = makeMessageReply;



function internReplaceField(edit, field){
	const key = field.id || field.name;
	const val = this 
		? key === '.' ? this : this[key] 
		: null
	;
	if(val !== undefined && val !== null && val !== this && 'object' !== typeof val){
		this[key] = [ val ];
	}
	if(field.type === 'set' || field.type === 'select'){
		if(edit && field.list && field.list.columns && field.list.columns.map){
			const list = field.list
			const input = field.type === 'set' ? 'checkbox' : 'radio';
			return Object.create(field, {
				list : { 
					value : {
						attributes : list.attributes,
						columns : { 
							column : [{
								id : 'value',
								name : 'value',
								title : input === 'radio' ? ' ๏ ' : ' ☑ ', // ☒
								type : 'input',
								extraClass : 'ui-align-center',
								variant : input,
								selected : field.selected,
								name : field.id || field.name
							}].concat(list.columns)
						},
						rows : list.rows
					}
				},
			});
		}
		if(field.variant === "edit" && field.options){
			return Object.create(field, {
				options : { value : null },
				option : { 
					enumerable : true, 
					value : Array(field.options).map(function(option){
						if(option.fields && option.fields.map){
							return Object.create(option, {
								fields : {
									enumerable : true, 
									value : {
										field : option.fields.map(internReplaceField.bind(this, edit))
									}
								}
							});
						}
						return option;
					}) 
				},
			});
		}
	}
	switch(field.variant){
	case 'sequence':{
		var enm = field.elementName || 'item';
		var arr = val[enm];
		if(!arr){
			return field;
		}
		key === '.' || (val = this[key] = Object.create(val));
		val[enm] = Array(arr).map(internReplaceValue);
		return field;
	}
	case 'select':
		if(field.options){
			return Object.create(field, {
				options : { value : null },
				option : { 
					enumerable : true, 
					value : Array(field.options).map(function(option){
						if(option.fields && option.fields.map){
							return Object.create(option, {
								fields : {
									enumerable : true,
									value : {
										field : option.fields.map(internReplaceField.bind(this, edit))
									}
								}
							});
						}
						return option;
					}) 
				},
			});
		}
		return field;
	case 'view':
	case 'form':{
		if(!key){
			if(field.value){
				var rep = internReplaceValue(field.value);
				if(rep !== undefined && rep !== null && 'object' !== typeof rep){
					rep = [ rep ];
				}
				(field = Object.create(field)).value = rep;
			}
		}else//
		if(this){
			var idx, ext, rep, nxt;
			if(val && val.layout){
				rep = internReplaceValue.call(val, val);
				if(rep !== undefined && rep !== null && 'object' !== typeof rep){
					rep = [ rep ];
				}
				this[key] = rep;
				return field;
			}
			for(idx in val){
				ext = val[idx];
				rep = internReplaceValue.call(val, ext);
				if(rep !== undefined && rep !== null && 'object' !== typeof rep){
					rep = [ rep ];
				}
				if(rep !== ext){
					if(!nxt){
						nxt = Object.create(val);
						this[key] = nxt;
					}
					nxt[idx] = rep;
				}
			}
		}
		if(field.fields && Array.isArray(field.fields)){
			return Object.create(field, {
				fields : { enumerable : true, value : { field : field.fields } },
			});
		}
		return field;
	}
	case 'list':
		if(field.columns && Array.isArray(field.columns)){
			return Object.create(field, {
				columns : { enumerable : true, value : { column : field.columns } },
			});
		}
		return field;
	default:
		return field;
	}
}

function internReplaceValue(value){
	if(value === null || value === undefined || 'object' !== typeof value || Array.isArray(value)){
		return value;
	}
	var layout, values;
	switch(value.layout){
	case 'data-view':
		layout = Object.create(value);
		layout.layout = 'view';
		values = "object" === typeof value.values ? Object.create(value.values) : {};
		value.fields && (layout.fields = {
			field : value.fields.map(internReplaceField.bind(values, false))
		});
		value.values && (layout.values = null);
		for(var valueKey in values){
			layout[valueKey] = internReplaceValue(values[valueKey]);
		}
		value.commands && (layout.fields.command = value.commands, layout.commands = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
	case 'data-form':
		layout = Object.create(value);
		layout.layout = 'form';
		layout.values = "object" === typeof value.values ? Object.create(value.values) : {};
		value.fields && (layout.fields = {
			field : value.fields.map(internReplaceField.bind(layout.values, true))
		});
		/**
		if("object" === typeof value.values){
			for(var valueKey in value.values){
				layout.values[valueKey] = internReplaceValue(layout.values[valueKey]);
			}
		}
		*/
		value.commands && (layout.fields.command = value.commands, layout.commands = null);
		value.submit && (layout.fields.submit = value.submit, layout.submit = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
	case 'data-list':
	case 'data-table':
		layout = Object.create(value);
		layout.layout = 'list';
		value.columns && (layout.columns = {
			column : value.columns.map(internReplaceField.bind(null, false))
		});
		if(value.elementName || (value.rows && !value.rows.row && Array.isArray(value.rows))){
			layout.rows = null;
			layout.item = value.rows.map(internReplaceValue);
		}
		value.commands && (layout.columns.command = value.commands, layout.commands = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
	case 'documentation':
		layout = Object.create(value);
		// layout.layout = 'documentation';
		value.commands && (layout.fields.command = value.commands, layout.commands = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
	}
	{
		var key, vale, repl;
		for(key in value){
			vale = value[key];
			repl = internReplaceValue(vale);
			if(repl !== vale){
				layout || (layout = Object.create(value));
				layout[key] = repl;
			}
		}
		return layout || value;
	}
	// return value;
}

function internOutputValue(key, value){
	return Format.xmlElements(key, internReplaceValue(value));
}





function makeDataViewFragment(query, layout, extraCommands){
	const fields = layout.fields;
	if(!fields){
		throw new Error("Field definition is required!");
	}
	const fieldCount = fields.length;
	if(!fieldCount){
		throw new Error("Field definition is empty!");
	}

	const filters = layout.filters;
	
	var xml = '';
	$output(xml){
		if(layout.prefix){
			= internOutputValue('prefix', layout.prefix);
		}
		if(filters && filters.fields){
			= Format.xmlElement('prefix', new FiltersFormLayout(filters));
		}
		%><fields><%
			for(var field of layout.fields){
				= Format.xmlElement('field', internReplaceField.call(layout.values, false, field));
			}
			if(extraCommands){
				= extraCommands;
			}
			if(layout.commands){
				= Format.xmlElements('command', layout.commands);
			}
			if(layout.help && (!query || query.parameters.format !== 'clean')){
				= Format.xmlElement('help', { src : layout.help });
			}
		%></fields><%
		if("object" === typeof layout.values){
			for(var valueKey in layout.values){
				= internOutputValue(valueKey, layout.values[valueKey]);
			}
		}
		if(layout.suffix){
			= internOutputValue('suffix', layout.suffix);
		}
	}
	return xml;
}

/**
 * <code>
 * layout = {
 * -rootName : 'view',
 * 	fields: [
 * 	],
 * 	values: {
 * 	},
 * 	commands: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDataViewReply(context, layout){
	const query = context && context.query;
	if(query && query.parameters.___output){
		switch(query.parameters.___output){
		case 'xml':
			return require('ae3/xml').makeDataViewReply(query, layout);
		case 'xls':
			return require('ae3/xls').makeDataViewReply(query, layout);
		case 'txt':
			return require('ae3/txt').makeDataViewReply(query, layout);
		case 'pdf':
			return require('ae3/pdf').makeDataViewReply(query, layout);
		}
	}
	
	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = 'view';
	const filters = layout.filters;
	const element = layout.rootName || 'view';
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	:	'<' + element + Format.xmlAttributes(attributes || {}) + '>' + 
					(query && Format.xmlElement('client', context.share.clientElementProperties(context)) || '') +
					makeDataViewFragment(
						query,
						layout, 
						query && !query.parameters.___output && query.parameters.___all && Format.xmlElement('command', {
							title : 'Download as XLS',
							icon : 'disk',
							url : '?___output=xls&' + Format.queryStringParameters(filters && filters.values)
						})
					) +
					'</' + element + '>'
	};
}
web.makeDataViewReply = makeDataViewReply;

/**
 * <code>
 * layout = {
 * -rootName : 'form',
 * 	fields: [
 * 	],
 * 	values: {
 * 	},
 * 	commands: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDataFormReply(context, layout){
	const query = context && context.query;
	if(query && query.parameters.___output){
		switch(query.parameters.___output){
		case 'xml':
			return require('ae3/xml').makeDataFormReply(query, layout);
		case 'xls':
			return require('ae3/xls').makeDataViewReply(query, layout);
		case 'txt':
			return require('ae3/txt').makeDataViewReply(query, layout);
		case 'pdf':
			return require('ae3/pdf').makeDataViewReply(query, layout);
		}
	}

	const fields = layout.fields;
	if(!fields){
		throw new Error("Field definition is required!");
	}
	const fieldCount = fields.length;
	if(!fieldCount){
		throw new Error("Field definition is empty!");
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = 'form';
	
	const filters = layout.filters;
	
	const element = layout.rootName || 'form';

	var xml = '';
	$output(xml){
		%><<%= element; %><%= Format.xmlAttributes(attributes); %>><%
			if(query){
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				if(context.rawHtmlHeadData){
					%><rawHeadData><%
						%><![CDATA[<%
							= context.rawHtmlHeadData;
						%>]]><%
					%></rawHeadData><%
				}
			}
			if(layout.prefix){
				= internOutputValue('prefix', layout.prefix);
			}
			if(filters && filters.fields){
				= Format.xmlElement('prefix', new FiltersFormLayout(filters));
			}
			%><fields><%
				for(var field of layout.fields){
					= Format.xmlElement('field', internReplaceField.call(layout.values, true, field));
				}
				if(layout.commands || layout.submit){
					= Format.xmlElements('command', layout.commands);
					= Format.xmlElements('submit', layout.submit);
				}else//
				if(false && query && !query.parameters.___output){
					// Request.modifyQueryStringParameter(url, 'format', 'xls' )
					= Format.xmlElement('command', {
						title : 'Download as XLS',
						icon : 'disk',
						url : '?___output=xls&' + Format.queryStringParameters(filters && filters.values)
					});
				}
				if(layout.help && (!query || query.parameters.format !== 'clean')){
					= Format.xmlElement('help', { src : layout.help });
				}
			%></fields><%
			%><values><%
				if("object" === typeof layout.values){
					for(var valueKey in layout.values){
						= internOutputValue(valueKey, layout.values[valueKey]);
					}
				}
			%></values><%
			if(layout.suffix){
				= internOutputValue('suffix', layout.suffix);
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}
web.makeDataFormReply = makeDataFormReply;

/**
 * <code>
 * layout = {
 * -rootName : 'list',
 * 	columns: [
 * 	],
 * 	rows: function(i)/arrayOfArrays/arrayOfMaps,
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDataTableReply(context, layout){
	const query = context && context.query;
	if(query && query.parameters.___output){
		switch(query.parameters.___output){
		case 'xml':
			return require('ae3/xml').makeDataTableReply(query, layout);
		case 'xls':
			return require('ae3/xls').makeDataTableReply(query, layout);
		case 'txt':
			return require('ae3/txt').makeDataTableReply(query, layout);
		case 'pdf':
			return require('ae3/pdf').makeDataTableReply(query, layout);
		case 'html':
			return require('ae3/html').makeDataTableReply(query, layout);
		case 'csv':
			return require('ae3/csv').makeDataTableReply(query, layout);
		}
	}

	const columns = layout.columns;
	if(!columns){
		throw new Error("Column definition is required!");
	}
	const columnCount = columns.length;
	if(!columnCount){
		throw new Error("Column definition is empty!");
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = 'list';
	
	const rows = layout.rows || [];
	const rowCount = rows.length;
	
	const formats = [];

	const filters = layout.filters;
	
	const element = layout.rootName || 'list';

	var xml = '', c, column, cn, r, row, item = {}, /* more, */format;
	$output(xml){
		%><<%= element; %><%= Format.xmlAttributes(attributes); %>><%
			if(query){
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				if(context.rawHtmlHeadData){
					%><rawHeadData><%
						%><![CDATA[<%
							= context.rawHtmlHeadData;
						%>]]><%
					%></rawHeadData><%
				}
			}
			if(layout.prefix){
				= internOutputValue('prefix', layout.prefix);
			}
			if(filters && filters.fields){
				= Format.xmlElement('prefix', new FiltersFormLayout(filters));
			}
			%><columns><%
				for(c = 0; c < columnCount; ++c){
					column = columns[c];
					= Format.xmlElement('column', internReplaceField.call(null, false, column));
					// item[column.id] = true;
					switch(column.variant){
					case 'list':
						formats[c] = formatterPlain;
						break;
					case 'view':
						formats[c] = formatterPlain;
						break;
					case 'select':
						formats[c] = formatterPlain;
						break;
					case 'date':
						formats[c] = formatterDate;
						break;
					default:
						formats[c] = formatterPlain;
					}
				}
				
				/**
				 * commands and extra fields for commands
				 */
				for(c in layout.rowCommands){
					/**
					 * 
					cn = c.field;
					if(!item[cn]){
						more || (more = []);
						more.push(cn);
					}
					 */
					= Format.xmlElement('command', c);
				}
			%></columns><%
			
			for(r = 0; r < rowCount; ++r){
				= Format.xmlElement('item', rows[r]);
				/**
				 * all columns required for commands and links
				 * 
				row = rows[r];
				for(c = 0; c < columnCount; ++c){
					column = columns[c];
					cn = column.id;
					item[cn] = formats[c](row[cn], column, row);
				}
				for(cn in more){
					item[cn] = row[cn];
				}
				= Format.xmlElement('item', item);
				*/
			}
			
			if(layout.commands){
				= Format.xmlElements('command', layout.commands);
			}
			if(query && !query.parameters.___output){
				const suffix = Format.queryStringParameters(filters && "object" === typeof filters.values && filters.values || query.parameters, { format : undefined });
				const commands = [
					{
						title : 'Download as XLS',
						icon : 'page_white_excel',
						url : '?___output=xls&' + suffix
					},
					{
						title : 'Download as PDF',
						icon : 'page_white_acrobat',
						url : '?___output=pdf&' + suffix
					},
					{
						title : 'Download as HTML',
						icon : 'page_world',
						url : '?___output=html&' + suffix
					},
					{
						title : 'Download as CSV',
						icon : 'page_white_text',
						url : '?___output=csv&' + suffix
					}
				];
				if(query.parameters.format === 'clean' || query.verb !== 'POST'){
					commands.push({
						title : 'Open as Listing Page',
						icon : 'world_link',
						url : '?' + suffix,
						target : '_blank'
					});
				}
				// Request.modifyQueryStringParameter(url, 'format', 'xls' )
				= Format.xmlElement('command', {
					title : 'Download',
					titleShort : new String(''),
					icon : 'images',
					group : {
						command : commands
					}
				});
			}
			if(layout.help && (!query || query.parameters.format !== 'clean')){
				= Format.xmlElement('help', { src : layout.help });
			}
			if(layout.suffix){
				= internOutputValue('suffix', layout.suffix);
			}
			if(layout.next && layout.next.uri){
				= Format.xmlElement('next', layout.next);
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}
web.makeDataTableReply = makeDataTableReply;



function makeDocumentationFragment(layout, extraCommands){
	const elements = layout.elements;
	if(!elements){
		throw new Error("Documant 'elements' array is required!");
	}
	var xml = '';
	$output(xml){
		if(layout.prefix){
			= internOutputValue('prefix', layout.prefix);
		}
		if(elements){
			for(var element of Array(elements)){
				if(element) {
					= internOutputValue(element.disposition || 'element', element);
					// = Format.xmlElement(element.disposition || 'element', element);
				}
			}
		}
		if(layout.help){
			= Format.xmlElement('help', { src : layout.help });
		}
	}
	return xml;
}


/**
 * <code>
 * layout = {
 * -rootName : 'documentation',
 * 	elements: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDocumentationReply(context, layout){
	const query = context && context.query;
	if(query && query.parameters.___output === 'xls'){
		throw "No XLS support for 'documentation' layout.";
		return require('ae3/xls').makeDataViewReply(query, layout);
	}
	
	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = 'documentation';
	const element = layout.rootName || 'documentation';
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	:	'<' + element + Format.xmlAttributes(attributes || {}) + '>' + 
					(query && Format.xmlElement('client', context.share.clientElementProperties(context)) || '') +
					makeDocumentationFragment(
						layout, 
						false && query && !query.parameters.___output && Format.xmlElement('command', {
							title : 'Download as PDF',
							icon : 'disk',
							url : '?___output=pdf&' + Format.queryStringParameters(filters && "object" === typeof filters.values && filters.values)
						})
					) +
					'</' + element + '>'
	};
}
web.makeDocumentationReply = makeDocumentationReply;


/**
 * <code>
 * layout = {
 * -rootName : 'sequence',
 * 	options: [
 * 	],
 * 	commands: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeSequenceReply(context, layout){
	const query = context && context.query;
	if(query && query.parameters.___output){
		switch(query.parameters.___output){
		case 'xml':
			return require("ae3/xml").makeDataFormReply(query, layout);
		case 'xls':
			return require("ae3/xls").makeDataViewReply(query, layout);
		case 'txt':
			return require("ae3/txt").makeDataViewReply(query, layout);
		case 'pdf':
			return require("ae3/pdf").makeDataViewReply(query, layout);
		}
	}

	const options = layout.options;
	if(!options){
		throw new Error("Options are required!");
	}
	const optionCount = options.length;
	if(!optionCount){
		throw new Error("Options are empty!");
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = 'sequence';
	
	const filters = layout.filters;
	
	const element = layout.rootName || 'sequence';

	var xml = '';
	$output(xml){
		%><<%= element; %><%= Format.xmlAttributes(attributes); %>><%
			if(query){
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				if(context.rawHtmlHeadData){
					%><rawHeadData><%
						%><![CDATA[<%
							= context.rawHtmlHeadData;
						%>]]><%
					%></rawHeadData><%
				}
			}
			if(layout.prefix){
				= internOutputValue('prefix', layout.prefix);
			}
			if(filters && filters.fields){
				= Format.xmlElement('prefix', new FiltersFormLayout(filters));
			}
			%><sequence><%
				for(var item of layout.options){
					= internOutputValue('item', item);
				}
			%></sequence><%
			if(layout.commands){
				= Format.xmlElements('command', layout.commands);
			}else//
			if(layout.help && (!query || query.parameters.format !== 'clean')){
				= Format.xmlElement('help', { src : layout.help });
			}
			if(layout.suffix){
				= internOutputValue('suffix', layout.suffix);
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}
web.makeSequenceReply = makeSequenceReply;


/**
 * <code>
 * layout = {
 * -rootName : 'sequence',
 * 	options: [
 * 	],
 * 	commands: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeSelectViewReply(context, layout){
	const query = context && context.query;
	if(query && query.parameters.___output){
		switch(query.parameters.___output){
		case 'xml':
			return require("ae3/xml").makeDataFormReply(query, layout);
		case 'xls':
			return require("ae3/xls").makeDataViewReply(query, layout);
		case 'txt':
			return require("ae3/txt").makeDataViewReply(query, layout);
		case 'pdf':
			return require("ae3/pdf").makeDataViewReply(query, layout);
		}
	}

	const options = layout.options;
	if(!options){
		throw new Error("Options are required!");
	}
	const optionCount = options.length;
	if(!optionCount){
		throw new Error("Options are empty!");
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = 'select-view';
	
	const filters = layout.filters;
	
	const element = layout.rootName || 'sequence';

	var xml = '';
	$output(xml){
		%><<%= element; %><%= Format.xmlAttributes(attributes); %>><%
			if(query){
				= Format.xmlElement('client', context.share.clientElementProperties(context));
				if(context.rawHtmlHeadData){
					%><rawHeadData><%
						%><![CDATA[<%
							= context.rawHtmlHeadData;
						%>]]><%
					%></rawHeadData><%
				}
			}
			if(layout.value){
				%><value><% = Format.xmlNodeValue(layout.value); %></value><%
			}
			if(layout.prefix){
				= internOutputValue('prefix', layout.prefix);
			}
			if(filters && filters.fields){
				= Format.xmlElement('prefix', new FiltersFormLayout(filters));
			}
			for(var item of layout.options){
				= internOutputValue('option', item);
			}
			if(layout.commands){
				= Format.xmlElements('command', layout.commands);
			}else//
			if(layout.help && (!query || query.parameters.format !== 'clean')){
				= Format.xmlElement('help', { src : layout.help });
			}
			if(layout.suffix){
				= internOutputValue('suffix', layout.suffix);
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}
web.makeSelectViewReply = makeSelectViewReply;
