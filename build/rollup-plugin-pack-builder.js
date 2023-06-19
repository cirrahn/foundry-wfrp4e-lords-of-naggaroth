import fs from "fs";
import path from "path";
import {lsRecursiveSync, setDotPath} from "../script/utils.js";
import {ClassicLevel} from "classic-level";
import {DB_OPTS, FILENAME_PACK_META, RECORD_PATH_KEY_DELIM} from "../script/consts.js";

export class RollupPackBuilder {
	static _PACK_DIR = "module/packs";

	static async _pGenerateBundle ({systemPath}) {
		const dirPacksOut = path.join(systemPath, "packs");
		fs.mkdirSync(dirPacksOut, {recursive: true});

		for (const dirName of fs.readdirSync(this._PACK_DIR)) {
			const filePaths = lsRecursiveSync(path.join(this._PACK_DIR, dirName));

			const htmlAddons = {};
			const filePathsJson = filePaths
				.filter(filePath => {
					if (path.basename(filePath) === FILENAME_PACK_META) return false;

					if (filePath.endsWith(".json")) return true;
					if (!filePath.endsWith(".html")) throw new Error(`Unexpected file in packs dir: "${filePath}"`);

					const filename = path.basename(filePath, ".html");
					const [name, dotPath] = filename.split(RECORD_PATH_KEY_DELIM);
					(htmlAddons[name] ||= []).push({dotPath, content: fs.readFileSync(filePath, "utf-8")});

					return false;
				});

			const db = new ClassicLevel(path.join(dirPacksOut, dirName), DB_OPTS);
			const batch = db.batch();

			for (const filePathJson of filePathsJson) {
				const json = JSON.parse(fs.readFileSync(filePathJson, "utf-8"));
				const filename = path.basename(filePathJson, ".json");

				if (htmlAddons[filename]) {
					htmlAddons[filename]
						.forEach(({dotPath, content}) => setDotPath(json, dotPath, content));
				}

				const key = json._key;
				delete json._key;
				batch.put(key, json);
			}

			await batch.write();
			await db.close();
		}
	}

	static getPlugin (systemPath) {
		return {
			name: "buildPacks",
			generateBundle: this._pGenerateBundle.bind(this, {systemPath}),
		};
	}
}
