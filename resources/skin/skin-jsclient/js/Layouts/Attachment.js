// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Attachment || (parent.Layouts && (Layouts.Attachment = parent.Layouts.Attachment)) || (
	// v 0.3b
	//
	//	-= MyX =-
	//
	//	Usage:
	//		var attachment = new Layouts.Attachment( container, definition );
	//
	//	attachment : extends Layouts.Layout {
	//		attachment	: attached container
	//	}
	//
	//	definition : {
	//		layout		: "attachment"
	//		side		: "north" || "east" || "south" || "west" || "top" || "right" || "bottom" || "left"
	//		size		: (0 || undefined || false) || pixelSize
	//		spacing		: undefined || false || true
	//		decoration	: undefined || false || true
	//		cookie		: parameter name for persistence
	//		attachment	: definition
	//		content		: definition
	//	}
	
Layouts.Attachment = function(target, def){
	if(!arguments.length){
		return;
	}
	
	this.attachment = null;
	with(this){
		init1_target(target, extend(def, null), "attachment");
		init2_layers();
		init3_finish();
	}
},
Layouts.Attachment.prototype = new ((window.Layouts && (Layouts.Container || (window.require && require("Layouts.Container")))) || function(){})(),
Layouts.Attachment.prototype.putAll({
	side		: null, // string with 'west', 'north', 'east' or 'south'
	size		: null,
	spacing		: null,
	space		: null,
	spacer		: null,
	decoration	: null,
	real		: null,
	panel		: null,
	attachment	: null,
	prevSide	: null,
	prevZoom	: null,
	prevSize	: null,
	prevSpacing	: null,
	prevDecor	: null,
	
	invalidate : function(sender){
		this.target.invalidate && this.target.invalidate();
	},
	onAfterRebuild : function(sender){
		with(this){
			var update = false;
			this.side = definition.side || "south";
			this.size = definition.size || 0;
			this.spacing = definition.spacing;
			this.decoration = definition.decoration;
			var vertical = side == "east" || side == "west";
			var screen = zoom == zoom_screen || 
							(zoom == zoom_column && vertical) ||
							(zoom == zoom_row && !vertical);
//			alert(">>> screen=" + screen + ", zoom=" + zoom + ", vertical=" + vertical + ", sender=" + sender);
			if(side != prevSide || zoom != prevZoom || spacing !== prevSpacing || decoration !== prevDecor || sender === null){
				update = true;
				this.prevSide = side;
				this.prevZoom = zoom;
				this.prevSpacing = spacing;
				this.prevDecor = decoration;
				if(screen){
					// create absolute divs filling the screen
					this.panel = document.createElement("ui-attach-screen-attachment");
					panel.style[side == "east"
								? "right"
								: "left"] = "0";
					panel.style[side == "south"
								? "bottom"
								: "top"] = "0";
					panel.style[vertical
								? "height"
								: "width"] = "100%";
					plane.appendChild(panel);
					this.space = document.createElement("table");
					space.className = "ui-attach-screen-spacer-table";
					space.style[side == "east"
								? "right"
								: "left"] = "0";
					space.style[side == "south"
								? "bottom"
								: "top"] = "0";
					space.style[vertical
								? "height"
								: "width"] = "100%";
					space.style[vertical
								? "width"
								: "height"] = "0";
					plane.appendChild(space);
				}else{
					// create table
					var table = document.createElement("table");
					table.cellPadding = 0;
					table.cellSpacing = 0;
					table.className = "ui-attach-table ui-attach-table-" + zoom;
					var row = table.insertRow(-1);
					var cell = row.insertCell(-1);
					cell.className = "ui-attach-cell";
					this.space = (vertical 
									? row.insertCell(side == "east"
														? -1
														: 0)
									: table.insertRow(side == "south"
														? -1
														: 0).insertCell(-1)).appendChild(document.createElement("table"));
					space.parentNode.className = "ui-attach-spacer-container";
					this.panel = vertical 
									? row.insertCell(side == "east"
														? -1
														: 0)
									: table.insertRow(side == "south"
														? -1
														: 0).insertCell(-1);
					panel.className = "ui-attach-panel";
					inner.appendChild(table);
					cell.component = this;
					inner = cell;
				}
				panel.component = this;
				space.cellPadding = 0;
				space.cellSpacing = 0;
				this.spacer = space.insertRow(-1).insertCell(-1);
				spacer.className = (spacing === undefined 
									? "ui-attach-spacer ui-spacer-default" 
									: spacing 
										? "ui-attach-spacer ui-spacer" 
										: "ui-attach-spacer-hidden");
				attachment 
					? (
						attachment.attachTo(panel),
						space.appendChild(spacer)
					)
					: (
						this.attachment = new Layouts.Layout(
							panel,
							size
								? definition.attachment || {layout:"attach-fixed"}
								: {
									layout : "attach-grow",
									zoom : vertical 
												? zoom == zoom_screen
													? "column"
													: "compact"
												: zoom == zoom_screen
													? "row"
													: "compact",
									content : definition.attachment
								}
						),
						attachment.attachment = this
					);
				this.setClassName(decoration === undefined 
								? "ui-attachment-outer-default" 
								: decoration 
									? "ui-attachment-outer-decorated" 
									: "ui-attachment-outer-normal");
				attachment.setClassName(decoration === undefined 
											? "ui-attachment-inner-default" 
											: decoration 
												? "ui-attachment-inner-decorated" 
												: "ui-attachment-inner-normal");
				///////////////////////////////////////////
				// size is unknown from first attempt %-(
				screen && spacing !== false && setTimeout(function(){
					attachment.attachment.rebuild(attachment.attachment);
				},0);
			}

			if(attachment) for(var reference = attachment.inner, left = 5;;left--){
				var panelWidth = Math.max(size, reference.scrollWidth, reference.offsetWidth, reference.clientWidth),
					panelHeight = Math.max(size, reference.scrollHeight, reference.offsetHeight, reference.clientHeight),
					panelSize = vertical
									? panelWidth
									: panelHeight;

				var spacerHeight = 0, spacerWidth = 0, spacerSize = 0;
				if(spacing === false){
					space.style.display = "none";
				}else{
					space.style.display = "";
					spacerWidth = Math.max(space.offsetWidth, space.scrollWidth, space.clientWidth, spacer.offsetWidth);
					spacerHeight = Math.max(space.offsetHeight, space.scrollHeight, space.clientHeight, spacer.offsetHeight);
					spacerSize = vertical
								? spacerWidth
								: spacerHeight;
				}

				var maxSize = panelSize + spacerSize;

				if((this.real = (size ? size + spacerSize : maxSize)) === prevSize){
					break;
				}
				update = true;
				if(spacing !== false){
					screen && (vertical 
								? (space.style[side == "east"
													? "right"
													: "left"] = panelWidth + "px")
								: (space.style[side == "south"
													? "bottom"
													: "top"] = panelHeight + "px"));
//					vertical
//						? space.scrollWidth != space.clientWidth && (space.style.width = space.offsetWidth + space.scrollWidth - space.clientWidth)
//						: space.scrollHeight != space.clientHeight && (space.style.height = space.offsetHeight + space.scrollHeight - space.clientHeight);
				}
				this.prevSize = real;
				panel.style[vertical
								? "width"
								: "height"] = (size || panelSize) + "px";
				screen && (plane.style[vertical
										? side == "east"
											? "paddingRight"
											: "paddingLeft"
										: side == "south"
											? "paddingBottom"
											: "paddingTop"] = real + "px");
				if(!left){
					alert("Can't fit size for attachment: " + Layouts.formatObject({
						size : size,
						spacerSize : spacerSize,
						vertical : vertical,
						"real != size" : (real != (vertical
								? panel.offsetWidth
										: panel.offsetHeight)),
						real : real,
						prevSize : prevSize,
						panel : (vertical
								? panel.offsetWidth
										: panel.offsetHeight)
					}));
					break;
				}
			};
			return update;
		} 
	},
	setupDocument : function(document){
		var source = 
			"ui-attachment{"+
			"}"+
			"ui-attach-screen-attachment{"+
				"position:absolute;"+
				"overflow:hidden;"+
			"}"+
			".ui-attach-screen-spacer-table{"+
				"position:absolute;"+
//				"table-layout:fixed;"+ // doesn't work in IE7 - width is 100% for position:absolute then
			"}"+
			".ui-attach-spacer{"+
				"position:relative;"+
//				"overflow:hidden;"+ // kind of should fit anyway
			"}"+
			".ui-attach-spacer-container{"+
				"width:0;"+
				"height:0;"+
	//			"overflow:hidden;"+ // kind of should fit anyway
			"}"+
			".ui-attach-spacer-hidden{"+
				"display:none;"+
				"width:0;"+
				"height:0;"+
	//			"overflow:hidden;"+ // kind of should fit anyway
			"}"+
			".ui-attach-table{"+
				"max-height:100%;"+
				"max-width:100%;"+
				"table-layout:fixed;"+
				"vertical-align:top;"+
			"}"+
			".ui-attach-table-row{"+
				"width:100%;"+
			"}"+
			".ui-attach-cell{"+
//				"overflow:hidden;"+
			"}"+
			".ui-attach-panel{"+
//				"overflow:hidden;"+
			"}"+
			".ui-attach-fixed{"+
//				"overflow:hidden;"+
			"}"+
			".ui-attach-grow{"+
//				"_height:0;"+    // ie6 hasLayout
//				"min-width:0;"+  // ie7 hasLayout
//				"position:relative;"+
//				"overflow:visible;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
Layouts.AttachGrow = function(target, def){
	with(this){
		init1_target(target, extend(def, null), "attach-grow");
		init2_layers();
		environment = extend(environment);
		environment.zoom || (environment.zoom = def.zoom);
		init3_finish();
		environment.onContentChange = function(sender){
			top.debug && top.debug("Layouts.AttachGrow: got upstream event 'content_change', notifying attachment component");
			attachment.rebuild(inner.component);
		};
	}
},
Layouts.AttachGrow.prototype = new ((window.Layouts && (Layouts.Container || (window.require && require("Layouts.Container")))) || function(){})(),
Layouts.AttachGrow.prototype.putAll({
	isComponentAttachGrow : true,
	onAfterRebuild : function(sender){
		with(this){
//			var reference = inner;
//			var maxWidth = Math.max(reference.scrollWidth, reference.offsetWidth, reference.clientWidth),
//				maxHeight = Math.max(reference.scrollHeight, reference.offsetHeight, reference.clientHeight);
//			alert("<<< grow: zoom: " + zoom + ", mw: " + maxWidth + ", mh: " + maxHeight + ", sender=" + sender + ", attachment = " + this.attachment);
			return true;
		}
	}
}),
Layouts.AttachFixed = function(target, def){
	with(this){
		init1_target(target, extend(def, null), "attach-fixed");
		init2_layers();
		init3_finish();
	}
},
Layouts.AttachFixed.prototype = new ((window.Layouts && (Layouts.Screen || (window.require && require("Layouts.Screen")))) || function(){})(),
Layouts.AttachGrow.prototype.putAll({
	isComponentAttachFixed : true
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Attachment) // <%/FORMAT%>