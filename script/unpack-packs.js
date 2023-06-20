import fs from "fs";
import {ClassicLevel} from "classic-level";
import path from "path";
import {delDotPath, getDotPath, getRecursiveClean, getSlugged} from "./utils.js";
import {DB_OPTS, RECORD_PATH_KEY_DELIM} from "./consts.js";

class PackUnpacker {
	static _PACK_DIR = "script/packs-raw";

	static _HTML_PATHS = [
		{keyPrefix: "actors", dotPath: "system.details.biography.value"},
		{keyPrefix: "items", dotPath: "system.description.value"},
		{keyPrefix: "journal.pages", dotPath: "text.content"},
	];

	/* -------------------------------------------- */

	static _getSluggedName ({keyToMeta, keyIdPart, value}) {
		const baseName = value.name ? getSlugged(value.name) : value._id;

		const parentKey = keyIdPart.split(".").slice(0, -1).join(".");
		if (!parentKey.length) return baseName;

		const parentMeta = keyToMeta[parentKey];
		if (!parentMeta) {
			// We expect the DB to give us parents before children
			console.warn(`No parent with key "${parentKey}" found!`);
			return baseName;
		}

		const ix = parentMeta.cntChildren++;

		return `${parentMeta.name}--${ix}-${baseName}`;
	}

	/* -------------------------------------------- */

	static _mutRecordExtractHtml ({value, keyPrefixPart, dirSub, name}) {
		const htmlPaths = this._HTML_PATHS.filter(it => it.keyPrefix === keyPrefixPart);

		for (const {dotPath} of htmlPaths) {
			const val = getDotPath(value, dotPath);
			if (!val) continue;

			fs.writeFileSync(path.join(dirSub, `${name}${RECORD_PATH_KEY_DELIM}${dotPath}.html`), val, "utf-8");

			delDotPath(value, dotPath);
		}
	}

	/* -------------------------------------------- */

	static _mutRecordCleanJunkData ({value}) {
		["ownership", "_stats", "sort"]
			.forEach(prop => delete value[prop]);
	}

	/* -------------------------------------------- */

	static _mutRecordCleanFlags ({value}) {
		if (!value.flags) return;

		if (value.flags?.["wfrp4e-core"]) delete value.flags["wfrp4e-core"];
		value.flags = getRecursiveClean(value.flags);
	}

	/* -------------------------------------------- */

	static async pRun () {
		const dirNames = fs.readdirSync(this._PACK_DIR)
			.filter(dirName => fs.statSync(path.join(this._PACK_DIR, dirName)).isDirectory());

		for (const dirName of dirNames) {
			const db = new ClassicLevel(path.join(this._PACK_DIR, dirName), DB_OPTS);

			const dirOut = path.join(`module/packs`, dirName);
			fs.mkdirSync(dirOut, {recursive: true});

			const keyToMeta = {};

			for await (const [key, value] of db.iterator()) {
				value._key = key;

				const keyPrefixPart = key.split("!").slice(1, 2)[0];
				const keyIdPart = key.split("!").at(-1);

				const dirSub = path.join(dirOut, ...keyPrefixPart.split("."));
				fs.mkdirSync(dirSub, {recursive: true});

				const name = this._getSluggedName({keyToMeta, keyIdPart, value});
				keyToMeta[keyIdPart] = {name, cntChildren: 0};

				this._mutRecordExtractHtml({value, keyPrefixPart, dirSub, name});
				this._mutRecordCleanJunkData({value});
				this._mutRecordCleanFlags({value});

				fs.writeFileSync(path.join(dirSub, `${name}.json`), JSON.stringify(value, null, "\t"), "utf-8");
			}
		}
	}
}

PackUnpacker.pRun()
	.then(() => console.log("Done!"))
	.catch(e => { throw e; });
