import {SpeciesStageMod} from "./chargen/species.js";
import {UiNaggaroth} from "./ui/ui-naggaroth.js";
import {ContentInit} from "./content/init.js";

import "../scss/skin-naggaroth.scss";

Hooks.once("init", () => {
	UiNaggaroth.onHookInit();
	ContentInit.onHookInit();
});

Hooks.once("ready", () => {
	SpeciesStageMod.onHookReady();
	ContentInit.onHookReady();
});
