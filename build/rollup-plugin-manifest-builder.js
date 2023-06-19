import fs from "fs";
import path from "path";
import {FILENAME_PACK_META} from "../script/consts.js";

export class RollupManifestBuilder {
	static _generateBundle ({systemPath}) {
		const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

		const dirPacks = "module/packs";
		const packs = fs.readdirSync(dirPacks)
			.map(dirName => {
				return {
					...JSON.parse(
						fs.readFileSync(path.join(dirPacks, dirName, FILENAME_PACK_META), "utf-8"),
					),
					name: dirName,
					path: `packs/${dirName}`,
					system: "wfrp4e",
				};
			});

		if (packs.some(it => !it.label || !it.type)) throw new Error(`One or more pack(s) did not have a label and/or type!: ${packs.filter(it => !it.label || !it.type).join(", ")}`);

		const manifestJson = {
			"id": packageJson.name,
			"title": "WFRP4e - Lords of Naggaroth",
			"description": `"Lords of Naggaroth" homebrew content for the Warhammer Fantasy 4th Edition System.`,
			"version": packageJson.version,
			"authors": [
				{
					"name": "cirrahn",
					"url": "https://www.patreon.com/cirrahn",
					"discord": "cirrahn#3081",
					"flags": {
						"patreon": "cirrahn",
						"github": "cirrahn",
					},
				},
			],
			"keywords": [
				"content",
			],
			"readme": "README.md",
			"license": "MIT",
			"manifest": `https://github.com/cirrahn/foundry-${packageJson.name}/releases/latest/download/module.json`,
			"download": `https://github.com/cirrahn/foundry-${packageJson.name}/releases/download/v${packageJson.version}/${packageJson.name}.zip`,
			"changelog": `https://raw.githubusercontent.com/cirrahn/foundry-${packageJson.name}/main/CHANGELOG.md`,

			"compatibility": {
				"minimum": "11",
				"verified": "11.300",
			},

			"esmodules": [
				"module.js",
			],
			"styles": [
				"css/module.css",
			],
			"languages": [
				{
					"lang": "en",
					"name": "English",
					"path": "lang/en.json",
				},
			],
			"packs": packs,

			"relationships": {
				"requires": [
					{
						"id": "lib-wrapper",
						"type": "module",
					},
					{
						"id": "wfrp4e",
						"type": "system",
						"manifest": "https://github.com/moo-man/WFRP4e-FoundryVTT/releases/latest/download/system.json",
					},
				],

				"recommends": [
					{
						"id": "wfrp4e-core",
						"type": "module",
						"reason": "Provides core game content",
					},
				],
			},

			"flags": {
				"initializationPacks": [
					`${packageJson.name}.journal-entries`,
					`${packageJson.name}.tables`,
				],
			},
		};

		fs.mkdirSync(systemPath, {recursive: true});
		fs.writeFileSync(path.join(systemPath, "module.json"), JSON.stringify(manifestJson, null, "\t"), "utf-8");
	}

	static getPlugin (systemPath) {
		return {
			name: "buildManifest",
			generateBundle: this._generateBundle.bind(this, {systemPath}),
		};
	}
}
