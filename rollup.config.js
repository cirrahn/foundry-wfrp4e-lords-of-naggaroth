import * as fs from "fs";
import * as path from "path";
import {getBuildPath} from "./foundry-path.js";
import {RollupManifestBuilder} from "./build/rollup-plugin-manifest-builder.js";
import copy from "rollup-plugin-copy";
import watch from "rollup-plugin-watch";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const systemPath = getBuildPath(packageJson.name);

console.log(`Bundling to ${systemPath}`);

export default {
	input: ["module/js/main.js"],
	output: {
		file: path.join(systemPath, "module.js"),
	},
	plugins: [
		RollupManifestBuilder.getPlugin(systemPath),
		copy({
			targets: [
				{src: "module/data/*", dest: path.join(systemPath, "data")},
				{src: "module/packs/*", dest: path.join(systemPath, "packs")},
			],
		}),
		process.env.NODE_ENV === "production"
			? null
			// FIXME this does not track *new* files, only changes/deletions to existing files
			: watch({
				dir: path.join(process.cwd(), "module"),
				include: [
					/module\/(data|packs)(\/.*)?/,
				],
			}),
	].filter(Boolean),
};
