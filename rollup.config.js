import * as fs from "fs";
import * as path from "path";
import copy from "rollup-plugin-copy";
import watch from "rollup-plugin-watch";
import scss from "rollup-plugin-scss";
import {getBuildPath} from "./foundry-path.js";
import {RollupManifestBuilder} from "./build/rollup-plugin-manifest-builder.js";
import {RollupPackBuilder} from "./build/rollup-plugin-pack-builder.js";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const systemPath = getBuildPath(packageJson.name);

console.log(`Bundling to ${systemPath}`);

export default cliArgs => {
	return ({
		input: ["module/js/main.js"],
		output: {
			file: path.join(systemPath, "module.js"),
		},
		plugins: [
			RollupManifestBuilder.getPlugin(systemPath),
			scss({fileName: "css/module.css"}),
			copy({
				targets: [
					{src: "module/art/*", dest: path.join(systemPath, "art")},
					{src: "module/data/*", dest: path.join(systemPath, "data")},
					{src: "module/icons/*", dest: path.join(systemPath, "icons")},
					{src: "module/lang/*", dest: path.join(systemPath, "lang")},
					{src: "module/scss/*", dest: path.join(systemPath, "scss")},
					{src: "module/tokens/*", dest: path.join(systemPath, "tokens")},
					{src: "module/ui/*", dest: path.join(systemPath, "ui")},
					{src: "module/initialization.json", dest: systemPath},
				].filter(Boolean),
			}),
			(cliArgs.configPacks || process.env.NODE_ENV === "production")
				? null
				// FIXME this does not track *new* files, only changes/deletions to existing files
				: watch({
					dir: path.join(process.cwd(), "module"),
					include: [
						/module\/(art|data|icons|lang|scss|tokens|ui)(\/.*)?/,
						/module\/(initialization\.json)/,
					],
				}),
			(cliArgs.configPacks || process.env.NODE_ENV === "production")
				? RollupPackBuilder.getPlugin(systemPath)
				: null,
		].filter(Boolean),
	});
};
