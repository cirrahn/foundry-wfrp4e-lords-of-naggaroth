/**
 * Quickly flip class and career group.
 */
(async () => {
	const docs = await game.packs.get("wfrp4e-lords-of-naggaroth.careers").getDocuments();

	const allowed = [
		"Disciple of Khaine",
		"Beastmaster",
		"Sorceress of Ghrond",
		"Black Ark Corsair",
	];

	for (const doc of docs) {
		if (allowed.includes(doc.system.careergroup.value.trim())) continue;

		console.log(`Updating ${doc.name} (${doc.system.class.value} -- ${doc.system.careergroup.value})`);

		await doc.update({
			system: {
				"careergroup.value": doc.system.class.value,
				"class.value": doc.system.careergroup.value,
			},
		});
	}
})();
