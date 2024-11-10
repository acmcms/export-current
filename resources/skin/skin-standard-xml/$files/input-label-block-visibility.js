/**
 * Prevent validation running on invisible blocks
 */


var blockVisibilityUpdate = function(block, event){
	const es = block.querySelectorAll("INPUT[x-ui-input=true], SELECT[x-ui-input=true], TEXTAREA[x-ui-input=true]");
	if(!es){
		console.log("blockVisibility: no eligible inputs, %s", this.name);
		return;
	}
	const ea = "function" === typeof es.forEach ? es : [].concat(es);
	if(block.checkVisibility({visibilityProperty:true,opacityProperty:true})){
		console.log("blockVisibility: check, visible, %s", this.name);
		ea.forEach(function(x){ 
			x.removeAttribute("disabled"); 
		});
	}else{
		console.log("blockVisibility: check, hidden, %s", this.name);
		ea.forEach(function(x){ 
			x.setAttribute("disabled", "disabled");
		});
	}
};

function initInputDisableInvisible(){
	var blocks = document.querySelectorAll("INPUT.el-radio+LABEL.el-radio+.el-radio-sel-item");
	if(!blocks || blocks.length == 0){
		console.log("blockVisibility: no illegible blocks found");
		return;
	}
	if("function" !== typeof blocks[0].checkVisibility){
		console.log("blockVisibility: checkVisibility is not supported, won't initialize.");
		return;
	}
	var i, block, input, fn;
	for(i = blocks.length - 1; i >= 0; --i){
		block = blocks[i];
		input = block.previousElementSibling.previousElementSibling;
		if(!input.form || input.hasAttribute("disabled")) {
			console.log("InputVisibility: skip element: %s", block.name || block);
			continue;
		}
		fn = blockVisibilityUpdate.bind(input, block);
		input.setAttribute("x-ui-debug", "block-visibility");
		block.setAttribute("x-ui-debug", "block-visibility");
		input.addEventListener("change", fn);
		input.addEventListener("input", fn);
		block.addEventListener("transitionend", setTimeout.bind(null, fn, 17));
		setTimeout(fn, 17);
	}
}
