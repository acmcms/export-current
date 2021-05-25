function Ae3WebShare(){
	this.Share();
	return this;
}

function prepareHtmlTable(){
	var data = '';
	$output(data){
		%><script type="text/javascript" language="javascript" src="/!/skin/skin-standard-html/$files/jquery-1.8.3.min.js"></script><%
		%><script type="text/javascript" language="javascript" src="/resource/jquery.dataTables.min.js"></script><%
		%><script type="text/javascript"><%
			%>$(document).ready(function() {<%
				%>var l = $('#list');<%
				%>l.dataTable({<%
					%>sDom:'<"tbar-up"fripl<"ui-clear">>t',<%
					%>bProcessing:true,<%
					%>bFilter:true,<%
					%>bLengthChange:false,<%
					%>bPaginate:false,<%
					%>bSort:true,<%
				%>});<%
				%>l.parent().parent().parent().parent().prepend(l.parent().children('.tbar-up'));<%
			%>} );<%
		%></script><%
		%><style><%
			%>.dataTables_wrapper>.tbar-up{<%
				%>font-size: 90%;<%
				%>margin: 0;<%
			%>}<%
			%>.dataTables_wrapper>.tbar-up INPUT{<%
				%>font-size: 85%;<%
				%>line-height: 1em;<%
				%>padding: 0 0.2em;<%
			%>}<%
			%>.dataTables_processing, .dataTables_info, .dataTables_filter{<%
				%>display:inline-block;<%
			%>}<%
			%>.dataTables_info{<%
				%>float:right;<%
			%>}<%
		%></style><%
	}
	return data;
}


Ae3WebShare.prototype = Object.create(require('ae3.web/Share').prototype, {
	Ae3WebShare : {
		value : Ae3WebShare
	},
	authenticationProvider : {
		get : function authenticationProvider(){
			return require('./AE3');
		}
	},
	htmlTableHeadRaw : {
		value : prepareHtmlTable()
	},
	onHandle : {
		value : function onHandle(context) {
			return require('./wapi/Index').handle(context);
		}
	},
	toString : {
		value : function(){
			return "[Ae3WebShare]";
		}
	}
});


module.exports = new Ae3WebShare();
return;

Object.create(Object.prototype, {
	clientElement : {
		value : function clientElement(client, admin, query){
			props.time || query.parameters.__time && (props.time = { mode : query.parameters.__time, data : require('ae3.util/Time').timeControlData(query) });
			return lib.clientElement.call(this, props, admin, query);
		}
	}
});

