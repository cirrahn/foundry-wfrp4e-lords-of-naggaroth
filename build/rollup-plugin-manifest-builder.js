import fs from "fs";
import path from "path";

export class RollupManifestBuilder {
	static getPlugin (systemPath) {
		return {
			name: "buildManifest",

			generateBundle () {
				const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

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
					"packs": [
						{
							"name": "careers",
							"label": "Careers",
							"system": "wfrp4e",
							"path": "packs/careers",
							"type": "Item",
						},
						{
							"name": "journal-entries",
							"label": "Journals (Lords of Naggaroth)",
							"system": "wfrp4e",
							"path": "packs/journal-entries",
							"type": "JournalEntry",
						},
						{
							"name": "spells",
							"label": "Spells",
							"system": "wfrp4e",
							"path": "packs/spells",
							"type": "Item",
						},
						{
							"name": "talents",
							"label": "Talents",
							"system": "wfrp4e",
							"path": "packs/talents",
							"type": "Item",
						},
						{
							"name": "trappings",
							"label": "Trappings",
							"system": "wfrp4e",
							"path": "packs/trappings",
							"type": "Item",
						},
						{
							"name": "tables",
							"label": "Tables (Lords of Naggaroth)",
							"system": "wfrp4e",
							"path": "packs/tables",
							"type": "RollTable",
						},
					],

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
					},
				};

				fs.mkdirSync(systemPath, {recursive: true});
				fs.writeFileSync(path.join(systemPath, "module.json"), JSON.stringify(manifestJson, null, "\t"), "utf-8");
			},
		};
	}
}
