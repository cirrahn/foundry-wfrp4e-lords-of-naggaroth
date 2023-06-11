import {SpeciesStageMod} from "./chargen/species.js";
import {UiNaggaroth} from "./ui/ui-naggaroth.js";

import "../scss/skin-naggaroth.scss";

Hooks.once("init", () => {
	UiNaggaroth.onHookInit();
});

Hooks.once("ready", () => {
	SpeciesStageMod.onHookReady();
});
