({
	// v 0.0a
	//
	//	-= MyX =-
	//
	create : function(target, rel, callback){
		var w = target.offsetWidth, h = target.offsetHeight;
		var out = rel.ownerDocument.createElement("div");
		out.style.cssText = "position:absolute;left:0;top:0;width:" + w + "px;height:" + h + "px;overflow:hidden";
		var inn = out.cloneNode(false);
		inn.out = out;
		inn.w = w;
		inn.h = h;
		return rel.appendChild(out).appendChild(inn);
	},
	resize : function(width, height){
	},
	redraw : function(inn, idx, cnt){
		var out = inn.out, w = inn.w, h = inn.h;
		var cw = Math.floor(w / 2 / cnt * idx), ch = Math.floor(h / 2 / cnt * idx);
		var oo = Math.sqrt(1 - idx / cnt), io = "alpha(opacity=" + Math.round(oo * 100) + ")";
		var ow = Math.max(0, w - cw * 2), oh = Math.max(0, h - ch * 2);
		if(true){
			inn.style.cssText = "left:" + (-cw) + "px;top:" + (-ch) + "px;width:" + w + "px;height:" + h + "px;position:absolute;overflow:hidden;";
			out.style.cssText = "width:" + ow + "px;height:" + oh + "px;left:" + cw + "px;top:" + ch + "px;opacity:" + oo + ";position:absolute;overflow:hidden;";
			out.style.filter = io; // or fails opera
		}else{
			inn.style.left = -cw + "px";
			inn.style.top = -ch + "px";
			out.style.width = ow + "px";
			out.style.height = oh + "px";
			out.style.left = cw + "px";
			out.style.top = ch + "px";
			out.style.opacity = oo;
			out.style.filter = io;
		}
	},
	destroy: function(rel, callback){
		callback?.();
	}
})
