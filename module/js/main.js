import {SpeciesStageMod} from "./chargen/species.js";

Hooks.once("ready", () => {
	SpeciesStageMod.onHookReady();
});
