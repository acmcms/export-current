const RemoteServiceStateSAPI = require("java.class/ru.myx.ae3.state.RemoteServiceStateSAPI");

const SUPPORTED_RRST = {
	"1000" : {
		"name" : "authToken",
		"description" : "Supply Authentication Token."
	},
	"1011" : {
		"name" : "queryDetail",
		"description" : "Supply Debug Detail in Request."
	},
	"1081" : {
		"name" : "proxyAlias",
		"description" : "Supply Destination Alias for the Proxy."
	},
	"1000" : {
		"name" : "authToken",
		"description" : "Supply Authentication Token (hex)."
	},
	"2000" : {
		"name" : "protoLevelInt",
		"description" : "Read Support RRST/RSST Protocol Version."
	},
	"3000" : {
		"name" : "statusFlagsInt",
		"description" : "Read Cloud Client Status Flags."
	},
	"3001" : {
		"name" : "deviceModeInt",
		"description" : "Read Device Operation Mode."
	},
	"3002" : {
		"name" : "weightedLoad",
		"description" : "Read Weighted Load. 0..9999 -> 0-100%."
	},
	"4004" : {
		"name" : "modelNameString",
		"description" : "Read Device Model Name.",
	},
	"4005" : {
		"name" : "authRealm",
		"description" : "Read Authentication Realm.",
	},
	"4011" : {
		"name" : "replyDetail",
		"description" : "Include Debug Detail in Reply."
	},
	"4087" : {
		"name" : "uptime",
		"description" : "Read Current Service Uptime, seconds."
	},
	"5100" : {
		"name" : "versionExactString",
		"description" : "Read Full Device Version String."
	},
	"5101" : {
		"name" : "managementUrl",
		"description" : "Read Management Interface URL."
	},
	"5102" : {
		"name" : "uptimeSecondsString",
		"description" : "Read Current Host Uptime, seconds."
	},
	"5103" : {
		"name" : "friendlyName",
		"description" : "Read Friendly Device Name."
	},
	"5104" : {
		"name" : "uhpTokenAlias",
		"description" : "Read Full Cloud Token Alias."
	},
};

const RRST_PRESETS = {
	"all-codes" : {
		"title" : "Select All Codes",
		"value" : Object.keys(SUPPORTED_RRST)
	},
	"cpe-login" : {
		"title" : "Device Login Information",
		"value" : "2001;2002;4001;4005;4011".split(';')
	},
	"ndns-state" : {
		"title" : "NDNS Satellite Server Status",
		"value" : "2083;2084;2086;2087;2088;4000;4001;4082;4083;4084;4085;4087".split(';')
	}
};

{
	let c, t, k, p;
	for(c of Object.keys(SUPPORTED_RRST)){
		t = SUPPORTED_RRST[c];
		t.preset || (t.preset = []);
	}
	for(k of Object.keys(RRST_PRESETS)){
		p = RRST_PRESETS[k];
		for(c of p.value){
			t = SUPPORTED_RRST[c];
			t && t.preset.push(k);
		}
	}
}

