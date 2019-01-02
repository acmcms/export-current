// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Date || (parent.Layouts && (Layouts.Date = parent.Layouts.Date)) || (
	// v 0.0g
	//
	//	-= MyX =-
	//
	//	Text is a simple layout, whose idea is to take whole available space 
	//	as a text for its contents.
	//
	//
	//	Usage:
	//		var date = new Layouts.Date( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	date : extends Layouts.Layout {
	//	}
	//
	//	definition : {
	//		format	: date format
	//		date	: milliseconds from epoch
	//	}
	
Layouts.Date = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null), "date");
		init2_layers();
		init3_finish();
	}
},
Layouts.Date.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Date.prototype.putAll({
	date				: null,
	isComponentTerminal	: true,
	isComponentContainer: false,
	isComponentSequence	: false,
	isComponentDate		: true,
	environment		: { 
		zoom	: "wide"
	},
	//
	//	see: http://java.sun.com/j2se/1.5.0/docs/api/java/text/SimpleDateFormat.html
	//
	//	Letter 	Date or Time Component 	Presentation 		Examples 
	//	//G		Era designator 			Text 				AD 
	//	y		Year 					Year 				1996; 96 
	//	M		Month in year 			Month 				July; Jul; 07 
	//	//w		Week in year			Number 				27 
	//	//W		Week in month 			Number 				2 
	//	//D		Day in year 			Number 				189 
	//	d 		Day in month 			Number 				10 
	//	//F		Day of week in month 	Number 				2 
	//	E		Day in week 			Text 				Tuesday; Tue 
	//	a 		Am/pm marker 			Text 				PM 
	//	H 		Hour in day (0-23) 		Number 				0 
	//	k 		Hour in day (1-24) 		Number 				24 
	//	K 		Hour in am/pm (0-11) 	Number 				0 
	//	h 		Hour in am/pm (1-12) 	Number 				12 
	//	m 		Minute in hour 			Number 				30 
	//	s 		Second in minute 		Number 				55 
	//	S 		Millisecond 			Number 				978 
	//	z 		Time zone 				General time zone 	Pacific Standard Time; PST; GMT-08:00 
	//	Z 		Time zone 				RFC 822 time zone 	-0800
	//
	format : function(format, date){
		var result = format;
		var i = function(s){
			return result.indexOf(s) != -1;
		};
		var r = function(s, x, l){
			while(String(x).length < l){
				x = "0" + x;
			}
			result = result.replace(s,x);
		};
		var z = function(o){
			return (o < 0 ? "+" : "-") + ((o = Math.abs(o)) < 10 * 60 ? "0" : "") + (Math.floor(o / 60 * 100) + (o % 60));
		};
		i("yyyy")	&& r("yyyy"	, date.getFullYear(), 4);
		i("yy")		&& r("yy"	, date.getFullYear() % 100, 2);
		i("y")		&& r("y"	, date.getFullYear(), 0);
		i("MM")		&& r("MM"	, date.getMonth()+1, 2);
		i("M")		&& r("M"	, date.getMonth()+1, 0);
		i("dd")		&& r("dd"	, date.getDate(), 2);
		i("d")		&& r("d"	, date.getDate(), 0);
		i("EE")		&& r("EE"	, date.getDay(), 2);
		i("E")		&& r("E"	, date.getDay(), 0);
		i("HH")		&& r("HH"	, date.getHours(), 2);
		i("H")		&& r("H"	, date.getHours(), 0);
		i("a")		&& r("a"	, date.getHours() >= 12 ? "PM" : "AM", 0);
		i("KK")		&& r("KK"	, (date.getHours()%12 || 12 - 1), 2);
		i("K")		&& r("K"	, (date.getHours()%12 || 12 - 1), 0);
		i("hh")		&& r("hh"	, date.getHours()%12 || 12, 2);
		i("h")		&& r("h"	, date.getHours()%12 || 12, 0);
		i("kk")		&& r("kk"	, date.getHours()+1, 2);
		i("k")		&& r("k"	, date.getHours()+1, 0);
		i("mm")		&& r("mm"	, date.getMinutes(), 2);
		i("m")		&& r("m"	, date.getMinutes(), 0);
		i("ss")		&& r("ss"	, date.getSeconds(), 2);
		i("s")		&& r("s"	, date.getSeconds(), 0);
		i("S") && (
			i("SSS")	&& r("SSS"	, date.getMilliseconds(), 3),
			i("SS")		&& r("SS"	, date.getMilliseconds(), 0),
			i("S")		&& r("S"	, date.getMilliseconds(), 0)
		);
		i("Z") && (
			i("ZZZZ")	&& r("ZZZZ"	, z(date.getTimezoneOffset()), 5),
			i("ZZZ")	&& r("ZZZ"	, z(date.getTimezoneOffset()), 0),
			i("ZZ")		&& r("ZZ"	, z(date.getTimezoneOffset()), 0),
			i("Z")		&& r("Z"	, z(date.getTimezoneOffset()), 0)
		);
		return result;
	},
	onAfterRebuild : function(sender){
		with(this){
			outer.className = zoom == zoom_compact
								? "ui-date-compact"
								: "ui-date-block"
			var prevDate = date;
			inner.innerHTML = this.date = new Date(definition.date);
			return this.date != prevDate;
		} 
	},
	setupDocument : function(document){
		var source = 
			"ui-date-block{"+
				"display:block;"+
				"position:relative;"+
				"vertical-align:top"+
			"}"+
			"ui-date-compact{"+
				"display:inline-block;"+
				"position:relative;"+
				"vertical-align:top"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Date) // <%/FORMAT%>