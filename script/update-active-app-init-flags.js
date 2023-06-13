/**
 * Assign folder flags to the active app's document.
 */
(async () => {
	const $getAppElement = app => {
		if (!app?.element) return null;
		if (app.element instanceof jQuery) return app.element;
		return $(app.element);
	};

	const app = Object.entries(ui.windows)
		.map(([appId, app]) => {
			const zIndex = Number(((($getAppElement(app)[0] || {}).style || {})["z-index"] || -1));
			if (isNaN(zIndex) || !~zIndex) console.warn(`Could not determine z-index for app ${appId}`);
			return {
				appId,
				app,
				zIndex: isNaN(zIndex) ? -1 : zIndex,
			};
		})
		.sort((a, b) => b.zIndex - a.zIndex)
		.map(({app}) => app)
		.filter(app => app.document)[0];

	if (!app) throw new Error(`No document app open!`);

	const parentName = prompt(`Enter parent folder name for document "${app.document.name}"`);
	if (!parentName) return console.log("Cancelled.");

	await app.document.update({
		flags: {
			"wfrp4e-lords-of-naggaroth": {
				"initialization-folder": parentName,
				"sort": 0,
			},
		},
	});

	console.log(`Updated "${app.document.name}"!`);
})();
