// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.Busy || (parent.Effects && (Effects.Busy = parent.Effects.Busy)) || (
	// v 1.4i
	//
	//	-= MyX =-
	//
	//	Usage:
	//		var busy = new Effects.Busy( target )
	//							where target is a HTML DOM Element or Layouts.Container object
	//
	//	Progress indicator object, which have following methods:
	//		indicator : {
	//			update : function(value),
	//			destroy : function()
	//		}
	//
	//
	//
	// Customization:
	//		Effects.Busy.prototype.defaultEffect = "infinity"
	//
	
	
Effects.Busy = function(target, implName){
	this.key = "k" + Effects.Busy.uid++;
	var document = (target.shape || target).ownerDocument;
	var outer = this.outer = document.createElement("ef-busy");
	outer.effect = this;
	outer.toString = this.toString;
	outer.style.display = "block";
	outer.style.position = "absolute";
	outer.style.left = 0;
	outer.style.top = 0;
	outer.style.width = "100%";
	outer.style.height = "100%";
	outer.style.opacity = ".75";
	outer.style.filter = "alpha(opacity=75)";
	outer.style.color = "black";
	outer.style.backgroundColor = "white";
	outer.style.overflow = "hidden";
	outer.style.textAlign = "center";
	outer.style.verticalAlign = "bottom";
	outer.style.fontFamily = "monospace";
	outer.style.cursor = "wait";
	outer.style.zIndex = 1;
	outer.progress = this;
	outer.ondblclick = function(){
		window.top.debug && window.top.debug("progress: mouse doubleclick - destroying indicator");
		this.progress.destroy();
		return false;
	};
	//
	var inner = this.inner = document.createElement("div");
	inner.style.position = "relative";
	inner.style.width = "100%";
	inner.style.height = "100%";
	inner.style.cursor = "wait";
	inner.style.zIndex = 1;
	inner.progress = this;
	inner.ondblclick = function(){
		window.top.debug && window.top.debug("progress: mouse doubleclick - destroying indicator");
		this.progress.destroy();
		return false;
	};
	outer.appendChild(inner);
	(target.shape || target).appendChild(outer);
	var impl = this.impls[implName || this.implName] || this.impls[this.implName] || this.impls[this.implName = this.defaultEffect];
	this.effect = implName;
	this.create = impl.create;
	this.resize = impl.resize || function(){};
	this.redraw = impl.redraw;
	this.stall = true;
	this.update();
	this.all[this.key] = this;
},
Effects.Busy.prototype = {
	defaultEffect : "infinity",
	update : function(value){
		this.expires = (new Date()).getTime() + 11111;
		this.stall && (this.active[this.key] = this);
	},
	destroy : function(){
		with(this){
			delete this.all[key];
			delete this.active[key];
			outer.parentNode && outer.parentNode.removeChild(outer);
		}
	},
	handler : function(index){
		var width = this.inner.clientWidth;
		var height = this.inner.clientHeight;
		if(this.width != width || this.height != height){
			this.width = width;
			this.height = height;
			var size = Math.round(Math.min(width, height) / 1.2);
			this.inner.style.fontSize = size + "px";
			this.inner.style.lineHeight = height + "px";
			this.stall || this.resize(width, height);
		}
		if(this.expires < (new Date()).getTime()){
			this.stall || (delete this.active[this.key]);
			this.stall = true;
			this.inner.innerHTML = '?';
			return;
		}
		if(this.stall){
			this.inner.innerHTML = "";
			this.stall = false;
			this.create(this.inner);
			this.resize(width, height);
		}
		this.index ++;
		this.redraw(index);
	},
	setEffectName : function(name){
		this.implName = name;
		require("Utils.Cookies").create("bsyii", this.implName, 3650);
	},
	//
	//	impl : {
	//		create : function(target)
	//		resize : function(width, height)
	//		redraw : function(index)
	//	}
	//
	addEffect : function(name, impl){
		this.impls[name] = impl;
		this.implName || (this.implName = name);
	},
	toString : function(){
		return "[Busy Progress Indicator]";
	}
},
Effects.Busy.prototype.init = function(){
	this.init = function(){
	};
	Effects.Busy.uid = 0;
	this.all = {};
	this.active = {};
	this.impls = {};
	this.implName = undefined;
	this.addEffect(false, {
		create : function(target){
		},
		resize : function(width, height){
		},
		redraw : function(index){
		}
	});
	var CharSequence = function(sequence){
		return {
			create : function(target){
				this.text = target;
				this.sequence = sequence;
			},
			resize : function(width, height){
			},
			redraw : function(index){
				this.text.innerHTML = this.sequence[Math.abs(index) % this.sequence.length];
			}
		};
	};
	this.addEffect("simplest", CharSequence(['/','-','\\','|']));
	this.addEffect("simplestunicode", CharSequence(['\u2571','\u2500','\u2572','\u2502']));
	var SimpleImage = function(url, width, height, animate){
		return {
			create : function(target){
				var image = this.image = target.ownerDocument.createElement("image");
				image.style.cssText = "position:absolute;width:" + width + "px;height:" + height + "px";
				image.src = url;
				target.appendChild(image);
				image.iw = width;
				image.ih = height;
				image.mx = image.ix = 1;
				image.cw = 0;
				image.ch = 0;
			},
			resize : function(ow, oh){
				with(this.image){
					cw = ow;
					ch = oh;
					mx = ix = Math.max(1, Math.round(Math.min(cw / iw, ch / ih) / 2));
					style.top = Math.round((ch - ih * mx) / 2) + "px";
					style.left = Math.round((cw - iw * mx) / 2) + "px";
					style.width = iw * mx + "px";
					style.height = ih * mx + "px";
				}
			},
			redraw : function(index){
				if(animate) with(this.image){
					mx = (1 + (index % 6) / 12) * ix;
					mx = (1 + Math.sin(index / 7) / 2) * ix;
					style.top = Math.round((ch - ih * mx) / 2) + "px";
					style.left = Math.round((cw - iw * mx) / 2) + "px";
					style.width = Math.round(iw * mx) + "px";
					style.height = Math.round(ih * mx) + "px";
				}
			}
		};
	};
	window.require && (
		this.addEffect("imagehourglass", SimpleImage(require.impl.getScriptPath() + "Effects/busy/images/hourglass.png", 16, 16, true)),
		this.addEffect("imageflies", SimpleImage(require.impl.getScriptPath() + "Effects/busy/images/feedback-wait-loading-fly.32.gif", 32, 32, false))
	);
	this.addEffect("rundown", {
		create : function(target){
			this.cells = [];
			var count = 11;
			for(var i = count - 1; i >= 0; --i){
				var cell = target.ownerDocument.createElement("div");
				cell.style.position = "absolute";
				cell.style.fontSize = "1px";
				cell.style.lineHeight = "1px";
				this.cells.push(cell);
				target.appendChild(cell);
			}
		},
		resize : function(width, height){
			var count = this.cells.length;
			var elementWidth = width;
			var elementHeight = height / count;
			for(var i in this.cells){
				var cell = this.cells[i];
				cell.style.top = (i * elementHeight) + "px";
				cell.style.left = (0) + "px";
				cell.style.width = elementWidth + "px";
				cell.style.height = elementHeight + "px";
			}
		},
		redraw : function(index){
			var limit = Math.min(5, this.cells.length / 2);
			this.cells[Math.abs(index - 1) % this.cells.length].style.display = "none";
			for(var i = Math.abs(index), l = limit; l >= 0; --l, ++i){
				var c = Math.floor(256 * (1 - Math.pow(1 - l / limit, 2)));
				var cell = this.cells[Math.abs(i) % this.cells.length];
				cell.style.zIndex = limit - l;
				cell.style.backgroundColor = "rgb(" + c + ',' + c + ',' + c + ')';
				cell.style.display = "";
			}
		}
	});
	this.addEffect("circle", {
		create : function(target){
			this.cells = [];
			var count = 29;
			for(var i = count - 1; i >= 0; --i){
				var cell = target.ownerDocument.createElement("div");
				cell.style.position = "absolute";
				cell.style.fontSize = "1px";
				cell.style.lineHeight = "1px";
				this.cells.push(cell);
				target.appendChild(cell);
			}
		},
		resize : function(width, height){
			width = height = Math.min(width, height);
			var count = this.cells.length;
			var elementWidth = width * 5 / count;
			var elementHeight = height * 5 / count;
			for(var i in this.cells){
				var cell = this.cells[i];
				cell.style.top = (this.height - elementHeight) / 2 + Math.round(Math.sin( 2 * Math.PI * i / count ) * height / 3) + "px";
				cell.style.left = (this.width - elementWidth) / 2 + Math.round(Math.cos( 2 * Math.PI * i / count ) * width / 3) + "px";
				cell.style.width = elementWidth + "px";
				cell.style.height = elementHeight + "px";
			}
		},
		redraw : function(index){
			var limit = Math.min(5, this.cells.length / 2);
			this.cells[Math.abs(index - 1) % this.cells.length].style.display = "none";
			for(var i = Math.abs(index), l = limit; l >= 0; --l, ++i){
				var c = Math.floor(256 * (1 - Math.pow(1 - l / limit, 2)));
				var cell = this.cells[Math.abs(i) % this.cells.length];
				cell.style.zIndex = limit - l;
				cell.style.backgroundColor = "rgb(" + c + ',' + c + ',' + c + ')';
				cell.style.display = "";
			}
		}
	});
	this.addEffect("infinity", {
		create : function(target){
			this.cells = [];
			var count = 29;
			for(var i = count - 1; i >= 0; --i){
				var cell = target.ownerDocument.createElement("div");
				cell.style.position = "absolute";
				cell.style.fontSize = "1px";
				cell.style.lineHeight = "1px";
				this.cells.push(cell);
				target.appendChild(cell);
			}
		},
		resize : function(width, height){
			width = height = Math.min(width, height);
			var count = this.cells.length;
			var elementWidth = width * 6 / count;
			var elementHeight = height * 6 / count;
			for(var i in this.cells){
				var cell = this.cells[i];
				cell.style.top = (this.height - elementHeight) / 2 + Math.round(Math.sin( 4 * Math.PI * i / count ) * height / 3) + "px";
				cell.style.left = (this.width - elementWidth) / 2 + Math.round(Math.cos( 2 * Math.PI * i / count ) * width / 3) + "px";
				cell.style.width = elementWidth + "px";
				cell.style.height = elementHeight + "px";
			}
		},
		redraw : function(index){
			var limit = Math.min(5, this.cells.length / 2);
			this.cells[Math.abs(index - 1) % this.cells.length].style.display = "none";
			for(var i = Math.abs(index), l = limit; l >= 0; --l, ++i){
				var c = Math.floor(256 * (1 - Math.pow(1 - l / limit, 2)));
				var cell = this.cells[Math.abs(i) % this.cells.length];
				cell.style.zIndex = limit - l;
				cell.style.backgroundColor = "rgb(" + c + ',' + c + ',' + c + ')';
				cell.style.display = "";
			}
		}
	});
	this.implName = (window.require && require("Utils.Cookies").read("bsyii", this.implName || "infinity")) || this.implName || "infinity";
	this.index = 0;
	this.timer = function(){
		var index = this.index ++;
		for(var i in ((index % 10) == 0 ? this.all : this.active)){
			try{
				this.all[i].handler(index);
			}catch(e){
				top.debug && top.debug("progress: timer task: bad stuff happened, is it IE? text=" + e);
			}
		}
	};
	setInterval("Effects.Busy.prototype.timer()", 100);
},
Effects.Busy.prototype.init(),
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.Busy) // <%/FORMAT%>