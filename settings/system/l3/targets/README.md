Descriptors for `ru.myx.ae3.i3.web.WebContextOutputRegistry`, scanned from `/union/settings/system/l3/targets/*.json` across every unit.

This unit (`ae3.web` / `ae3.sys.pkg.i3.web`) only reads and dispatches - it does not implement any target/output itself, so it ships no descriptors here. Each unit that actually implements a target (an `l2.tgt.*` unit, or any other) contributes its own `*.json` file under its own `ae3-packages/<pkg>/settings/system/l3/targets/`.

Descriptor shape:

```json
{
	"extensions" : ["xhtml", "xhtm"],
	"aliases" : ["xhtml", "xhtml+xml"],
	"contentTypes" : ["application/xhtml+xml"],
	"priority" : 0,
	"context" : {
		"reference" : "java.class/fully.Qualified.ClassName"
	}
}
```

- `extensions` are used for extension matching (`.ext` requests, file/resource-based auto-detect) and are also exposed as keyword aliases for explicit `___output=`.
- `aliases` are optional extra keyword-only names (for explicit `___output=`/API-style selection) that are not treated as file extensions.
- `contentTypes` are used for MIME-like matching (currently from request `Accept` header tokens) and are also exposed as keyword aliases for explicit `___output=`.
- Default fallback is keyword-based, hardcoded in dispatcher: `auto-detect` and `*`. Both are looked up and all matches are compared by `priority`; the highest wins.
- `priority` is treated as `0.0..1.0` for implicit matching (extension/default); values above `1.0` are clamped to `1.0`.
- Negative `priority` means the descriptor must not match implicitly at all (extension/default), but it can still be selected by explicit `___output=` (or equivalent programmatic explicit selection).
- `context.reference` must be `java.class/<FQCN>` naming a public class with a `(TargetInterface, ServeRequest)` constructor.
