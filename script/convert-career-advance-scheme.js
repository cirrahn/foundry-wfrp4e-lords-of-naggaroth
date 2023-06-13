/**
 * Convert advances text to HTML.
 */
(() => {
	const SYMBOLS = {
		"-": "&nbsp;",
		"Base": "✠",
		"Bronze": "♟",
		"Silver": "♜",
		"Gold": "♛",
	};
	const getSymbol = (tk) => {
		if (!SYMBOLS[tk]) throw new Error(`Unknown token "${tk}"!`);
		return SYMBOLS[tk];
	};

	const ABILS = ["WS", "BS", "S", "T", "I", "Agi", "Dex", "Int", "WP", "Fel"];

	const ipt = window.prompt("Enter advances text");

	const tks = ipt
		.trim()
		.replace(/\s+/g, " ")
		.split(" ")
		.map(it => it.trim())
		.filter(Boolean);

	if (tks.length !== 20) throw new Error(`Expected 20 tokens!`);

	const ptHeaders = ABILS
		.map(it => `<td style="height:17px;width:60px;text-align:center"><p>${it}</p></td>`).join("\n");

	const ptTiers = tks
		.slice(ABILS.length)
		.map(getSymbol)
		.map(sym => `<td style="height:17px;width:60px;text-align:center"><p>${sym}</p></td>`)
		.join("\n");

	const table = `<table style="height:34px" border="1"><tbody>
<tr style="height:17px">
${ptHeaders}
</tr>
<tr style="height:17px">
${ptTiers}
</tr>
</tbody></table>`;

	console.log(table);
	copy(table);
	console.warn("Copied to clipboard!");
})();
