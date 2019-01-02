<%CODE: 'ACM.ECMA' %>
	// owner & fieldset as result of execution
	var owner;
	
	switch( Request.type ){
	case 'node':
		owner = ControlAPI.nodeForObject(Request.getSharedObject());
		fieldset = null;
		Request.path && (owner = ControlAPI.childForPath(owner, Request.path));
		break;

	case 'node_form':{
		var node = ControlAPI.nodeForObject(Request.getSharedObject());
		Request.path && (node = ControlAPI.childForPath(node, Request.path));
		if( !node ){
			$output( body ){
				%>Node (path=<%= Request.path %>) was not <%
				%>found while trying to execute a command.<%
			}
			return { title : 'Error', template : '500', body : body };
		}
		var forms = node.getForms() %><%
		if( !forms ){
			$output( body ){
				%>Node (path=<%= Request.path %>) has no forms.<%
			}
			return { title : 'Error', template : '500', body : body };
		}
		var form = forms.getByKey( Request.form );
		if( !form ){
			$output( body ){
				%>Node (path=<%= Request.path %>) has no form '<%= Request.form %>'.<% 
			}
			return { title : 'Error', template : '500', body : body };
		}
		owner = node.getCommandResult(form, null);
		fieldset = owner.fieldset;
		break;
	}

	case 'form':{
		var session_form = Session[Request.id];
		if( !session_form ){
			$output( body ){
				%>No form available, please retry.<%
			}
			return { title : 'Error', template : '500', body : body };
		}
		owner = session_form.data;
		fieldset = owner.fieldset;
		break;
	}

	default:
		$output( body ){
			%>Unknown owner type: <%= Request.type %>.<%
		}
		return { title : 'Error', template : '500', body : body };
	}
	
	var data = owner.getData();
	var fieldname = Request.fieldname;
	Request.frommap && (data = data[ Request.frommap ]);
	if( Request.fromlist ){
		var list = owner[ Request.fromlist ];
		data = {};
		fieldname = 'object';
		data[ fieldname ] = list[ Integer(Request.index) ];
	}
	
	Request.fromdata && (data[ fieldname ] = data[ fieldname ][ Request.fromdata ]);
	
	if( (type = data[ fieldname + "_contenttype" ]) ){
		var attributes = {};
		attributes['Content-Type'] = type;
		var name = data[ fieldname + "_contentname" ];
		name && !Request.preview && (attributes['Content-Disposition'] = 'attachment; filename="'+name+'"');
		return Request.replyBinary(data[ fieldname ], attributes);
	}
	
	return Request.replyBinary(data[ fieldname ], null);
<%/CODE%>