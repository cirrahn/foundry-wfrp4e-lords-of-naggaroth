import fs from "fs";
import {ClassicLevel} from "classic-level";

const DB_OPTS = {valueEncoding: "json", keyEncoding: "utf-8"};

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

test(
	"Journals should have flags",
	async () => {
		const dbRoot = new ClassicLevel("./module/packs/journal-entries", DB_OPTS);
		const db = dbRoot.sublevel("journal", DB_OPTS);

		for await (const [, value] of db.iterator()) {
			expect(value).toHaveProperty(`flags.${packageJson.name}.initialization-folder`);
			expect(value).toHaveProperty(`flags.${packageJson.name}.sort`);
		}
	},
);

test(
	"Tables should have flags",
	async () => {
		const dbRoot = new ClassicLevel("./module/packs/tables", DB_OPTS);
		const db = dbRoot.sublevel("tables", DB_OPTS);

		for await (const [, value] of db.iterator()) {
			expect(value).toHaveProperty(`flags.${packageJson.name}.initialization-folder`);
			expect(value).toHaveProperty(`flags.${packageJson.name}.sort`);
		}
	},
);
