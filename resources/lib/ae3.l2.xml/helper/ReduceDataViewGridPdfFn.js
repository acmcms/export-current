/**
 * Reduces a "data-view" layout to a 2-column "grid" (field title | value) for PDF specifically -
 * see ReduceDataViewGridTxtFn.js for the plain-text sibling, deliberately kept separate rather
 * than shared: PDF has a real native "link" primitive (PdfLayoutLink, registered in
 * PdfTargetContext.LAYOUTS) so a "link"-variant field renders as an actual clickable link here,
 * where plain text has no such concept and has to fall back to inline "value (url)" text instead.
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
		return {
			layout : "link",
			href : prefix + value + suffix,
			title : String(value)
		};
	}
	if("object" === typeof value && !Array.isArray(value) && !value.layout){
		return Format.jsDescribe(value);
	}
	return value;
}

function reduceDataViewGridPdf(layout){
	const fields = layout.fields || [];
	const values = layout.values || {};

	/** "grid", not "sequence" - skin-standard-xml (the skin assigned to every Share-based
	 * context, PDF included) registers its own "Sequence.jso" that would intercept a "sequence"
	 * wrapper and call makeSequenceReply(), which expects layout.options, not this function's
	 * layout.elements. No "Grid.jso" exists there, so "grid" reaches PdfTargetContext's own
	 * native getLayoutForContext("grid") (PdfLayoutGrid) untouched. */
	return {
		layout : "grid",
		title : layout.title || layout.attributes && layout.attributes.title || undefined,
		width : 2,
		border : true,
		elements : Array(fields).flatMap(function(field){
			const key = field.id || field.name;
			return [
				field.title || field.name || key || "",
				reduceFieldValue(field, key ? values[key] : undefined)
			];
		})
	};
}

module.exports = reduceDataViewGridPdf;
