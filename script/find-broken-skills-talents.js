/**
 * Convert advance tiers to HTML.
 */
(async () => {
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

	const getPackIndexDoc = (str, pack, {isBaseOnly = false} = {}) => {
		const lookupStrict = getLookupName(str);
		const fromStrict = pack
			.find(pk => getLookupName(pk.name) === lookupStrict);
		if (fromStrict) return {indexDoc: fromStrict, isStrict: true};

		if (isBaseOnly) {
			const lookup = getLookupName(str, {isStrict: false});
			const fromSemiStrict = pack
				.find(pk => getLookupName(pk.name) === lookup);
			if (fromSemiStrict) return {indexDoc: fromSemiStrict, isStrict: true, isBase: true};
		}

		const lookup = getLookupName(str, {isStrict: false});
		const fromNonStrict = pack
			.find(pk => getLookupName(pk.name, {isStrict: false}) === lookup);
		if (fromNonStrict) return {indexDoc: fromNonStrict, isStrict: false};

		return null;
	};

	const docs = await game.packs.get("wfrp4e-lords-of-naggaroth.careers").getDocuments();
	for (const doc of docs) {
		console.log(`=== Checking "${doc.name}" ===`);

		doc.system.skills
			.forEach(it => {
				const fromPacks = [
					getPackIndexDoc(it, packIndexSkillsNaggaroth),
					getPackIndexDoc(it, packIndexSkillsCore),
					getPackIndexDoc(it, packIndexSkillsNaggaroth, {isBaseOnly: true}),
					getPackIndexDoc(it, packIndexSkillsCore, {isBaseOnly: true}),
				];
				const fromPack = fromPacks.find(it => it?.isStrict) || fromPacks.find(Boolean);
				if (!fromPack) return console.error(`Could not find skill "${it}"`);
				if (!fromPack.isStrict) console.warn(`Could not find strict match for skill: ${it} (using "${fromPack.indexDoc.name}")`);
				if (fromPack.isBase) console.warn(`Could not find strict match for skill: ${it} (using "${fromPack.indexDoc.name}")`);
			});

		doc.system.talents
			.forEach(it => {
				const fromPacks = [
					getPackIndexDoc(it, packIndexTalentsNaggaroth),
					getPackIndexDoc(it, packIndexTalentsCore),
					getPackIndexDoc(it, packIndexTalentsNaggaroth, {isBaseOnly: true}),
					getPackIndexDoc(it, packIndexTalentsCore, {isBaseOnly: true}),
				];
				const fromPack = fromPacks.find(it => it?.isStrict) || fromPacks.find(Boolean);
				if (!fromPack) return console.error(`Could not find talent "${it}"`);
				if (fromPack.isBase) console.warn(`Could not find strict match for talent: ${it} (using "${fromPack.indexDoc.name}")`);
			});
	}
})();
