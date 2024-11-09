/**
 * Prevent validation running on invisible inputs
 */

var inputValidateCheckVisible = function(x){
	return x.checkVisibility({visibilityProperty:true});
};

var inputValidateRequiredIfVisible = function(event){
	if(!inputValidateCheckVisible(this) && !Array.from(this.labels??[]).some(inputValidateCheckVisible)){
		console.log("InputValidationIfVisible: callback, hidden, %s, %s", this.name);
		this.setCustomValidity("");
		return;
	}
	if(this.form.elements[this.name]?.value != ""){
		console.log("InputValidationIfVisible: callback, valid, %s, %s", this.name);
		this.setCustomValidity("");
		return;
	}
	console.log("InputValidationIfVisible: callback, required, %s, %s", this.name);
	this.setCustomValidity("Required field.");
};

function initInputValidationWhenVisible(){
	var inputs = document.querySelectorAll('input[required=required], select[required=required]');
	if(!inputs || inputs.length == 0){
		console.log("InputValidationIfVisible: no illegible inputs found");
	}
	if("function" !== typeof inputs[0].setCustomValidity){
		console.log("InputValidationIfVisible: setCustomValidity is not supported, won't initialize.");
	}
	if("function" !== typeof inputs[0].checkVisibility){
		console.log("InputValidationIfVisible: checkVisibility is not supported, won't initialize.");
	}
	var i, e, fn, input;
	for(i = inputs.length - 1; i >= 0; --i){
		e = inputs[i]; if(!e.form) continue;
		fn = inputValidateRequiredIfVisible.bind(e);
		e.removeAttribute("required");
		e.setAttribute("x-js-validate", "required");
		e.addEventListener("change", fn);
		e.addEventListener("input", fn);
		e.addEventListener("transitionend", setTimeout.bind(null, fn, 17));
		setTimeout(fn, 17);
	}
}
