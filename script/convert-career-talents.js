/**
 * Convert advance tiers to HTML.
 */
(async () => {
	const SYMBOLS = ["✠", "♟", "♜", "♛"];

	// const ipt = window.prompt("Enter tiers text");
	const iptz = `

Tier 1: Raider – Silver 1
Skills: Climb, Consume Alcohol, Dodge, Endurance, Row, Melee (Basic), Sail, Swim
Talents: Combat Aware, Seasoned Traveller, Strong Swimmer, Strider (Coastal)
Trappings: Black Ark Sabre, Dagger

Tier 2: Corsair – Silver 3
Skills: Athletics, Cool, Gamble, Intimidate, Intuition, Lore (Torture)
Talents: Menacing, Sea Legs, Stout-hearted, Old Salt
Trappings: Sea Dragon Cloak, boarding hooks and rope, knucklebone dice

Tier 3: Reaver – Silver 6
Skills: Evaluate, Ranged (Crossbow), Perception, Language (Any), Leadership
Talents: Ambidextrous, Fast Shot, Robust, Pilot
Trappings: Repeating Handbow with 10 bolts, landing party of bloodthirsty Corsairs

Tier 4: Corsair Captain – Gold 3
Skills: Charm, Navigation
Talents: Frightening, Feint, Inspiring, Strong-minded
Trappings: Druchii corsair ship and a villainous corsair crew, Parrot Lizard-hawk, Reaving charts, eye-patch, spy glass


`
	const iptx = `

Tier 1: Apprentice Sorceress – Silver 2
Skills: Channelling (Any Lore), Dodge, Intuition, Language (Magick), Lore (Magick), Melee (Basic), Melee (Polearm), Perception
Talents: Aethyric Attunement, Power of Darkness, Read/Write, Second Sight, Petty Magic
Trappings: Ambition, Grimoire of Dark Magic, Ritual Dagger, Staff

Tier 2: Sorceress – Silver 7
Skills: Charm, Cool, Gossip, Intimidate, Lore (Daemonology), Secret Signs (Convent of Sorceresses)
Talents: Arcane Magic (Any Arcane Lore), Detect Artefact, Sixth Sense, Instinctive Diction
Trappings: Lust for Power, Imp Familiar, Convent Vestments

Tier 3: Hag Sorceress – Gold 3
Skills: Evaluate, Lore (Any), Language (Dark Tongue), Ride (Horse or Cold One)
Talents: Attractive, Magical Sense, Menacing, War Wizard
Trappings: Apprentice, Power overwhelming, Multiple familiars, Magical item

Tier 4: High Sorceress – Gold 7
Skills: Ride (Dark Pegasus), Research
Talents: Cat-tongued, Frightening, Iron Will, Schemer
Trappings: Sorcery supreme, enslaved spirits of evil, Apprentice, Dread Sanctum

`
	const iptc = `

Tier 1: Apprentice Beastmaster – Silver 1
Skills: Animal Care (Any), Animal Training (Any), Charm Animal, Endurance, Melee (Basic), Ranged (Entangling), Outdoor Survival, Perception
Talents: Ambidextrous, Sixth Sense, Strike to Stun, Hardy
Trappings: Beast Goad (Hand weapon), Whip, Trainee Lizard-hawk, Desire to be the very best

Tier 2: Beastmaster – Silver 3
Skills: Athletics, Cool, Intimidate, Lore (Beasts), Set Trap, Track
Talents: Animal Affinity, Menacing, Strider (Any), Stout-hearted
Trappings: Pair of trained Beasts, Scars from fangs and claws, Beast hide (Leather jerkin)

Tier 3: Beastslaver – Silver 5
Skills: Drive, Haggle, Ranged (Crossbow), Stealth (Rural)
Talents: Fearless (Monsters), Robust, Crack the Whip, Rover, Sure Shot
Trappings: Scourgerunner Chariot, Ravager Harpoon and 6 Barbed Bolts, Net, Assistant Beastmaster

Tier 4: High Beastmaster – Gold 1
Skills: Ride (Any), Intuition
Talents: Frightening, Strike Mighty Blow, Strong-minded, Tenacious
Trappings: Trained monster (typically a Manticore or War-Hydra in Naggaroth), Apprentice Beastmaster


`
	const ipt = `

Tier 1: Initiate – Brass 5
Skills: Channelling (Khainite Sorcery), Cool, Dodge, Intuition, Lore (Theology), Melee (Any), Language (Magick), Pray
Talents: Aethyric Attunement, Holy Visions, Strike Mighty Blow, Strong-Minded
Trappings: Sacrificial dagger, Bladed hand weapon, cult robes, Grimoire of Khainite Sorcery

Tier 2: Disciple of Khaine – Silver 2
Skills: Athletics, Charm, Lore (Torture), Intimidate, Secret Signs (Cult of Khaine), Perform (Torture)
Talents: Arcane Magic (Khainite Sorcery), Menacing, Impassioned Zeal, War Wizard
Trappings: Sacred vestments, Fighting Spines, Flesh Hooks, Torturers tools

Tier 3: Anointed – Silver 3
Skills: Climb, Endurance, Perception, Stealth (Any)
Talents: Furious Assault, Frightening, Strike to Injure, Seasoned Traveller
Trappings: Robes of Murder, Copy of the Parables of Sundered Flesh

Tier 4: Bloody Handed – Silver 5
Skills: Leadership, Melee (Any)
Talents: Combat Master, Fearless (Any), Instinctive Diction, Stout-hearted
Trappings: Draich, Mask of Khaines Aspect


`

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
					: /\([^)]*\)/g, ""
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
