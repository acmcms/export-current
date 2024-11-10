/**
 * Prevent validation running on invisible inputs
 */


var inputValidateRequiredIfVisible = function(event){
	const es = this.form?.elements[this.name];
	if(!es){
		console.log("InputValidationIfVisible: check, orphan, %s", this.name);
		return;
	}
	const ea = "function" === typeof es.forEach ? es : [].concat(es);
	if(![this].concat(Array.from(this.labels??[])).some(function(x){
			return x.checkVisibility({visibilityProperty:true});
	})){
		console.log("InputValidationIfVisible: check, hidden, %s", this.name);
		ea.forEach(function(x){ 
			x.setAttribute("disabled", "disabled");
			x.setCustomValidity(""); 
		});
		return;
	}
	if(es.value != ""){
		console.log("InputValidationIfVisible: check, valid, %s", this.name);
		ea.forEach(function(x){ 
			x.removeAttribute("disabled"); 
			x.setCustomValidity(""); 
		});
		return;
	}
	console.log("InputValidationIfVisible: check, required, %s", this.name);
	ea.forEach(function(x){ 
		x.removeAttribute("disabled"); 
		x.setCustomValidity("Required field."); 
	});
};

function initInputValidationWhenVisible(){
	var inputs = document.querySelectorAll("input[required=required], select[required=required]");
	if(!inputs || inputs.length == 0){
		console.log("InputValidationIfVisible: no illegible inputs found");
		return;
	}
	if("function" !== typeof inputs[0].setCustomValidity){
		console.log("InputValidationIfVisible: setCustomValidity is not supported, won't initialize.");
		return;
	}
	if("function" !== typeof inputs[0].checkVisibility){
		console.log("InputValidationIfVisible: checkVisibility is not supported, won't initialize.");
		return;
	}
	var i, e, fn, input;
	for(i = inputs.length - 1; i >= 0; --i){
		e = inputs[i]; if(!e.form || !e.name || e.hasAttribute("disabled")) {
			console.log("InputValidationIfVisible: skip element: %s", e.name || e);
			continue;
		}
		fn = inputValidateRequiredIfVisible.bind(e);
		e.removeAttribute("required");
		e.setAttribute("x-js-validate", "required");
		e.addEventListener("change", fn);
		e.addEventListener("input", fn);
		e.addEventListener("transitionend", setTimeout.bind(null, fn, 17));
		setTimeout(fn, 17);
	}
}
