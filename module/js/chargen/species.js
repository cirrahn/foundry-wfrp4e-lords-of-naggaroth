import {Consts} from "../consts.js";

export class SpeciesStageMod {
	static onHookReady () {
		this._onHookReady_config();
		this._onHookReady_patchSpeciesStage();
		this._onHookReady_pCheckAddCareerTable().then(null); // TODO(Future) better solution to loading content
	}

	static _onHookReady_config () {
		WFRP4E.species.delf = "Dark Elf";

		WFRP4E.speciesCharacteristics.delf = {
			"ws": "2d10+30",
			"bs": "2d10+30",
			"s": "2d10+20",
			"t": "2d10+20",
			"i": "2d10+40",
			"ag": "2d10+30",
			"dex": "2d10+30",
			"int": "2d10+30",
			"wp": "2d10+30",
			"fel": "2d10+20",
		};

		WFRP4E.speciesSkills.delf = [
			"Athletics",
			"Cool",
			"Evaluate",
			"Language (Eltharin)",
			"Intimidate",
			"Melee (Basic),",
			"Navigation",
			"Perception",
			"Gamble",
			"Ranged (Crossbow)",
			"Sail",
			"Swim",
		];

		WFRP4E.speciesTalents.delf = [
			"Acute Sense (Sight)",
			"Coolheaded, Warrior Born",
			"Night Vision",
			"Hatred", // (High Elves)
			"Second Sight/Sixth Sense",
			"Read/Write",
			0,
		];

		WFRP4E.speciesMovement.delf = 5;

		WFRP4E.speciesFate.delf = 0;

		WFRP4E.speciesRes.delf = 0;

		WFRP4E.speciesExtra.delf = 2;

		WFRP4E.speciesAge.delf = "30+10d10";

		WFRP4E.speciesHeight.delf = {
			feet: 5,
			inches: 11,
			die: "1d10",
		};
	}

	static _onHookReady_patchSpeciesStage () {
		libWrapper.register(
			Consts.MODULE_ID,
			"SpeciesStage.prototype.getData",
			async (pFn, ...args) => {
				const out = await pFn(...args);
				out.species["delf"] = "Dark Elf";
				return out;
			},
			Consts.LW_WRAPPER,
		);
	}

	static async _onHookReady_pCheckAddCareerTable () {
		if (!game.settings.get("wfrp4e-core", "initialized")) return;
		// TODO read file create table
	}
}
