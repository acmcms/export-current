const LAYOUT_PROTOTYPE = {
	layout : "data-table",
	attributes : {
		cssId : "list",
		title : "AE3 VLIW VM Info: Processing Operations"
	},
	filters : {
		fields : [
			{
				id : "type",
				name : "type",
				title : "Event Type",
				type : "select",
				variant : "select",
				option : [
					{
						value : "real",
						icon : "tick",
						titleShort : "Real",
						title : "Vm Operations (excluding virtuals)"
					},
					{
						value : "virtual",
						icon : "stop",
						titleShort : "All",
						title : "Virtual Operations (only virtuals)"
					},
					{
						value : "all",
						icon : "stop",
						titleShort : "All",
						title : "All Operations (including virtuals)"
					},
				]
			},
			{
				id : "backwards",
				name : "backwards",
				title : "Backwards",
				type : "boolean",
			},
		]
	},
	columns : [
		{
			id : "grp",
			title : "GRP",
			type : "string"
		},
		{
			id : "od",
			title : "IDX",
			type : "number",
			variant : "integer"
		},
		{
			id : "op",
			title : "OPERATION",
			type : "string",
			extraClass : "code",
		},
		{
			id : "dt",
			title : "DETACHED",
			type : "string",
		},
		{
			id : "nt",
			title : "NATIVE",
			type : "string",
		},
		{
			id : "ia",
			title : "is relative address in constant?",
			titleShort : "relAddr?",
			type : "boolean",
			variant : "boolean"
		},
		{
			id : "ic",
			title : "is constant for given arguments (repeatable and no side-effects)?",
			titleShort : "constant?",
			type : "boolean",
			variant : "boolean"
		},
		{
			id : "rt",
			title : "RESULT",
			type : "string",
		},
		{
			id : "bt",
			title : "bits",
			type : "string",
			extraClass : "code",
		},
	]
};

function handleOperations(context){
	const layout = Object.create(LAYOUT_PROTOTYPE);
	const rows = layout.rows = [];
	
	const parameters = context.query.parameters;
	const type = parameters.type || "real";
	const all = type === "all";
	
	layout.filters = {
		fields : layout.filters.fields,
		values : {
			type : parameters.type
		}
	};
	
	const operations = [];
	if(type === "all" || type === "real" || type === "real-A1X"){
		operations.push({
			grp : "A00",
			ops : require("java.class/ru.myx.ae3.exec.OperationsA00"),
			pfx : "000",
			sfx : "???????xxxxxxxxxxxxxxxxxxxxFFHHH",
			opb : 4
		});
		operations.push({
			grp : "A01",
			ops : require("java.class/ru.myx.ae3.exec.OperationsA01"),
			pfx : "001",
			sfx : "???????xxxxxxxxxxxxxxxxxxxxFFHHH",
			opb : 4
		});
		operations.push({
			grp : "A10",
			ops : require("java.class/ru.myx.ae3.exec.OperationsA10"),
			pfx : "010",
			sfx : "???????aaaaaxxxxxxxxxxxxxxxFFHHH",
			opb : 4
		});
		operations.push({
			grp : "A11",
			ops : require("java.class/ru.myx.ae3.exec.OperationsA11"),
			pfx : "011",
			sfx : "?????aaaaaxxxxxxxxxxxxxxxxxFFHHH",
			opb : 2
		});
	}
	if(type === "all" || type === "real" || type === "real-A2X"){
		operations.push({
			grp : "A2X",
			ops : require("java.class/ru.myx.ae3.exec.OperationsA2X"),
			pfx : "10",
			sfx : "???????aaaaabbbbbxxxxxxxxxxFFHHH",
			opb : 5
		});
	}
	if(type === "all" || type === "real" || type === "real-A3X"){
		operations.push({
			grp : "A3X",
			ops : require("java.class/ru.myx.ae3.exec.OperationsA3X"),
			pfx : "11",
			sfx : "????aaaaabbbbbcccccxxxxxxxxFFHHH",
			opb : 2
		});
	}
	if(type === "all" || type === "virtual"){
		operations.push({
			grp : "S10",
			ops : require("java.class/ru.myx.ae3.exec.OperationsS10"),
			vrt : true
		});
		operations.push({
			grp : "S2X",
			ops : require("java.class/ru.myx.ae3.exec.OperationsS2X"),
			vrt : true
		});
		operations.push({
			grp : "S3X",
			ops : require("java.class/ru.myx.ae3.exec.OperationsS3X"),
			vrt : true
		});
	}
	
	function bto(g, o){
		if(g.vrt){
			return undefined;
		}
		return g.pfx + " " + o.ordinal().toString(2).padStart(g.opb, "0");
	}
	
	function btf(g, o){
		o = bto(g, o);
		if(o){
			// !o.length
			return o + " " + (g.sfx ? g.sfx.substring(g.opb + g.pfx.length) :  ("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".substring(0, 32 - g.opb - g.pfx.length)));
		}
		return o;
	}
	
	var group, operation;
	for(group of operations){
		for(operation of group.ops.values()){
			rows.push({ 
				grp : group.grp, 
				od : operation.ordinal(), 
				op : operation.toString(), 
				dt : String(operation.execDetachableResult && operation.execDetachableResult() !== operation && operation.execDetachableResult() || "") || undefined, 
				nt : String(operation.execNativeResult && operation.execNativeResult() !== operation && operation.execNativeResult() || "") || undefined,
				ia : operation.isRelativeAddressInConstant && operation.isRelativeAddressInConstant(),
				ic : operation.isConstantForArguments && operation.isConstantForArguments(),
				rt : String(operation.resultType || "") || undefined,
				bt : btf(group, operation)
			});
		}
	}

	return layout;
}


module.exports = handleOperations;