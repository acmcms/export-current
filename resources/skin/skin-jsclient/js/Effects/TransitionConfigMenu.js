// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.TransitionConfigMenu || (parent.Effects && (Effects.TransitionConfigMenu = parent.Effects.TransitionConfigMenu)) || (
	// v 0.2a
	//
	//	-= MyX =-
	//
	// Creates a menu structure to configure Effects.Transition facility.
	//
	
Effects.TransitionConfigMenu = {
	// v 0.0a
	//
	//	-= MyX =-
	//
	layout	: "button",
	text : "Display Transitions",
	icon : "film",
	submenu : [],
	_setSpeed : function(layout, speed){
		var oldSpeed = Effects.Transition.prototype.speed;
		Effects.Transition.prototype.setSpeed(speed);
		// update selection
		for(var i in Effects.TransitionConfigMenu.submenu){
			var element = Effects.TransitionConfigMenu.submenu[i];
			(element.speed == oldSpeed || element.speed == speed) && (
				element.checked = element.speed == speed, 
				element.invalidate && element.invalidate()
			);
		}
	},
	_speed : function(speed){
		Effects.TransitionConfigMenu.submenu.push({
			layout	: "button",
			text : !speed
						? "Disable trasitions"
						: speed == 2
							? "Normal"
							: "Speed: " + (2 / speed) + "x",
			icon : speed ? "film" : "stop",
			speed : speed,
			checked: function(){
				return Effects.Transition.prototype.speed == speed;
			},
			onClick : function(){
				Effects.TransitionConfigMenu._setSpeed(this, speed);
			}
		});
	}
},
Effects.TransitionConfigMenu._speed(0),
Effects.TransitionConfigMenu._speed(1),
Effects.TransitionConfigMenu._speed(2),
Effects.TransitionConfigMenu._speed(4),
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.TransitionConfigMenu) // <%/FORMAT%>