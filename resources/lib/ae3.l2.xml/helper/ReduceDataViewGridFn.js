/**
 * Reduces a "data-view" layout to a "sequence" of a 2-column "grid" (field title | value) built
 * from "more basic" primitives every l2 target (html/pdf/text/...) already implements natively
 * via its own getLayoutForContext() - mirrors the design DataTable.jslt already described (but
 * never implemented) for data-table, so a data-view page can render through a format's own real
 * layout engine (e.g. PdfLayoutGrid/TextLayoutSequence) instead of only ever producing XML text.
 *
 * Deliberately scoped: handles primitive values (auto-wrapped by the walker itself - see
 * TargetContextAbstract.step()), the "link" field variant (folded into one readable
 * "value (prefix+value+suffix)" string), and passes any value that already carries its own
 * "layout" straight through - the walker re-dispatches it through whatever applies on its own,
 * no manual recursion needed. Anything else falls back to Format.jsDescribe(value) rather than
 * being silently dropped.
 *
 * Not handled here (real gaps, left for a follow-up rather than faked): the "filters"/"prefix"
 * query-control form (interactive UI, not meaningful in a static render), and the richer
 * "list"/"select"/"sequence" field-variant edit-mode shapes documented in InternReplaceFieldFn.js.
 *
 * @param layout the "data-view" layout object
 * @returns a "sequence"-layout replacement
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

function reduceDataViewGrid(layout){
	const fields = layout.fields || [];
	const values = layout.values || {};

	/** "sequence" is deliberately not used as a wrapper here even though there's only one child -
	 * skin-standard-xml registers its own "Sequence.jso" that intercepts the name and calls
	 * makeSequenceReply(), which expects layout.options (a completely different shape from this
	 * function's layout.elements) and would throw "Options are required!". "grid" has no such
	 * registration on skin-standard-xml, so it reaches PdfTargetContext/TextTargetContext's own
	 * native getLayoutForContext("grid") untouched - return it directly as the top-level layout. */
	return {
		layout : "grid",
		title : layout.title || layout.attributes && layout.attributes.title || undefined,
		width : 2,
		border : true,
		elements : fields.flatMap(function(field){
			const key = field.id || field.name;
			return [
				field.title || field.name || key || "",
				reduceFieldValue(field, key ? values[key] : undefined)
			];
		})
	};
}

module.exports = reduceDataViewGrid;
