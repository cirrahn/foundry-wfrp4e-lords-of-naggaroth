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
	const packIndexSkillsNaggaroth = await game.packs.get("wfrp4e-lords-of-naggaroth.skills").getIndex();
	const packIndexTalentsCore = await game.packs.get("wfrp4e-core.talents").getIndex();
	const packIndexTalentsNaggaroth = await game.packs.get("wfrp4e-lords-of-naggaroth.talents").getIndex();

	const getLookupName = (str, {isStrict = true} = {}) => {
		return str
			.replace(
				isStrict
					? /\((?:Any(?: [^)]+)?|\s*)?\)/g
					: /\([^)]*\)/g, "",
			)
			.trim()
			.toLowerCase();
	};

	const getPackIndexDoc = (str, pack) => {
		const lookupStrict = getLookupName(str);
		const fromStrict = pack
			.find(pk => getLookupName(pk.name) === lookupStrict);
		if (fromStrict) return {indexDoc: fromStrict, isStrict: true};

		const lookup = getLookupName(str, {isStrict: false});
		const fromNonStrict = pack
			.find(pk => getLookupName(pk.name, {isStrict: false}) === lookup);
		if (fromNonStrict) return {indexDoc: fromNonStrict, isStrict: false};

		return null;
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
					const fromPacks = [
						getPackIndexDoc(it, packIndexSkillsNaggaroth),
						getPackIndexDoc(it, packIndexSkillsCore),
					];
					const fromPack = fromPacks.find(it => it?.isStrict) || fromPacks.find(Boolean);
					if (!fromPack) throw new Error(`Could not find skill "${it}"`);

					if (!fromPack.isStrict) console.warn(`Could not find strict match for skill: ${it} (using "${fromPack.indexDoc.name}")`);

					return `@UUID[${fromPack.indexDoc.uuid}]{${it}}`;
				});

			const talentLinks = rawTalents
				.replace(/^Talents:/, "")
				.trim()
				.split(", ")
				.map(it => it.trim())
				.filter(Boolean)
				.map(it => {
					const fromPacks = [
						getPackIndexDoc(it, packIndexTalentsNaggaroth),
						getPackIndexDoc(it, packIndexTalentsCore),
					];
					const fromPack = fromPacks.find(it => it?.isStrict) || fromPacks.find(Boolean);
					if (!fromPack) throw new Error(`Could not find talent "${it}"`);

					return `@UUID[${fromPack.indexDoc.uuid}]{${it}}`;
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

	copy(pts.join(`\n\n<br><br>\n\n`));
	console.warn("Copied to clipboard!");
})();
