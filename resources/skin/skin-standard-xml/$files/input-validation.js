/**
 * Prevent validation running on invisible inputs
 */


var inputValidateRequiredIfVisible = function(event){
	if(!this.checkVisibility() || this.value != ""){
		this.setCustomValidity("");
		return;
	}
	this.setCustomValidity("Required field.");
};

function initInputValidationWhenVisible(){
	var inputs = document.querySelectorAll('input[required=required]');
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
		e = inputs[i];
		fn = inputValidateRequiredIfVisible.bind(e);
		e.removeAttribute("required");
		e.setAttribute("x-js-validate", "required");
		e.addEventListener("change", fn);
		e.addEventListener("input", fn);
		e.addEventListener("transitionrun", setTimeout.bind(null, fn, 15));
		setTimeout(fn, 0);
	}
}
