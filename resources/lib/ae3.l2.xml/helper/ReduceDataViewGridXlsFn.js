/**
 * Reduces a "data-view" layout to a 2-column "grid" (field title | value) for XLS specifically -
 * see ReduceDataViewGridPdfFn.js/ReduceDataViewGridTxtFn.js/ReduceDataViewGridHtmlFn.js for its
 * siblings, deliberately kept separate rather than shared. Currently identical in behavior to the
 * plain-text sibling - XlsTargetContext (ae3.sys.pkg.l2.tgt.xls) only registers "string"/"grid"
 * for now (see its own header for why: matching the pdf/html/text precedent's minimal "basic"
 * primitives), no native "link" cell type yet the way PDF/HTML have via PdfLayoutLink/
 * HtmlLayoutLink - so a "link"-variant field is folded into one readable
 * "value (prefix+value+suffix)" string here too. Kept as its own file, not merged with the text
 * reduction, so XLS is free to diverge later (e.g. once a real XlsLayoutLink/hyperlink cell type
 * exists) without touching text's file.
 *
 * Relies on TargetContextAbstract.step()'s own primitive auto-wrapping (bare strings/numbers/
 * booleans/arrays get wrapped automatically) and lets any value that already carries its own
 * "layout" (e.g. a nested "data-view") recurse through the walker on its own - no manual
 * recursion needed.
 *
 * Not handled here (real gaps, left for a follow-up rather than faked): the "filters"/"prefix"
 * query-control form (interactive UI, not meaningful in a static render), and the richer
 * "list"/"select"/"sequence" field-variant edit-mode shapes documented in InternReplaceFieldFn.js.
 *
 * @param layout the "data-view" layout object
 * @returns a "grid"-layout replacement
 */
function reduceFieldValue(field, value){
	if(value === null || value === undefined){
		return "";
	}
	if(field.variant === "link" && "object" !== typeof value){
		const prefix = field.prefix || "";
		const suffix = field.suffix || "";
		return prefix || suffix ? value + " (" + prefix + value + suffix + ")" : value;
	}
	if("object" === typeof value && !Array.isArray(value) && !value.layout){
		return Format.jsDescribe(value);
	}
	return value;
}

function reduceDataViewGridXls(layout){
	const fields = layout.fields || [];
	const values = layout.values || {};

	/** "grid", not "sequence" - skin-standard-xml (the skin assigned to every Share-based
	 * context, XLS included) registers its own "Sequence.jso" that would intercept a "sequence"
	 * wrapper and call makeSequenceReply(), which expects layout.options, not this function's
	 * layout.elements. No "Grid.jso" exists there, so "grid" reaches XlsTargetContext's own
	 * native getLayoutForContext("grid") (XlsLayoutGrid) untouched. */
	return {
		layout : "grid",
		title : layout.title || layout.attributes && layout.attributes.title || undefined,
		width : 2,
		border : true,
		// this engine's Array.prototype never implements flatMap (only map/filter/forEach/reduce/
		// concat - see ru.myx.ae3.ecma.array.ImplBaseGlobalArray) - map + reduce/concat one level
		// flat instead
		elements : Array(fields).map(function(field){
			const key = field.id || field.name;
			return [
				field.title || field.name || key || "",
				reduceFieldValue(field, key ? values[key] : undefined)
			];
		}).reduce(function(flat, pair){
			return flat.concat(pair);
		}, [])
	};
}

module.exports = reduceDataViewGridXls;
