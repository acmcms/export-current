/**
 * Prevent validation running on invisible inputs
 */


var inputVisibilityUpdate = function(event){
	const es = this.form?.elements[this.name];
	if(!es){
		console.log("InputVisibility: check, orphan, %s", this.name);
		return;
	}
	const ea = "function" === typeof es.forEach ? es : [].concat(es);
	if([this].concat(Array.from(this.labels??[])).some(function(x){
			return x.checkVisibility({visibilityProperty:true});
	})){
		console.log("InputVisibility: check, valid, %s", this.name);
		ea.forEach(function(x){ 
			x.removeAttribute("disabled"); 
		});
	}else{
		console.log("InputVisibility: check, hidden, %s", this.name);
		ea.forEach(function(x){ 
			x.setAttribute("disabled", "disabled");
		});
	}
};

function initInputDisableInvisible(){
	var inputs = document.querySelectorAll("input, select, textarea");
	if(!inputs || inputs.length == 0){
		console.log("InputVisibility: no illegible inputs found");
		return;
	}
	if("function" !== typeof inputs[0].checkVisibility){
		console.log("InputVisibility: checkVisibility is not supported, won't initialize.");
		return;
	}
	var i, e, fn, input;
	for(i = inputs.length - 1; i >= 0; --i){
		e = inputs[i]; if(!e.form || !e.name || e.hasAttribute("disabled")) {
			console.log("InputVisibility: skip element: %s", e.name || e);
			continue;
		}
		fn = inputVisibilityUpdate.bind(e);
		e.setAttribute("x-js-validate", "disable-invisible");
		e.addEventListener("change", fn);
		e.addEventListener("input", fn);
		e.addEventListener("transitionend", setTimeout.bind(null, fn, 17));
		setTimeout(fn, 17);
	}
}
