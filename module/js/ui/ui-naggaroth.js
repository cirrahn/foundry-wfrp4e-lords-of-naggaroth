import {Consts} from "../consts.js";

export class UiNaggaroth {
	static _doSkinShow (skin) {
		document.documentElement.classList.toggle("skin-naggaroth", skin === "naggaroth");
	}

	static onHookInit () {
		game.settings.register(Consts.MODULE_ID, Consts.SETTING_SKIN, {
			name: "Skin",
			hint: "Configure which skin to use.",
			scope: "world",
			config: true,
			default: "default",
			type: String,
			choices: {
				"default": "Default",
				"naggaroth": "Naggaroth",
			},
			onChange: skin => this._doSkinShow(skin),
		});

		this._doSkinShow(game.settings.get(Consts.MODULE_ID, Consts.SETTING_SKIN));
	}
}
