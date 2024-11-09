/**
 * Prevent validation running on invisible inputs
 */


var inputValidateRequiredIfVisible = function(event){
	console.log("InputValidationIfVisible: callback, %s, %s", this.name, event?.type);
	if(!this.checkVisibility({visibilityProperty:true}) || this.form.elements[this.name].value != ""){
		this.setCustomValidity("");
		return;
	}
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
		e.addEventListener("transitionend", setTimeout.bind(null, fn, 15));
		setTimeout(fn, 0);
	}
}
