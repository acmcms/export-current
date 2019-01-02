// <%FORMAT: 'js' %>
window.Toolbar || (Toolbar = function(target, element, buttons){
		require("Utils.Event");
		this.target = target;
		this.element = element;
		this.keys = [];
		with(this){
			for(var i = 0; i < buttons.length; ++i){
				var div = document.createElement("div");
				var map = buttons[i];
				for(var j in map){
					div.setAttribute(j, map[j]);
				}
				keys.push(new ToolbarButton(div, element));
				target.appendChild(div);
			}
		}
	},
	Toolbar.prototype = {
		refresh : function(){
			with(this){
				for(var i = 0; i < keys.length; ++i){
					keys[i].refresh(element);
				}
			}
		}
	},
	window.ToolbarButton || (ToolbarButton = function(target, element){
			this.target = target;
			target.button = this;
			this.element = element;
			var cm = target.getAttribute("cm");
			var cName = target.getAttribute("cName");
			var cType = target.getAttribute("cType");
			var onEdit = target.getAttribute("onEdit");
			if (onEdit) {
				this.checkState = eval(onEdit);
			} else {
				switch (cType) {
				case TBCMD_DEC:
					this.checkState = function() {
						return Toolbar.checkDecCommandImpl( eval(cm), element );
					};
					break;
				case TBCMD_DOC:
					this.checkState = function() {
						return Toolbar.checkDocCommandImpl( cm, element );
					};
					break;
				default:
					this.checkState = function() {
						return OLE_TRISTATE_UNCHECKED;
					}
					break;
				}
			}
	
			this.Image = document.createElement("img");
			if(cName){
				this.Image.setAttribute("width", 21);
				this.Image.setAttribute("height", 20);
				this.Image.src = '/$files/toolbar/button.' + cName + '.gif';
				target.appendChild(this.Image);
			}
	
			target.title = ToolbarButton.prototype.CM_LANG[cName] || cName;
			
			target.onmouseover = function() {
				if (this.button.state)
					return;
				this.button.Image.className = 'ButtonOver';
			};
			
			target.onmouseout = function() {
				if (this.button.state)
					return;
				this.button.Image.className = '';
			};
	
			target.onmousedown = function() {
				if (this.button.state)
					return;
				this.button.Image.className = 'ButtonActive';
			};
			
			target.onmouseup = function() {
				if (this.button.state){
					return;
				}
				this.button.Image.className = '';
			};
		},
		ToolbarButton.prototype = {
			CM_LANG : {
				'undo'	: 'откатить',
				'redo'	: 'вернуть',
				'cut'	: 'вырезать'
			},
			setActive : function() {
				if (this.state == 'active'){
					return;
				}
				this.state = 'active';
				this.Image.className = 'ButtonActive';
			},
			setEnable : function() {
				if (this.state == ''){
					return;
				}
				this.state = '';
				this.Image.className = '';
			},
			setDisabled : function() {
				if (this.state == 'disabled'){
					return;
				}
				this.state = 'disabled';
				this.Image.className = 'ButtonDisabled';
			},
			refresh : function(){
				with(this){
					var state = checkState();
					target.style.display = state === null ? "none" : "";
					switch (state) {
					case OLE_TRISTATE_GRAY:
						setDisabled();
						break;
					case OLE_TRISTATE_UNCHECKED:
						setEnable();
						break;
					case OLE_TRISTATE_CHECKED:
						setActive();
						break;
					}
				}
			}
		},
	ToolbarButton),
	Toolbar.checkDecCommand = function() {
		var command = eval(this.cmEdit || this.cm);
		return Toolbar.checkDecCommandImpl(command, this.element);
	},
	Toolbar.checkDocCommand = function() {
		var command = this.cmEdit || this.cm;
		return Toolbar.checkDocCommandImpl(command, this.element);
	},
	Toolbar.checkDecCommandImpl = function(command, element) {
		var state = element.QueryStatus(command);
		switch (state) {
		case DECMDF_NOTSUPPORTED:
			return null;
		case DECMDF_NINCHED:
		case DECMDF_DISABLED:
			return OLE_TRISTATE_GRAY;
		case DECMDF_ENABLED:
			return OLE_TRISTATE_UNCHECKED;
		default:
			return OLE_TRISTATE_CHECKED;
		}
	},
	Toolbar.checkDocCommandImpl = function(command, element) {
		return (element.DOM && element.DOM.queryCommandValue(command)) ? 1 : 0;
	},
	Toolbar.checkTableBorders = function() {
		var obj = this.element;
		return obj.ShowBorders ? 1 : 0;
	},
	Toolbar.checkShowDetails = function() {
		var obj = this.element;
		return obj.ShowDetails ? 1 : 0;
	},
Toolbar) // <%/FORMAT%>