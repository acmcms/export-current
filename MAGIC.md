# MAGIC.md — acm-cvs/sys-current

## For keeper-ae3 / magic-tester

This directory is a real, already-built AE3 axiom (packaged output of the `ae3-devel-tools`
distro-build pipeline — see that project's own MAGIC.md) — `axiom/` (third-party + packaged
AE3 jars), `settings/` (JSON service/host/shell config), `resources/`, `boot.jar`
(`boot.Main`, the real launcher). It is directly bootable as-is; no rebuild is required to start
a real local server from it.

`settings/service/*.json` declares services (`{"type": "ae3.Service", "reference": "<js-module>", ...}`);
`"augments": "server"` + `"requires": "network"` (as `web.json` does) is what actually wires a
service into the request-serving path once `network`'s own service has started. `settings/web/hosts/*.json`
maps a `Host` header pattern to an `ae3.web/Share` reference — `ae3.local.json` and
`hello-world.*.json` are both already-wired, dependency-free examples suitable as smoke-test
targets (see `ae3.sys.pkg.i3.web`'s own MAGIC.md for what `ae3.local` actually returns).
`resources/lib/ru.myx.ae3.example/` holds the real `HelloWorldService`/`HelloWorldWebShare`
example implementation behind the `hello-world` host/service pair.

`interfaces.xml`/`servers.xml`/`properties.xml`/`initialize.xml` (read from `path.protected`,
not from this axiom root) is a separate, independently-supplied config tree — see `unit-test`'s
and `clean-boot`'s own MAGIC.md for that side of the boot process.
