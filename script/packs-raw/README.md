A staging directory for raw pack data (i.e., that copied from a module or world). Packs should be in `classic-level` format (i.e., one directory per pack).

The [unpack-packs](..%2Funpack-packs.js) script can then be used to convert the pack's contents to JSON/HTML, which can subsequently be built into the module by running `npm run build:packs`.
