/**
 * Convert advance tiers to HTML.
 */
(async () => {
	const SYMBOLS = ["✠", "♟", "♜", "♛"];

	const ipt = window.prompt("Enter tiers text");

	const chunks = ipt
		.trim()
		.replace(/\r/g, "")
		.split(/\n\n+/g);
	if (chunks.length !== 4) throw new Error(`Expected 4 tiers!`);

	const packIndexSkillsCore = await game.packs.get("wfrp4e-core.skills").getIndex();
	const packIndexTalentsCore = await game.packs.get("wfrp4e-core.talents").getIndex();
	const packIndexTalentsNaggaroth = await game.packs.get("wfrp4e-lords-of-naggaroth.talents").getIndex();

	const getLookupName = str => {
		return str
			.replace(/\([^)]*\)/g, "")
			.trim()
			.toLowerCase();
	};

	const pts = chunks
		.map((chunk, i) => {
			const lines = chunk
				.trim()
				.split("\n");
			if (lines.length !== 4) throw new Error(`Expected 4 lines in tier!`);

			const [rawTier, rawSkills, rawTalents, rawTrappings] = lines;

			const [tierName, tierRank] = rawTier
				.replace(/^Tier \d:/, "")
				.trim()
				.split(/[-–]/g)
				.map(it => it.trim())
				.filter(Boolean);

			const [rankMedal, rankNumber] = tierRank.split(" ").map(it => it.trim()).filter(Boolean);

			const skillLinks = rawSkills
				.replace(/^Skills:/, "")
				.trim()
				.split(", ")
				.map(it => it.trim())
				.filter(Boolean)
				.map(it => {
					const lookup = getLookupName(it);

					const fromPack = packIndexSkillsCore
						.find(pk => getLookupName(pk.name));

					if (!fromPack) throw new Error(`Could not find skill "${it}" ("${lookup}")`);

					return `@UUID[${fromPack.uuid}]{${it}}`;
				});

			const talentLinks = rawTalents
				.replace(/^Talents:/, "")
				.trim()
				.split(", ")
				.map(it => it.trim())
				.filter(Boolean)
				.map(it => {
					const lookup = getLookupName(it);

					const fromPack = packIndexTalentsCore.find(pk => getLookupName(pk.name))
						|| packIndexTalentsNaggaroth.find(pk => getLookupName(pk.name));

					if (!fromPack) throw new Error(`Could not find talent "${it}" ("${lookup}")`);

					return `@UUID[${fromPack.uuid}]{${it}}`;
				});

			return `
<h3><strong>${SYMBOLS[i]} ${tierName}</strong></h3>

<p>
	<strong>Status</strong>: ${rankMedal} ${rankNumber}

	<br>

	<strong>Skills</strong>: ${skillLinks.join(", ")}

	<br>

	<strong>Talents</strong>: ${talentLinks.join(", ")}

	<br>

	<strong>Trappings</strong>: ${rawTrappings.replace(/^Trappings:/, "").trim()}
</p>`;
		});

	const out = pts.join(`\n\n<br><br>\n\n`);
	console.log(out);
	copy(out);
	console.warn("Copied to clipboard!");
})();
