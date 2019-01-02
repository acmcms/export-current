<%CODE: "ACM.ECMA" %>

	//////////////////////////////////////////////////////////////
	// Values to be used for command execution
	//////////////////////////////////////////////////////////////
	
	// object who is hosting the commands
	var actor;
	// collection of the commands
	var commands;
	// form or null
	var form;

	//////////////////////////////////////////////////////////////
	// Lets get command source, list and form
	//////////////////////////////////////////////////////////////
	
	switch( Request.type ){
	case "quick":{
			actor = ControlAPI.getQuickActor();
			if( !actor ){
				return { 
					title : 'Error', 
					template : '500', 
					body : intl(
						en = "No quick commands available!",
						ru = "Быстрые команды недоступны!"
					) };
			}
			commands = actor.getCommands();
			Flags.back = Request.back;
			break;
		}
	case "node":{
			actor = ControlAPI.nodeForObject(Request.getSharedObject());
			Request.path && (actor = ControlAPI.childForPath(actor, Request.path));
			if( !actor ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) was not <%
					%>found while trying to execute a command.<%
				}
				return { title : 'Error', template : '500', body : body };
			}
			commands = actor.getCommands();
			Flags.back = Request.back;
			break;
		}
	case "tree_common":{
			actor = ControlAPI.getCommonActor( Request.path );
			if( !actor ){
				var body;
				$output( body ){
					%>Common tree container (path=<%= Request.path %>) was not <%
					%>found while trying to execute a command.<%
				}
				return { title : 'Error', template : '500', body : body };
			}
			commands = actor.getCommands();
			Flags.back = Request.back;
			break;
		}
	case "content":{
			actor = ControlAPI.nodeForObject(Request.getSharedObject());
			Request.path && (actor = ControlAPI.childForPath(actor, Request.path));
			if( !actor ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) was not <%
					%>found while trying to execute a command.<%
				}
				return { title : 'Error', template : '500', body : body };
			}
			commands = actor.getContentCommands( Request.key );
			Flags.back = Request.back;
			break;
		}
	case "content_multi":{
			actor = ControlAPI.nodeForObject(Request.getSharedObject());
			Request.path && (actor = ControlAPI.childForPath(actor, Request.path));
			if( !actor ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) was not <%
					%>found while trying to execute a command.<%
				}
				return { title : 'Error', template : '500', body : body };
			}
			commands = actor.getContentMultipleCommands( Array(Request.content) );
			Flags.back = Request.back;
			break;
		}
	case "node_form":{
			if( Request.back ){
				return Request.replyRedirect("form.htm?"+Request.getParameterString(), false);
			}
			if( Request.close !== undefined ){
				return Request.replyRedirect(Request.back, false);
			}
			Flags.back = Request['return'];
			var node = ControlAPI.nodeForObject(Request.getSharedObject());
			Request.path && (node = ControlAPI.childForPath(node, Request.path));
			if( !node ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) was not <%
					%>found while trying to execute a command.<%
				}
				return { title : 'Error', template : '500', body : body };
			}
			var forms = node.getForms();
			if( !forms ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) has no forms. <%
				}
				return { title : 'Error', template : '500', body : body };
			}
			var form = forms.getByKey( Request.form );
			if( !form ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) has no form '<%= Request.form %>'. <%
				}
				return { title : 'Error', template : '500', body : body };
			}
			actor = node.getCommandResult(form, null);
			if( !actor ){
				var body;
				$output( body ){
					%>Node (path=<%= Request.path %>) declines to provide a form '<%= Request.form %>'. <%
				}
				return { title : 'Error', template : '500', body : body };
			}
			commands = actor.getCommands();
			form = actor;
			break;
		}
	case "form":{
			if( !Session[Request.id] ){
				return { 
							title : 'Error',
							template : '500', 
							body : intl(
								en = "No form available, please retry!",
								ru = "Форма недоступна, возможно истекла сессия, попробуйте снова!"
						) };
			}
			if( Request.back && !Request.id ){
				return Request.replyRedirect( "form.htm?"+Request.getParameterString(), false );
			}
			actor = Session[Request.id].data;
			Flags.back = Session[Request.id].back;
			if( Request.close !== undefined ){
				if( actor.attributes.on_close ){
					var result = actor.getCommandResult(actor.attributes.on_close, null);
					if( ControlAPI.isForm(result) ){
						Session[Request.id].data = result;
						return Request.replyRedirect( "form.htm?"+Request.getParameterString(), false );
					}
					if( result ){
						Session.getParameters().remove( Request.id );
						if( ControlAPI.isUrl( result ) ){
							var body;
							$output( body ){
								%><a target="_blank" href="<%= encodeURI( result ) %>"><%= StringToHtml( result ) %></a><%
							}
							return { title : 'Location', template : 'simple-html-message', body : body };
						}
						return { title : 'Message', template : 'simple-html-message', body : StringToHtml( result ) };
					}
				}
				Session.getParameters().remove( Request.id );
				return Request.replyRedirect( Flags.back, false );
			}
			Session[Request.id].remove('errors');
			commands = actor.getCommands();
			form = actor;
			break;
		}
	case 'content-menu':{
			
			break;
		}
	default:{
			var body;
			$output( body ){
				%>Unknown command type: <%= Request.type %>.<%
			}
			return { title : 'Error', template : '500', body : body };
		}
	}

	//////////////////////////////////////////////////////////////
	//
	//////////////////////////////////////////////////////////////

	// this will be the arguments for a command
	var parameters = {};

	if( form ){
		var fieldset = form.fieldset;
		fieldset && fieldset.dataRetrieve( form.getData(), parameters );
	}
	
	var formCommandName;
	var requestParameters = Request.getParameters();
	var commandName = requestParameters.command;

	var debug = 'debug:';

	function buildParameters( parameters, request, catchesDone ){
		debug += ' 0 ';
		for keys( var keyName in request ){
			debug += ' 1 ' + keyName;
			keyName.startsWith("set_") && (parameters[ keyName.substring(4) ] = []);
			keyName.startsWith("boolean_") && (parameters[ keyName.substring(8) ] = false);
			if( keyName.startsWith("tomap_") ){
				keyName = keyName.substring(6);
				var mapName = keyName.substring(0, keyName.indexOf('___'));
				parameters[ mapName ] || (parameters[ mapName ] = {});
				var catchPrefix = "tomap_" + mapName + "___";
				if( !catchesDone[catchPrefix] ){
					var newRequest = {};
					for keys( var parameter in request ){
						parameter.startsWith(catchPrefix) 
										&& (newRequest[ parameter.substring(catchPrefix.length()) ] = request[parameter]);
					}
					catchesDone[ catchPrefix ] = true;
					buildParameters( parameters = parameters[mapName], request = newRequest, catchesDone = catchesDone );
				}
			}
			if( keyName.startsWith("tomapfield_") ){
				keyName = keyName.substring(11);
				var mapName = keyName.substring(0, keyName.indexOf('___'));
				parameters[ mapName ] || (parameters[ mapName ] = {});
				keyName = keyName.substring(Current.indexOf('___') + 3);
				var mapKey = keyName.substring(0, keyName.indexOf('___'));
				parameters[ mapName ][ mapKey ] || (parameters[ mapName ][ mapKey ] = {});
				var catchPrefix = "tomapfield_" + mapName + "___" + mapKey + "___";
				if( !catchesDone.containsKey(catchPrefix) ){
					var newRequest = {};
					for keys( var parameter in request ){
						parameter.startsWith(catchPrefix) 
										&& (newRequest[ parameter.substring(catchPrefix.length()) ] = request[parameter]);
					}
					catchesDone[ catchPrefix ] = true;
					buildParameters( parameters = parameters[mapName][mapKey], request = newRequest, catchesDone = catchesDone );
				}
			}
		}
		for keys( var keyName in request ){
			debug += ' 2 ' + keyName;
			keyName.startsWith("formcmd_") && (formCommandName = keyName.substring(8));
			keyName.startsWith("cmd_") && (commandName = keyName.substring(4));
			keyName.startsWith("__") && (parameters[ keyName.substring(2) ] = request[ keyName ]);
			keyName.startsWith("toset__") && (parameters[ keyName.substring(7) ].addAll( Array( request[ keyName ] ) ));
		}
	}
	
	buildParameters( parameters, requestParameters, {} );

	if( formCommandName ){
		form.setData(parameters);
		var guid;
		if( Request.type == 'form' ){
			guid = Request.id;
		}else{
			guid = Create.guid();
			Session[guid] = { guid : guid, data : actor, back : Flags.back };
		}
		var formCommandData = '';
		var pos = formCommandName.indexOf('_');
		if( pos != -1 ){
			formCommandData = formCommandName.substring(pos+1);
			formCommandName = formCommandName.substring(0,pos);
		}
		return Request.replyRedirect( 'execute-command.htm?type=form&id='+guid+'&command='+formCommandName+'&data='+formCommandData, false );
	}

	if( !commands ){
		return { 
			title : 'Error', 
			template : '500', 
			body : intl( en = "No commands available.", ru = "Нет доступных команд." ) 
		};
	}
	
	// command to execute
	var command = commands.getByKey( commandName );
	if( !command ){
		var body;
		$output( body ){
			= intl(
				en = "Parameters",
				ru = "Параметры"
			);
			%>: <pre style="text-align: left"><%= Format.xmlNodeValue( Format.jsObjectReadable( requestParameters ) ) %></pre><%
			%><hr><%
			= intl(
				en = "Internal",
				ru = "Внутренности"
			);
			%>: <pre style="text-align: left"><%= Format.xmlNodeValue( Format.jsObjectReadable( parameters ) ) %></pre><%
			%><hr><%
			= intl(
				en = "Debug",
				ru = "Дебаг"
			);
			%>: <pre style="text-align: left"><%= Format.xmlNodeValue( Format.jsStringFragment( debug ) ) %></pre><%
			%><hr><%
			= intl(
				en = "Unknown command",
				ru = "Неизвестная команда"
			);
			%>: &quot;<b><%= Format.xmlNodeValue( Format.jsStringFragment(commandName) ) %></b>&quot;.<%
		}
		return { title : 'Error', template : '500', body : body };
	}
	
	try{
		// validate parameters if form available
		if( form ){
			var fieldset = form.fieldset;
			if( fieldset ){
				var errors = fieldset.dataValidate(parameters);
				if( Object.isFilled(errors) ){
					form.setData(parameters);
					Session[Request.id].errors = errors;
					return Request.replyRedirect( "form.htm?"+Request.getParameterString(), false );
				}
				fieldset.dataStore(parameters, parameters);
			}
			form.setData(parameters);
		}
		// execute
		var result = actor.getCommandResult(command, parameters);
		if( ControlAPI.isForm(result) ){
			if( result.attributes.path ){
				if( Request.type == 'form' ){
					Session[Request.id].data = result;
					return Request.replyRedirect('form.htm?type=form&id='+Request.id, false);
				}
			}else{
				switch(Request.type){
				case "form":
					result.attributes.path = Session[Request.id].data.attributes.path;
					Session[Request.id].data = result;
					return Request.replyRedirect('form.htm?type=form&id='+Request.id, false);
				case "node":
				case "tree_common":
				case "content":
				case "content_multi":
				case "node_form":
					result.attributes.path = Request.path;
				}
			}
			var guid = Create.guid();
			Session[guid] = { 
				guid : guid, 
				data : result, 
				back : Flags.back 
			};
			return Request.replyRedirect( 'form.htm?type=form&id='+guid+'&back='+encodeURIComponent(Flags.back), false );
		}

		(Request.type == 'form') && Session.getParameters().remove(Request.id);

		if( ControlAPI.isUrl( result ) ){
			var body;
			$output( body ){
				%><a id=targetlink target=_blank href="<%= encodeURI( result ) %>"><%= StringToHtml( result ) %></a><%
				%><script><%
					%>document.getElementById('targetlink').click();<%
					%>document.location.replace('<%= Flags.back %>');<%
				%></script><%
			}
			return { 
				title : intl(en = "Location", ru = "Адрес"),
				template : 'simple-html-message',
				body : body 
			};
		}
		if( result ){
			return {
				title : intl(en = "Message", ru = "Сообщение"),
				template : 'simple-html-message',
				body : StringToHtml( result ) 
			};
		}
		return Request.replyRedirect( Flags.back, false );
	}catch(exception){
		var body;
		$output( body ){
			= intl(
				en = "Unexpected error while executing a command.",
				ru = "Произошла ошибка выполнения команды."
			);
			%><hr><center><%
			%><textarea wrap=off rows=15 cols=80><%
				= Format.throwableAsPlainText(exception);
			%></textarea><%
			%></center><%
			if( Request.type == 'form' ){
				Flags.back = null;
				%><table align=center><%
				%><form action="execute.htm?<%= Request.getParameterString() %>" method=post><%
				%><tr><%
				%><td colspan=2 align=right><%
					%><input type=submit name=back value="<%= intl(en = "Back", ru = "Назад") %>...">&nbsp;<%
					%><input type=submit name=close value="<%= intl(en = "Close", ru = "Закрыть") %>"><%
				%></td><%
				%></tr><%
				%></form><%
				%></table><%
			}
		}
		return { title : intl(en = 'Unexpected error', ru = 'Случилось непредвиденное'), template : '500', body : body };
	}
<%/CODE%>