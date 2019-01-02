// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.Shadow || (parent.Effects && (Effects.Shadow = parent.Effects.Shadow)) || (
	// v 0.9d
	//
	//	-= MyX =-
	//
	//	Usage:
	//		var shadow = new Effects.Shadow( target )
	//							where target is a HTML DOM Element or Layouts.Container object
	//
	//	Shadow object, which have following methods:
	//		shadow : {
	//		}
	//
	//
	//
	// Customization:
	//		Effects.Shadow.prototype.defaultEffect = "simple"
	//

Effects.Shadow = function(target, implName){
	var inner = target.ownerDocument.createElement("ef-shadow"), outer = inner;
	inner.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%";

	this.inner = inner;
	this.outer = outer;
	outer.effect = this;

	var impl = this.impls[implName || this.implName] || this.impls[this.implName] || this.impls[this.impleName = this.defaultEffect];
	this.effect = implName;
	this.create = impl.create;
	this.create(inner);
	target.style.zIndex = 1;
	inner.style.zIndex = -1;
	target.insertBefore(outer, target.firstChild);
	return this;
},
Effects.Shadow.prototype = {
	defaultEffect : "css3",
	setEffectName : function(name){
		this.implName = name;
		require("Utils.Cookies").create("shdii", this.implName, 3650);
	},
	//
	//	impl : {
	//		create : function(target)
	//	}
	//
	addEffect : function(name, impl){
		this.impls[name] = impl;
		this.implName || (this.implName = name);
	}
},
Effects.Shadow.prototype.init = function(){
	this.init = function(){
	};
	this.impls = {};
	this.implName = undefined;
	this.addEffect(false, {
		create : function(target){
		}
	});
	this.addEffect("simple", { // +Safari, +Opera9, +FF3, +IE6
		create : function(target){
			var same = "position:absolute;opacity:0.4;background-color:ButtonShadow;overflow:hidden;"; // overflow for IE6
			var sh1 = target.ownerDocument.createElement("div");
			sh1.style.cssText = same + "right:-2px;top:2px;width:2px;height:100%";
			sh1.style.filter = "alpha(opacity=40)"; // opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
			var sh2 = sh1.cloneNode(false);
			sh2.style.cssText = same + "left:2px;bottom:-2px;width:100%;height:2px";
			target.appendChild(sh1);
			target.appendChild(sh2);
		}
	});
	this.addEffect("css3", { // +Safari, +Opera9, +FF3
		create : function(target){
			target.style.boxShadow = "rgba(0, 0, 0, 0.6) 0 1em 1.5em";
		}
	});
	this.addEffect("funny", { // +Safari, +Opera9, +FF3, +IE6
		create : function(target){
			var same = "position:absolute;opacity:0.3;background-color:windowtext;overflow:hidden;"; // overflow for IE6
			var sh1 = target.ownerDocument.createElement("div");
			sh1.style.cssText = same + "right:-3px;top:3px;width:3px;height:100%";
			sh1.style.filter = "alpha(opacity=30)"; // opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
			var sh2 = sh1.cloneNode(false);
			sh2.style.cssText = same + "left:3px;bottom:-3px;width:100%;height:3px";
			var same = "position:absolute;opacity:0.4;background-color:window;overflow:hidden;"; // overflow for IE6
			var sh3 = sh1.cloneNode(false);
			sh3.style.filter = "alpha(opacity=40)"; // opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
			sh3.style.cssText = same + "left:-3px;top:-3px;width:3px;height:100%";
			var sh4 = sh3.cloneNode(false);
			sh4.style.cssText = same + "left:-3px;top:-3px;width:100%;height:3px";
			target.appendChild(sh1);
			target.appendChild(sh2);
			target.appendChild(sh3);
			target.appendChild(sh4);
		}
	});
	this.addEffect("soft", {
		create : function(target, color){
			color || (color = "black");
			var spacing = 1.5, elements = 8, shift = spacing * elements, o = 0.5 / elements;

			// sample
			var shm = target.ownerDocument.createElement("div");
			shm.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0.2";
			shm.style.filter = "alpha(opacity="+Math.round(20)+")"; // opera will fail it there ^^^^^^^^^^^ otherwise

			var shi = target.ownerDocument.createElement("div");
			shm.cssText = "position:relative;width:100%;height:100%";

			var same =	"position:absolute;"+
						"overflow:hidden;"+
						"background-color:" + color + ";"+
						"opacity:" + (0.4 || o) + ";";

			function frame(i, of){
				var ci = i / of, ni = (i + 1) / of;

//				var o = Math.cos(ci * Math.PI / 2);
				var o = Math.pow(1 - ci, 3);
				var d = Math.round(Math.sin(ci * Math.PI / 2) * shift);
				var D = Math.round(Math.sin(ni * Math.PI / 2) * shift);

				var vo = shift / 2; // vertical offset
				var vo = shift / 3; // vertical offset

				var shC = target.ownerDocument.createElement("div");
				shC.style.cssText = same + 
									"left:0px;" +
									"bottom:-" + vo + "px;" + 
									"width:100%;" +
									"height:" + vo + "px;"+
									"opacity:1";
				// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
				shC.style.filter = "alpha(opacity=(100)"; 
				shm.appendChild(shC);

				var shR = target.ownerDocument.createElement("div");
				shR.style.cssText = same + 
									"right:-" + D + "px;" +
									"top:" + vo + "px;" + 
									"width:" + (D - d) + "px;"+
									"height:100%;"+
									"opacity:" + o;
				// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
				shR.style.filter = "alpha(opacity="+Math.round(o * 100) + ")"; 
				shm.appendChild(shR);

				var shL = target.ownerDocument.createElement("div");
				shL.style.cssText = same + 
									"left:-" + D + "px;" +
									"top:" + vo + "px;" + 
									"width:" + (D - d) + "px;"+
									"height:100%;"+
									"opacity:" + o;
				// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
				shL.style.filter = "alpha(opacity="+Math.round(o * 100) + ")"; 
				shm.appendChild(shL);

				if(vo <= D){
					var shT = target.ownerDocument.createElement("div");
					shT.style.cssText = same + 
										"left:0;" +
										"top:-" + (D - vo) + "px;" + 
										"width:100%;"+
										"height:" + (D - d) + "px;"+
										"opacity:" + o;
					// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
					shT.style.filter = "alpha(opacity="+Math.round(o * 100) + ")"; 
					shm.appendChild(shT);
				}

				var shB = target.ownerDocument.createElement("div");
				shB.style.cssText = same + 
									"left:0;" +
									"bottom:-" + (vo + D) + "px;" + 
									"width:100%;"+
									"height:" + (D - d) + "px;"+
									"opacity:" + o;
				// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
				shB.style.filter = "alpha(opacity="+Math.round(o * 100) + ")"; 
				shm.appendChild(shB);
				
				for(var j = i; j < of; j++){
					var cj = (j - i) / of, nj = (j - i + 1) / of;
					var oj = Math.pow(1 - cj, 3) * o;
					var dj = Math.round(Math.sin(cj * Math.PI / 2) * shift);
					var Dj = Math.round(Math.sin(nj * Math.PI / 2) * shift);

					var shr = target.ownerDocument.createElement("div");
					shr.style.cssText = same + 
										"right:-" + D + "px;" +
										"bottom:-" + (vo + Dj) + "px;" + 
										"width:" + (D - d) + "px;"+
										"height:" + (Dj - dj) + "px;"+
										"opacity:" + oj;
					// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
					shr.style.filter = "alpha(opacity="+Math.round(oj * 100) + ")"; 
					shm.appendChild(shr);

					var shl = target.ownerDocument.createElement("div");
					shl.style.cssText = same + 
										"left:-" + D + "px;" +
										"bottom:-" + (vo + Dj) + "px;" + 
										"width:" + (D - d) + "px;"+
										"height:" + (Dj - dj) + "px;"+
										"opacity:" + oj;
					// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
					shl.style.filter = "alpha(opacity="+Math.round(oj * 100) + ")"; 
					shm.appendChild(shl);

					var str = target.ownerDocument.createElement("div");
					str.style.cssText = same + 
										"right:-" + D + "px;" +
										"top:" + (vo - Dj) + "px;" + 
										"width:" + (D - d) + "px;"+
										"height:" + (Dj - dj) + "px;"+
										"opacity:" + oj;
					// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
					str.style.filter = "alpha(opacity="+Math.round(oj * 100) + ")"; 
					shm.appendChild(str);

					var stl = target.ownerDocument.createElement("div");
					stl.style.cssText = same + 
										"left:-" + D + "px;" +
										"top:" + (vo - Dj) + "px;" + 
										"width:" + (D - d) + "px;"+
										"height:" + (Dj - dj) + "px;"+
										"opacity:" + oj;
					// opera will fail it there ^^^^^^^^^^^^^^^^^^^^ otherwise
					stl.style.filter = "alpha(opacity="+Math.round(oj * 100) + ")"; 
					shm.appendChild(stl);
				}
			}
			
			for(var i = elements; i >= 0; --i){
				frame(i, elements);
			}

			shm.style.overflow = "visible";
			target.appendChild(shm);
		}
	});
	this.addEffect("ms-ie6-shadow", { // ?Safari, ?Opera9, ?FF3, +IE6
		create : function(target){
			var same = ""; // overflow for IE6
			var sh1 = target.ownerDocument.createElement("div");
			sh1.style.cssText = "filter:progid:DXImageTransform.Microsoft.Glow(color=#666666,strength=2) progid:DXImageTransform.Microsoft.Shadow(color=#000055,direction=135,strength=6);"+
								"-ms-filter:progid:DXImageTransform.Microsoft.Glow(color=#666666,strength=2) progid:DXImageTransform.Microsoft.Shadow(color=#000055,direction=135,strength=6);"+
								"-moz-box-shadow:3px 3px 10px #000000;"+
								"-webkit-box-shadow:3px 3px 10px #000000;"+
								"box-shadow:3px 3px 10px #000000;"+
								"position:absolute;"+
								"opacity:0.4;"+
								"overflow:hidden;"+
								"left:0;"+
								"top:0;"+
								"width:100%;"+
								"height:100%";
			target.appendChild(sh1);
		}
	});
	this.addEffect("ms-ie6-dropshadow", { // ?Safari, ?Opera9, ?FF3, +IE6
		create : function(target){
			var same = ""; // overflow for IE6
			var sh1 = target.ownerDocument.createElement("div");
			sh1.style.cssText = "filter:progid:DXImageTransform.Microsoft.dropshadow("+
												"OffX=5,"+
												"OffY=5,"+
												"Color='gray',"+
												"Positive='true');"+
								"position:absolute;"+
								"opacity:0.4;"+
								"overflow:hidden;"+
								"left:0;"+
								"top:0;"+
								"width:100%;"+
								"height:100%";
			target.appendChild(sh1);
		}
	});
	this.implName = (window.require && require("Utils.Cookies").read("shdii", this.implName || this.defaultEffect)) || this.implName || this.defaultEffect;
},
Effects.Shadow.prototype.init(),
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.Shadow) // <%/FORMAT%>