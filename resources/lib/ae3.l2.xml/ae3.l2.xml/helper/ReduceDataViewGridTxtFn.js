/**
 * Reduces a "data-view" layout to a 2-column "grid" (field title | value) for plain text
 * specifically - see ReduceDataViewGridPdfFn.js for the PDF sibling, deliberately kept separate
 * rather than shared: plain text has no "link" concept (unlike PDF's native PdfLayoutLink), so a
 * "link"-variant field is folded into one readable "value (prefix+value+suffix)" string instead
 * of a real link node.
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

function reduceDataViewGridTxt(layout){
	const fields = layout.fields || [];
	const values = layout.values || {};

	/** "grid", not "sequence" - skin-standard-xml (the skin assigned to every Share-based
	 * context, text included) registers its own "Sequence.jso" that would intercept a "sequence"
	 * wrapper and call makeSequenceReply(), which expects layout.options, not this function's
	 * layout.elements. No "Grid.jso" exists there, so "grid" reaches TextTargetContext's own
	 * getLayoutForContext("grid") untouched - registered there as TextLayoutSequence.INSTANCE
	 * (walks "elements" in order, one per line; "width"/"border" are pdf/html-specific and are
	 * safely ignored, same as any other unused property). */
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

module.exports = reduceDataViewGridTxt;