const RemoteServiceStateUi = module.exports = require("ae3").Class.create(
	"RemoteServiceStateUi",
	undefined,
	function(){
		throw new Error("Not instantiable!");
	},
	{
	},
	{
		parseQueryFromParameters : {
			value : function(parameters, parameterName){
				parameterName || (parameterName = "query");
				switch(parameters[parameterName + "V"] || 1){
				case '1':
					return RemoteServiceStateSAPI.parseQuery(parameters[parameterName + "Text"] || parameters[parameterName]);
					
				case '2': {
						const presetName = parameters[parameterName + "Preset"];
						if(!presetName){
							return undefined;
						}
						if(presetName === 'all-codes'){
							parameters[parameterName + "V"] = "3";
							return undefined;
						}
						const preset = RRST_PRESETS[presetName];
						if(!preset){
							return {
								code : 400,
								error : "Unknown preset: " + presetName
							};
						}

						if(preset.value.some(function(x){
							return x && (x[0] === '1');
						})){
							parameters[parameterName + "V"] = "3";
							return undefined;
						}
						
						return RemoteServiceStateSAPI.parseQuery(preset.value);
					}
					
				case '3': {
					const queryItems = parameters[parameterName + "Item"];
					if(!queryItems){
						return undefined;
					}
					return RemoteServiceStateSAPI.parseQuery(
						Array(queryItems).map(function(x){
							if(x[0] === '1'){
								return x + ':' + parameters[parameterName + "Item" + x];
							}
							return x;
						}).join(';')
					);
				}
					
				default:
					return undefined;
				}
			}
		},
		makeQueryPresetSelectField : {
			value : function(parameters, parameterName){
				parameterName || (parameterName = "query");
				const presetOptions = Object.keys(RRST_PRESETS).map(function(key){
					const type = RRST_PRESETS[key];
					return {
						value : key,
						title : type.title,
						queryText : type.value.join(';')
					};
				});
				return {
					id : parameterName + "Preset",
					name : parameterName + "Preset",
					title : "Preset",
					type : "select",
					variant : "select",
					selected : parameters[parameterName + "Preset"],
					list : {
						columns : [
							{
								id : "value",
								title : "Name",
								type : "string"
							},
							{
								id : "queryText",
								title : "Query Text",
								type : "string"
							}
						],
						rowCommands : [
							{
								title : 'Customise...',
								icon : 'vcard',
								prefix : "?" + Format.queryStringParameters(parameters, {
									queryV : "1"
								}) + "&queryText=",
								field : "queryText"
							}
						],
						rows : presetOptions,
					},
					options : presetOptions
				};
			}
		},
		makeQueryItemsSetSelectField : {
			value : function(parameters, parameterName){
				parameterName || (parameterName = "query");
				const selectPreset = parameters[parameterName + "Preset"];
				const queryItems = Array(parameters[parameterName + "Item"] || []);
				const itemOptions = Object.keys(SUPPORTED_RRST).map(function(key){
					const type = SUPPORTED_RRST[key];
					return {
						value : key,
						title : type.name + ", " + type.description,
						hl : type.hidden ? 'error' : (type.priority !== 'normal'),
						
						code : key,
						name : type.name,
						group : type.group,
						preset : Array(type.preset).join(','),
						version : type.version || "1",
						selected : queryItems.includes(key) || selectPreset && (selectPreset === 'all-codes' || Array(type.preset).includes(selectPreset)) || undefined,
						description : (Array(type.description || 'N/A')),
						field : {
							type : key[0] === '1' ? "string" : "hidden",
							name : parameterName + "Item" + key,
							size : 32,
							required : false,
							value : parameters[parameterName + "Item" + key]
						}
					};
				});
				return {
					name : parameterName + "Item",
					title : 'Query Items',
					type : 'set',
					variant : 'select',
					selected : selectPreset ? "selected" : '*',
					list : {
						columns : [
							{
								id : 'code',
								title : 'Code',
								type : 'string'
							},
							{
								id : 'name',
								title : 'Name',
								type : 'string'
							},
							/*
							{
								id : 'group',
								title : 'Group',
								type : 'string'
							},
							{
								id : 'version',
								title : 'Version',
								type : 'string'
							},
							{
								id : 'preset',
								title : 'Preset',
								type : 'string',
								variant : 'split-list',
								separator : ','
							},
							*/
							{
								id : '.',
								title : 'Description',
								variant : 'rows',
								elementName : 'description',
								itemCssClass : 'ui-paragraph'
							},
							{
								id : '.',
								title : 'Input',
								variant : 'edit',
								zoom : "document"
							}
						],
						rows : itemOptions
					},
					options : itemOptions
				};
			}
		},
		makeQueryField : {
			value : function(parameters, parameterName, request){
				parameterName || (parameterName = "query");
				const fieldPresetSelect = this.makeQueryPresetSelectField(parameters, parameterName);
				const fieldItemsSetSelect = this.makeQueryItemsSetSelectField(parameters, parameterName);
				const v = parameters[parameterName + "V"] || 0;
				return {
					name : parameterName + "V",
					type : "select",
					variant : "edit",
					value : v,
					zoom : 'document',
					options : [
						{
							value : '1',
							title : 'Enter query description in text string format',
							fields : [
								{
									name : '--ui-user-auth',
									type : 'hidden',
									value : 'true'
								},
								{
									name : parameterName + "Text",
									title : 'Query Text',
									required : false,
									hint : "Example: 1101:Test Debug Message;4004;4005",
									value : request 
										? request.formatAsTextString()
										: parameters[parameterName + "Text"] || '' 
								}
							],
						},
						{
							value : '2',
							title : 'Select preset query from list',
							fields : [
								fieldPresetSelect
							],
						},
						{
							value : '3',
							title : 'Build query yourself selecting query items',
							fields : [
								fieldItemsSetSelect
							],
						},
					]
				};
			}
		}
	}
);