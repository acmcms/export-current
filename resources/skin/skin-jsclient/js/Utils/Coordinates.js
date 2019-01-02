// <%FORMAT: 'js' %>
(window.Utils || (Utils = parent.Utils) || (Utils = {})) &&
Utils.Coordinates || (parent.Utils && (Utils.Coordinates = parent.Utils.Coordinates)) || (
	// v 1.2
	//
	//	-= MyX =-
	//
	//	coordinates : {
	//		e			: reference element,
	//		lx			: left:x offset,
	//		ty			: top:y offset,
	//		rx			: right:x offset,
	//		by			: bottom:y offset,
	//		w			: width,
	//		h			: height,
	//		c			: container element
	//		cw			: container width,
	//		ch			: container height
	//		relativeTo	: function(target)
	//							calculates coordinates to display in 'target' div with position "absolute"
	//		relativeToBody
	//		relativeToTopmost
	//	}
	//
	//
	//	Usage:
	//		var coordinates = new Utils.Coordinates()
	//
	//	Methods:
	//		relativeToTopmostFixed	: function( targetDiv )
	//										fills object fields with data containing relative coordinates in a topmost 
	//											accessible container for fixed positioning, which is document.body.
	//										returns same object.
	//
	
Utils.Coordinates = function(e){
	var t = this;
	t.e = t.c = e;
	t.lx = 0;
	t.ty = 0;
	t.rx = 0;
	t.by = 0;
	t.cw = t.w = Math.max(t.c.offsetWidth, t.c.clientWidth); // strange, but helps with opera, when offsetSize is 0!
	t.ch = t.h = Math.max(t.c.offsetHeight, t.c.clientHeight); // actually, clientHeight should be smaller at all times
	
	return t.relativeTo(e.offsetParent);
},
Utils.Coordinates.prototype = {
	bodyNRel : function(e){
		var d = e.ownerDocument,
			w = d.defaultView;
		return e === d.body && (w && w.getComputedStyle
			? w.getComputedStyle(e, null).getPropertyValue('position')
			// IE otherwise?!
			: e.currentStyle.position
		) !== 'relative';
	},
	relativeTo : function(element, silent){
		with(this){
			for(var p;;c = p){
				p = c && c.offsetParent;
				if(!p || c === element){
					if(element && c !== element && !silent){
						throw new Error("Coordinates: target is not in hierarchy of an element, this=" + e.id + ", element=" + (element.id || element.nodeName));
					}
					break;
				}
	
				var cx = c.offsetLeft + c.clientLeft,
					cy = c.offsetTop + c.clientTop,
					pw = Math.max(p.offsetWidth, p.clientWidth),
					ph = Math.max(p.offsetHeight, p.clientHeight);
				
				if(bodyNRel(p)){
					var d = p.ownerDocument.documentElement;
					// top.debug && top.debug(">>>>># ol:" + p.offsetLeft + ", cl:" + p.clientLeft + ", cw:" + p.clientWidth + ", ow:" + p.offsetWidth);
					// top.debug && top.debug(">>>>>! ol:" + d.offsetLeft + ", cl:" + d.clientLeft + ", cw:" + d.clientWidth + ", ow:" + d.offsetWidth);
					pw += (Math.max(d.offsetWidth, d.clientWidth)  - pw); // / 2;
					ph += (Math.max(d.offsetHeight, d.clientHeight)  - ph); // / 2;
				}
				// top.debug && top.debug(">>> >>> cx:" + cx + ", cw:" + cw + ", pw:" + pw);
				
				lx += cx;
				ty += cy;
				
				rx += pw - cx - cw;
				by += ph - cy - ch;
				
				cw = pw;
				ch = ph;
			}
		}
		return this;
	},
	relativeToTopmost : function(){
		return this.relativeTo(null);
	},
	relativeToBody : function(){
		return this.relativeTo(this.e.ownerDocument, true);
	},
	firstLevel : function(target){
		return new Utils.Coordinates(target);
	},
	toString : function(){
		with(this){
			return "Utils.Coordinates{\n"+
						"\t\t\te:"+e+",\n"+
						"\t\t\t\tlx:"+lx+",ty:"+ty+",rx:"+rx+",by:"+by+",w:"+w+",h:"+h+",\n"+
						"\t\t\tc:"+c+",\n"+
						"\t\t\t\tcw:"+cw+",ch:"+ch+"\n"+
					"}";
		} 
	}
},
Utils.Coordinates) // <%/FORMAT%>