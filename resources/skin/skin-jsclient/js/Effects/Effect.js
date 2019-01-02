// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.Effect || (parent.Effects && (Effects.Effect = parent.Effects.Effect)) || (
	// v 1.0
	//
	//	-= MyX =-
	//
	//	Generic class, shouldn't be instantiated in real life.
	//
	//	Effects differ from Inserts and Layouts in that Effects are applied to existing HTML
	//	DOM structures.
	//
	//
	//	var prototype = new Effects.Effect();
	//
Effects.Effect = function(){
	if(!arguments.length){
		return;
	}
},
Effects.Blink = function(on, off, action, done){
	var left = 5, handler;
	(handler = function(){
		(--left) % 2 ? on() : off();
		left == 3 && setTimeout(action, 0);
		setTimeout(left ? handler : done, left ? 75 : 0);
	})();
},
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.Effect) // <%/FORMAT%>