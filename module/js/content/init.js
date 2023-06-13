import {Consts} from "../consts.js";
import {WFRP4eNaggarothInitWrapper} from "./init-wrapper.js";

export class ContentInit {
	static onHookInit () {
		game.settings.register(Consts.MODULE_ID, Consts.SETTING_INITIALIZED, {
			name: "Initialization",
			scope: "world",
			config: false,
			default: false,
			type: Boolean,
		});

		game.settings.registerMenu(
			Consts.MODULE_ID,
			Consts.SETTING_INIT_DIALOG,
			{
				name: "Lords of Naggaroth Content Setup",
				label: "Setup",
				hint: "Import or update the content from the Lords of Naggaroth Module",
				type: WFRP4eNaggarothInitWrapper,
				restricted: true,
			},
		);
	}

	static onHookReady () {
		if (!game.settings.get(Consts.MODULE_ID, Consts.SETTING_INITIALIZED) && game.user.isGM) new WFRP4eNaggarothInitWrapper().render(true);
	}
}
