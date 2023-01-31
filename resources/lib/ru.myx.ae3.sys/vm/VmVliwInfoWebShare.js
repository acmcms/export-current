
function handleArguments(context){
	const enum = require("java.class/ru.myx.ae3.exec.ModifierArguments");

	const layout = {
		layout : "data-table",
		attributes : {
			cssId : "list",
			title : "AE3 VLIW VM Info: Operation Argument Specifiers"
		},
		columns : [
			{
				id : "od",
				title : "IDX",
				type : "number",
				variant : "integer"
			},
			{
				id : "ag",
				title : "Argument Modifier",
				type : "string",
				extraClass : "code",
			},
			{
				id : "an",
				title : "Notation",
				type : "string",
			},
			{
				id : "sr",
				title : "Stack Read",
				type : "number",
				variant : "integer"
			},
			{
				id : "sw",
				title : "Stack Write",
				type : "number",
				variant : "integer"
			},
			{
				id : "cv",
				title : "Constant Value",
				type : "string",
			},
		],
		rows : enum.values().map(function(argument){
			return { 
				od : argument.ordinal(), 
				ag : String( argument ), 
				an : argument.argumentNotation(), 
				sr : argument.argumentStackRead(), 
				sw : argument.argumentStackWrite(), 
				cv : enum.isConstantValue(argument) ? Format.jsObject(argument.argumentConstantValue()) : undefined, 
			};
		})
	};
	
	return layout;
}


function handleRegisters(context){
	const enum = require("java.class/ru.myx.ae3.exec.ModifierRegister");

	const layout = {
		layout : "data-table",
		attributes : {
			cssId : "list",
			title : "AE3 VLIW VM Info: Context (Thread) Registers"
		},
		columns : [
			{
				id : "od",
				title : "IDX",
				type : "number",
				variant : "integer"
			},
			{
				id : "rg",
				title : "Register",
				type : "string",
				extraClass : "code",
			},
			{
				id : "ii",
				title : "isInt?",
				type : "boolean",
				variant : "boolean"
			},
			{
				id : "io",
				title : "isObj?",
				type : "boolean",
				variant : "boolean"
			},
		],
		rows : enum.values().map(function(register){
			return { 
				od : register.ordinal(), 
				rg : String( register ), 
				ii : register.isInteger(), 
				io : !register.isInteger(), 
			};
		})
	};
	
	return layout;
}



function handleStoreTargets(context){
	const enum = require("java.class/ru.myx.ae3.exec.ResultHandler$DirectTransport");
	
	const layout = {
		layout : "data-table",
		attributes : {
			cssId : "list",
			title : "AE3 VLIW VM Info: Instruction DirectTransport Store Targets"
		},
		columns : [
			{
				id : "od",
				title : "IDX",
				type : "number",
				variant : "integer"
			},
			{
				id : "st",
				title : "Store",
				type : "string",
				extraClass : "code",
			},
			{
				id : "ip",
				title : "isStack?",
				type : "boolean",
				variant : "boolean"
			},
		],
		rows : enum.values().map(function(store){
			store = store;
			return { 
				od : store.ordinal(), 
				st : String( store.handlerForStoreNext() ), 
				ip : store.handlerForStoreNext().isStackPush(), 
			};
		})
	};
	return layout;
}



function handleResultStateCodes(context){
	const enum = require("java.class/ru.myx.ae3.exec.ExecStateCode");

	const layout = {
		layout : "data-table",
		attributes : {
			cssId : "list",
			title : "AE3 VLIW VM Info: Execution Result State Codes"
		},
		columns : [
			{
				id : "od",
				title : "IDX",
				type : "number",
				variant : "integer"
			},
			{
				id : "cd",
				title : "Code",
				type : "string",
				extraClass : "code",
			},
			{
				id : "iee",
				title : "isExecExit?",
				type : "boolean",
				variant : "boolean"
			},
			{
				id : "ien",
				title : "isExecNext?",
				type : "boolean",
				variant : "boolean"
			},
			{
				id : "icr",
				title : "isCallReturn?",
				type : "boolean",
				variant : "boolean"
			},
		],
		rows : enum.values().map(function(code){
			return { 
				od : code.ordinal(), 
				cd : String( code ),
				iee : code.isExecutionExit(),
				ien : code.isExecutionNext(),
				icr : code.isValidForCall(),
			};
		})
	};
	
	return layout;
}


module.exports = require("ae3.web/IndexPage").create({
	title : "AE3::developer/vm-vliw (AE3 VLIW VM Detail)", 
	commands : {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "AE3 VLIW VM Detail",
			run : Index,
			access : "public",
		},
		"../":{
			icon : "application_get",
			title : "Parent index menu",
			access : "public",
			ui : true,
		},
		operations:{
			icon : "help",
			title : "Processing Operations",
			run : [ require, "./VmOperations" ],
			access : "public",
			ui : true
		},
		arguments:{
			icon : "help",
			title : "Operation Argument Specifiers",
			run : handleArguments,
			access : "public",
			ui : true,
			preview : {
				depthLimit : 1,
				variant : "document-url",
				src : "arguments?type=all"
			}
		},
		/**<code>
		registers:{
			icon : "key",
			title : "Context (Thread) Registers",
			run : handleRegisters,
			access : "public",
			ui : true,
			preview : {
				depthLimit : 1,
				variant : "document-url",
				src : "registers?type=all"
			}
		},
		</code>*/
		stores:{
			icon : "folder_key",
			title : "Instruction Store Targets",
			run : handleStoreTargets,
			access : "public",
			ui : true,
			preview : {
				depthLimit : 1,
				variant : "document-url",
				src : "stores?type=all"
			}
		},
		results:{
			icon : "help",
			title : "Execution Result States",
			run : handleResultStateCodes,
			access : "public",
			ui : true,
			preview : {
				depthLimit : 1,
				variant : "document-url",
				src : "results?type=all"
			}
		},
		"/!/skin/skin-developer-tools/try-ae3.bytecode.htm" : {
			icon : "bullet_go",
			title : "AE3 Byte Code Preview, try-it-yourself demo",
			access : "public",
			ui : true,
		},
	}
});
