// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.DropPanel || (parent.Layouts && (Layouts.DropPanel = parent.Layouts.DropPanel)) || (
	// v 2.2a
	//
	//	-= MyX =-
	//
	//	DOCTYPES REQUIRED FOR EXECUTION:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//
	//	Usage:
	//		var panel = new DropPanel(referenceDiv, definition)
	//
	//	panel : {
	//		definition	: definition used to describe this panel
	//		display		: function()
	//					Displays panel (created invisible).
	//		destroy		: function()
	//					Destroys panel
	//	}
	//
	//	definition : {
	//		width			: default width for panel ("300px"),
	//		down			: boolean
	//							Requests to drop vertically (actually up or down will be 
	//								chosen according to circumstances)
	//							By default drops horizontally. 
	//		sticky			: boolean
	//							Creates persistent drop panel - only explicit destroy() 
	//								call will destroy the panel.
	//							Default non-sticky panel will be automatically closed on 
	//								focus loss etc. (like normal menu would).
	//	}
	//

Layouts.DropPanel = function(target, def){
	if(!arguments.length){
		return;
	}
	
	this.pnt = null;
	with(this){
		init1_target(target, extend(def, null, {zoom:"undefined"}), "drop-reference");
	
		this.panelsAll = {};
		this.panelParent = null;
		this.active = false;
		
		this.full = definition ? definition.down : true;
		var width = definition && definition.width || "";
	
		this.down = true;
		this.right = true;

		this.document = window.top.document;
		this.pnt = document.createElement("ui-drop-panel");
		pnt.style.visibility = "hidden";
		pnt.component = this;

		this.abs = document.createElement("div");
		abs.style.position = "absolute";
		abs.style.width = width;
		abs.style.height = 0;
		abs.style.overflow = "visible";
	
		pnt.appendChild(abs);
		
		this.rel = document.createElement("div");
		rel.style.position = "relative";
		
		abs.appendChild(rel);

		this.scr = document.createElement("div");
		scr.style.position = "relative";
		
		rel.appendChild(scr);

		this.tbl = document.createElement("table");
		tbl.cellPadding = 0;
		tbl.cellSpacing = 0;
		tbl.style.width = width;

		scr.appendChild(tbl);
	
		this.cll = tbl.insertRow(-1).insertCell(-1);

		init2_layers(abs, rel, cll);

		environment = extend(environment);

		init3_finish();

		environment.onContentChange = function(sender){
			top.debug && top.debug("Layouts.DropPanel: got upstream event 'content_change', rebuilding");
			rebuild(null);
		};
	}
},
Layouts.DropPanel.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.DropPanel.prototype.putAll({
	isComponentContainer	: true,
	isComponentSequence		: false,
	isComponentDropPanel	: true,
	
	environment				: {
		zoom	: "document"
	},
	
	onAfterRebuild : function(sender){
		with(this){
			var update = false;
			pnt.parentNode != document.body && (
				document.body.appendChild(pnt),
				update = true
			);
			return false && update;
		}
	},

	//
	activeStack				: [],
	rootDown				: true,
	rootRight				: true,

	//
	display : function(){
		with(this){
			panelParent = outer.parentNode;
			for(;panelParent = panelParent.parentNode;){
				if(panelParent.component && panelParent.component.isComponentDropPanel){
					panelParent = panelParent.component;
					break;
				}
			}
			window.top.debug && window.top.debug("DropPanel: parent panel: " + panelParent);

			var activePanel = activeStack.pop();
			for(;activePanel && activePanel != panelParent;){
				window.top.debug && window.top.debug("DropPanel: found active panel: " + activePanel);
				activePanel.destroy();
				activePanel = activeStack.pop();
			}
			panelParent && activeStack.push(panelParent);
			activeStack.push(this);
			this.key || (this.key = (panelParent ? ++panelParent.key : 1)),
			panelParent && (panelParent.panelsAll[key] = this);

			onresizeImpl();

			startTransition("appear", function(){
				pnt.style.visibility = "";
				new (require("Effects.Shadow"))(abs);
				active = true;
			});
		}
	},
	
	onresizeImpl : function(){
		with(this){
			if(!pnt.parentNode){
				return false;
			}
			// alert([outer.parentNode, outer.parentNode.offsetHeight, outer.parentNode.clientHeight, outer.parentNode.scrollHeight]);
			var c = new (require("Utils.Coordinates"))(outer.parentNode).relativeToTopmost();
			window.top.debug && window.top.debug("DropPanel: raw coordinates: " + c);

			if(!panelParent) { // scroll correction
				var oh = c.e.offsetHeight;
				var cy = c.ty;
				var st = c.c.scrollTop;
				var ch = c.c.clientHeight;
				window.top.debug && window.top.debug("DropPanel: scroll correction: oh=" + oh + ", cy=" + cy + ", st=" + st + ", ch=" + ch);
				(cy - oh < st) && (c.c.scrollTop = cy - oh);
				(cy + 2 * oh > st + ch) && (c.c.scrollTop = cy + 2 * oh - ch);
				/*
				// scroll correction required!!!
				var scrollLeft = document.documentElement.scrollLeft + (document.body == document.documentElement ? 0 : document.body.scrollLeft);
				var scrollTop = document.documentElement.scrollTop + (document.body == document.documentElement ? 0 : document.body.scrollTop);
				window.top.debug && window.top.debug("DropPanel: scroll coordinates: x=" + scrollLeft + ", y=" + scrollTop);
				*/
			}
	
			var sh = Math.max(inner.offsetHeight, inner.scrollHeight);
			var sw = Math.max(inner.offsetWidth, inner.scrollWidth);
			var limit = c.c.clientHeight;
			var scroll = (limit < sh) && (sh = limit, true);

			{
				window.top.debug && window.top.debug("DropPanel: resizeImpl: sh: " + sh + ", limit: " + limit + ", scroll: " + scroll);
				if(scroll){
					if(!rel.iconTop){
						var same =	"position:absolute;"+
									"left:0;"+
									"width:100%;"+
									"height:16px;"+
									"background-color:ButtonFace;"+
									"color:ButtonText;"+
									"font-size:16px;"+
									"line-height:16px;"+
									"z-index:999;"+
									"text-align:center;"+
									"vertical-align:middle;";
						var div = rel.iconTop = rel.ownerDocument.createElement("div");
						div.style.cssText = same + "top:0";
						div.style.visibility = "hidden";
						div.innerHTML = "&#x1403;";
						rel.appendChild(div);
						div = rel.iconBottom = div.cloneNode(false);
						div.style.cssText = same + "bottom:0";
						div.style.visibility = "hidden";
						div.innerHTML = "&#x1401;";
						rel.appendChild(div);
					}
				}else{
					this.prevClientY = -1;
					rel.iconTop && (rel.iconTop.style.visibility = scroll ? "" : "hidden");
					rel.iconBottom && (rel.iconBottom.style.visibility = scroll ? "" : "hidden");
				}

				rel.style.height = scroll ? sh + "px" : "";
				rel.style.width = sw + "px";
				scr.style.height = scroll ? sh + "px" : "";
				scr.style.width = sw + "px";
				abs.style.height = sh + "px";
				abs.style.width = sw + "px";
				
				scr.style.overflowX = "visible";
				scr.style.overflowY = scroll ? "hidden" : "visible";
				
				scr.onmousemove = scroll 
					? function(e){
						e || (e = window.event);
						with(this){
							var padding = clientHeight > 64 ? 32 + clientHeight * 0.12 : clientHeight * 0.1;
							scrollTop =		-padding / 2 +
												e.clientY * (scrollHeight - clientHeight + padding) 
																		/ 
																	clientHeight;
							rel.iconTop && (rel.iconTop.style.visibility = scrollTop > 0 ? "" : "hidden");
							rel.iconBottom && (rel.iconBottom.style.visibility = scrollTop + clientHeight < scrollHeight ? "" : "hidden");
							window.top.debug && window.top.debug("mousemove: y=" + e.clientY + ", ch=" + clientHeight + ", sh=" + scrollHeight + ", st=" + scrollTop);
						}
					}
					: null;
			}

			// shows likely attachment
			panelParent || (Layouts.DropPanel.prototype.rootDown = c.ty < c.by);
			panelParent || (Layouts.DropPanel.prototype.rootRight = c.lx < c.rx);
			//

			/*
			// my style 

			var prevDown = panelParent ? panelParent.down : rootDown;
			var prevRight = panelParent ? panelParent.right : rootRight;

			down = panelParent 
				? (prevDown ? c.ty + sh < c.c.clientHeight : c.by + sh > c.c.clientHeight)
				: rootDown;
			right = panelParent
				? (prevRight ? c.lx + c.w + sw < c.c.clientWidth : c.rx + c.w + sw > c.c.clientWidth)
				: rootRight;

			window.top.debug && window.top.debug("DropPanel: directions: rd=" + rootDown + ", rr=" + rootRight + ", pd=" + prevDown + ", pr=" + prevRight + ", full=" + full + ", down=" + down + ", right=" + right);
			//
			*/
			
			// mac style
			down = (panelParent && true) || rootDown;
			var cut = Math.max(0, c.ty + (full ? c.h : 0) + sh - c.c.clientHeight);
			right = c.lx + c.w + sw < c.c.clientWidth;

			window.top.debug && window.top.debug("DropPanel: directions: rd=" + rootDown + ", rr=" + rootRight + ", full=" + full + ", down=" + down + ", right=" + right);
			//

			// should be connected in direction opposite to INITIAL drop direction
			// this will help with window resize
			/*
			// my style
			pnt.style[rootDown ? "top" : "bottom"] = (down 
														? full 
															? c.ty + c.h
															: c.ty
														: full
															? c.by
															: prevDown == down
																? c.by + c.h
																: c.ty + c.h - sh) + "px";
			pnt.style[rootRight ? "left" : "right"] = (right 
														? full
															? c.lx 
															: prevRight == right
																? c.lx + c.w
																: c.rx - sw
														: full
															? c.rx
															: prevRight == right
																? c.rx + c.w
																: c.lx - sw) + "px";
			//
			*/
			// mac style
			pnt.style[rootDown ? "top" : "bottom"] = (down
														? full
															? c.ty + c.h
															: rootDown
																? c.ty - cut
																: c.by// - cut
														: full
															? c.by + c.h
															: rootDown
																? c.ty + c.h - sh + 2
																: c.by + c.h - 2) + "px";
			pnt.style[rootRight ? "left" : "right"] = (right 
														? full
															? rootRight
																? c.lx
																: c.rx + c.w - sw
															: rootRight
																? c.lx + c.w - 2
																: c.rx - sw + 2
														: full
															? c.rx
															: rootRight 
																? c.lx - sw + 2
																: c.rx + c.w - 2) + "px";
			//

			pnt.style[rootDown ? "bottom" : "top"] = "";
			pnt.style[rootRight ? "right" : "left"] = "";

			abs.style[rootDown ? "bottom" : "top"] = "";
			abs.style[rootRight ? "left" : "right"] = 0;
			abs.style[rootDown ? "top" : "bottom"] = 0;
			abs.style[rootRight ? "right" : "left"] = "";
			//

			if(scroll){
				var p = new (require("Utils.Coordinates"))(plane).relativeToTopmost();
				var e = {
					clientY : down ? (c.ty + c.h / 2) - p.ty : plane.offsetHeight - (c.ty - p.ty)
				};
				if(this.prevClientY != e.clientY){
					this.prevClientY = e.clientY;
					window.top.debug && window.top.debug("DropPanel: initial scroll: down=" + down + ", clientY=" + e.clientY + ", planeHeight=" + plane.offsetHeight);
					scr.onmousemove(e);
				}
			}

			return true;
		}
	},
	
	onresize : function(){
		with(this){
			if(!pnt.parentNode){
				return false;
			}
			for(var i in activeStack){
				activeStack[i].onresizeImpl();
			}
			return true;
		}
	},

	destroyImpl : function(){
		with(this){
			pnt.parentNode && pnt.parentNode.removeChild(pnt);
			outer.parentNode && outer.parentNode.removeChild(outer);
			activeStack[activeStack.length - 1] == this && activeStack.pop();
		}
	},

	destroy : function(){
		with(this){
			active = false;
			window.top.debug && window.top.debug("DropPanel: destroy(): key: " + key);
			for(var i in panelsAll){
				panelsAll[i].destroy();
			}
			activeStack[activeStack.length - 1] == this && activeStack.pop();
			panelParent && (delete panelParent.panelsAll[key]);
			pnt.parentNode 
				? startTransition("disappear", function(){
						destroyImpl();
					})
				: destroyImpl();
			// alert([onAfterDestroy,definition.onAfterDestroy]);
			onAfterDestroy && onAfterDestroy();
		}
	},

	toString : function(){
		return "{ layout : 'drop-panel' }";
	},
	setupDocument : function(document){
		var source = 
			"ui-drop-panel,ui-drop-reference{"+
				"display:block;"+
				"position:absolute;"+
				"width:0;"+
				"height:0;"+
				"overflow:visible;"+
				"z-index:9999;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);

		var window = document.defaultView || document.parentWindow;

		var boxes = {
			queued	: false,
			list	: document.getElementsByTagName("ui-drop-panel"),
			fix		: function(){
				with(boxes){
					queued = false;
					window.top.debug && window.top.debug("Layouts.Drop: zoom all || column document maintenance: dropCount=" + list.length);
					for(var i = 0; i < list.length; ++i){
						var size = list.item(i);
						with(size){
							window.top.debug && window.top.debug("Layouts.Drop zoom all || column document maintenance: i=" + i + ", size=" + size.component );
							size.component.onresize();
						}
					}
				}
			},
			enqueue	: function(){
				boxes.queued || (boxes.queued = setTimeout(function(){
					boxes.fix();
				}, 50))
			},
			resize	: require("Utils.Event").listen(window, "resize", function(){
				boxes.enqueue();
			}),
			load	: require("Utils.Event").listen(window, "load", function(){
				boxes.enqueue();
			}),
			task	: window.setInterval(function(){
				boxes.enqueue();
			}, 5000)
		};
		return boxes;
	}
}),
//we still have to return a class we just defined, implemented and initialized 8-)
Layouts.DropPanel) // <%/FORMAT%>