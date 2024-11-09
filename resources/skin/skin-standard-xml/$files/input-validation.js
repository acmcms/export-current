/**
 * Prevent validation running on invisible inputs
 */


var inputValidateRequiredIfVisible = function(event){
	if(!this.checkVisibility() || this.value != ""){
		setCustomValidity("");
		return;
	}
	setCustomValidity("Required field");
};

function initInputValidationWhenVisible(){
	// var inputs = document.getElementsByTagName('input');
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
	var i, fn, input;
	for(i = inputs.length - 1; i >= 0; --i){
		input = inputs[i];
		fn = inputValidateRequiredIfVisible.bind(input);
		input.removeAttribute("required");
		input.setAttribute("x-js-validate", "required");
		input.addEventListener("change", fn);
		input.addEventListener("input", fn);
		setTimeout(fn, 0);
	}
}
