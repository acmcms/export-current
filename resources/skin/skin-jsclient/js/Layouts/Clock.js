// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Clock || (parent.Layouts && (Layouts.Clock = parent.Layouts.Clock)) || (
	// v 0.1g
	//
	//	-= MyX =-
	//
	//	Text is a simple layout, whose idea is to take whole available space 
	//	as a text for its contents.
	//
	//
	//	Usage:
	//		var clock = new Layouts.Clock( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	clock : extends Layouts.Layout {
	//	}
	//
	//	definition : {
	//	}
	
Layouts.Clock = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null), "clock");
		init2_layers();
		init3_finish();
	}
},
Layouts.Clock.prototype = new ((window.Layouts && (Layouts.Date || (window.require && require("Layouts.Date")))) || function(){})(),
Layouts.Clock.prototype.putAll({
	date				: null,
	isComponentClock	: true,
	environment			: { 
		zoom	: "wide"
	},
	onAfterRebuild : function(sender){
		with(this){
			var prevDate = date;
			if(!prevDate){
				var fn = function(){
					var save = date;
					outer.parentNode && (
						onAfterRebuild(null) && (
							date = save,
							rebuild("timer")
						),
						setTimeout(fn, 999)
					);
				}
				this.date = true; // prevent unwanted recursion here
				fn();
			}
			var value = new Date();
			date = format("H:mm", value);
			return date != prevDate
						? (
							inner.innerHTML = date,
							shape.title = format("yyyy-MM-dd H:mm ZZZZ", value),
							true
						)
						: false;
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-clock{"+
				"display:inline-block;"+
				"position:relative;"+
				"vertical-align:top"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Clock) // <%/FORMAT%>