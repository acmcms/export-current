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

/**
 * show.xsl.tpl:181's `<xsl:value-of disable-output-escaping="yes" select="rawHeadData[not($clean)]"/>`
 * injects real production markup (DataTables' library-loading <script src> tags, an inline init
 * <script>, a <style> block - see Ae3WebService.js's prepareHtmlTable()) straight into <head>, with
 * no wrapping element of its own - it's a bare disable-output-escaping value, sibling to <head>'s
 * other (all-element) children.
 *
 * Pages are now served as text/html (HTML5), which natively supports raw embedded <script>/<style>
 * blocks in server-rendered markup - unlike strict XML (application/xhtml+xml), the reason a
 * server-side CDATA-wrap + client-side unwrap step existed here at all. Saxon's server-side
 * serializer (ru.myx.ae3.l2.xml.XslServerRender) now passes disable-output-escaping content straight
 * through raw/unescaped, so rawHeadData's <script>/<style> blocks are already live elements in the
 * initial HTML5-parsed DOM - no unwrap step needed. See this package's MAGIC.md.
 */
