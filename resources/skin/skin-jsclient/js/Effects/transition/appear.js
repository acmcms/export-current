({
	// v 0.0a
	//
	//	-= MyX =-
	//
	create : function(target, rel, callback){
		// rel.style.cssText = "opacity:0;filter:alpha(opacity=0);";   // <<- opera fires errors on this %-<
		rel.style.opacity = 0;
		rel.style.filter = "alpha(opacity=0)";
		//
		callback && callback();
	},
	resize : function(width, height){
	},
	redraw : function(rel, idx, cnt){
		var value = Math.pow(idx / cnt, 2);
		rel.style.opacity = value;
		rel.style.filter = "alpha(opacity=" + Math.round(value * 100) + ")";
	},
	destroy: function(rel, callback){
	}
})
