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
	var i, input, fn;
	for(i = inputs.length - 1; i >= 0; --i){
		input = inputs[i]; if(!input.form || !input.name || input.hasAttribute("disabled")) {
			console.log("InputVisibility: skip element: %s", input.name || input);
			continue;
		}
		fn = inputVisibilityUpdate.bind(input);
		input.setAttribute("x-js-validate", "disable-invisible");
		input.addEventListener("change", fn);
		input.addEventListener("input", fn);
		input.addEventListener("transitionend", setTimeout.bind(null, fn, 17));
		setTimeout(fn, 17);
	}
}
