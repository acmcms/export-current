// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.Transition || (parent.Effects && (Effects.Transition = parent.Effects.Transition)) || (
Effects.Transition = function(type, target, callback){
	// v 1.6a
	//
	//	-= MyX =-
	//
	//	Performs effect transitions.
	//
	//
	//	Impl:
	/*
		{
			// can return new rel
			create : function(target, rel, callback){
			},
			resize : function(width, height){
			},
			redraw : function(rel, idx, cnt){
			},
			destroy: function(rel, callback){
			}
		}
	*/
	//
	//
	//
	
	var actualStart = new Date().getTime();

	if(!this.step){
		return new Effects.Transition(type, target, callback);
	}

	this.target = target.shape || target;

	this.stepStart = new Date().getTime();

	if(!this.speed || !(this.impl = requireScript("Effects/transition/" + type + ".js"))){
		// sorry, have to be after ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		// thats why I'm doubled dozen of lines down %-(
		var active = this.target.transitionActive;
		(active && active.abs) && (active.stepStart = 0, active.step()); // should stop
		//
		callback?.();
		return this;
	}
	
	this.initialWidth = this.target.offsetWidth;
	this.initialHeight = this.target.offsetHeight;
	this.callback = callback;
	
	var active = this.target.transitionActive;
	(active && active.abs) && (active.stepStart = 0, active.step()); // should stop
	this.target.transitionActive = this;
	
	var abs;
	if(this.target.nodeName.toLowerCase() == "div"){
		abs = this.target.cloneNode(false);
	}else{
		abs = this.target.ownerDocument.createElement("div");
		abs.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%";
	}
	this.abs = abs;

	var rel = this.target.ownerDocument.createElement("div");
	rel.style.cssText = "position:relative;width:100%;height:100%;overflow:hidden;z-index:100";
	this.rel = abs.appendChild(rel);

	this.limit = 300 * (this.speed / 2) + actualStart - this.stepStart;
	this.stepIndex = this.stepStart;
	with(this){
		rel = impl.create(target, rel, callback) || rel;
		this.task = function(){
			step();
		}; 
		step();
		rel && rel.appendChild(target.parentNode.replaceChild(abs, target));
	}
},
Effects.Transition.prototype = {
	speed : Math.min(4, ((window.require && parseInt(require("Utils.Cookies").read("tesc", 3))) || 3) - 1),
	limit : 0,
	step : function(){
		with(this){
			stepIndex = Math.min(limit, new Date().getTime() - stepStart);
			abs && (stepIndex < limit 
						? (
							impl.redraw(rel, stepIndex, limit),
							setTimeout(task, 0)
						) 
						: (
							impl.redraw(rel, 1, 1), // finish
							impl.destroy(rel, callback), 
							abs && abs.parentNode && (rel.firstChild 
											? abs.parentNode.replaceChild(rel.firstChild, abs)
											: abs.parentNode.removeChild(abs)),
							abs = rel = null,
							target.transitionActive == this && (target.transitionActive = null) // IE6 fails on 'delete target.transitionActive'
						));
		}
	},
	setSpeed : function(speed){
		this.speed = parseInt(speed);
		require("Utils.Cookies").create("tesc", this.speed + 1, 3650);
	}
},
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.Transition) // <%/FORMAT%>