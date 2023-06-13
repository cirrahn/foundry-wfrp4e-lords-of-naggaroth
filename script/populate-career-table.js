/**
 * Populate the career table.
 */
(async () => {
	const raw = `Sorceress of Ghrond
01-02

Duellist
03-07

Spy
08-11

Hunter
12-13

Scout
14-15

Beastmaster
16-24

Bounty Hunter
25-30

Black Ark Corsair
31-40

Seaman
41-42

Smuggler
43-45

Disciple of Khaine
46-50

Fence
51-56

Outlaw
57-62

Racketeer
62-67

Cavalryman
68-73

Guard
75-78

Knight
79-82

Pit Fighter
83-86

Protagonist
87-89

Soldier
90-100`;

	const packJournalsCore = await game.packs.get("wfrp4e-core.journal-entries").getDocuments();
	const packJournalsNaggaroth = await game.packs.get("wfrp4e-lords-of-naggaroth.journal-entries").getDocuments();

	const getLookupName = str => {
		return str
			.replace(/\([^)]*\)/g, "")
			.trim()
			.toLowerCase();
	};

	const getPackPage = (lookupCareer, packJournals) => {
		const careerJournal = packJournals.find(it => it.name === "Class and Careers");
		if (!careerJournal) throw new Error(`Could not find "Class and Careers" journal!`);

		return careerJournal.pages
			.find(pk => getLookupName(pk.name) === lookupCareer);
	};

	const pairs = raw
		.trim()
		.split(/\n\n+/g)
		.map(it => it.trim())
		.filter(Boolean)
		.map(str => {
			const [rawCareer, rawRange] = str.split("\n").map(it => it.trim()).filter(Boolean);

			const [numLow, numHigh] = rawRange.split("-").map(it => Number(it.replace(/^0+/, "")));
			if (isNaN(numLow) || isNaN(numHigh)) throw new Error(`Range was not a number!`);

			const lookupCareer = getLookupName(rawCareer);

			const fromPack = getPackPage(lookupCareer, packJournalsCore) || getPackPage(lookupCareer, packJournalsNaggaroth);

			if (!fromPack) throw new Error(`Could not find journal entry "${rawCareer}" ("${lookupCareer}")`);

			return {range: [numLow, numHigh], journalPage: fromPack};
		});

	const tbl = game.packs.get("wfrp4e-lords-of-naggaroth.tables").getName("Career - Dark Elf");

	await tbl.deleteEmbeddedDocuments("TableResult", tbl.results.map(it => it._id));

	await tbl.createEmbeddedDocuments(
		"TableResult",
		pairs
			.map(({range, journalPage}) => {
				return {
					type: 0,
					text: `@UUID[${journalPage.uuid}]{${journalPage.name}}`,
					range: range,
					drawn: false,
					img: "icons/svg/d20-black.svg",
					weight: 1,
				};
			}),
	);
})();
