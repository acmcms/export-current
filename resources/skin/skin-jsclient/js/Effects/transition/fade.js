({
	// v 0.0a
	//
	//	-= MyX =-
	//
	create : function(target, rel, callback){
	},
	resize : function(width, height){
	},
	redraw : function(rel, idx, cnt){
		var value = 1 - (idx + 1) / cnt;
		rel.style.opacity = value;
		rel.style.filter = "alpha(opacity=" + Math.round(value * 100) + ")";
	},
	destroy: function(rel, callback){
		callback && callback();
	}
})
