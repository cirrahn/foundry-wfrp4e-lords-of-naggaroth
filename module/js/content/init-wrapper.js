import {Consts} from "../consts.js";

export class WFRP4eNaggarothInitWrapper extends FormApplication {
	render () {
		new game.wfrp4e.apps.ModuleInitializer(
			Consts.MODULE_ID,
			"Lords of Naggaroth Content Initialization",
			`<img src="modules/${Consts.MODULE_ID}/ui/logo.webp" style="margin-right: auto;margin-left: auto;width: 40%;display: block;"/>
			<p class="notes">Initialize Lords of Naggaroth Module?<br><br>Import or update all Journals into your world, and sort them into folders</p>
			<ul>
			<li>1 Journal Entries containing 4 Pages</li>
			<li>4 Rollable Tables</li>
			</ul>
			<p class="notes">
			Warhammer Fantasy Roleplay 4th Edition &quot;Lords of Naggaroth&quot; Homebrew Module.<br><br>

			All credit to original authors.<br><br>

			Warhammer Fantasy Roleplay 4th Edition © Copyright Games Workshop Limited 2023. Warhammer Fantasy Roleplay 4th Edition, the Warhammer Fantasy Roleplay 4th Edition logo, GW, Games Workshop, Warhammer, The Game of Fantasy Battles, the twin-tailed comet logo, and all associated logos, illustrations, images, names, creatures, races, vehicles, locations, weapons, characters, and the distinctive likeness thereof, are either ® or TM, and/or © Games Workshop Limited, variably registered around the world, and used under licence. Cubicle 7 Entertainment and the Cubicle 7 Entertainment logo are trademarks of Cubicle 7 Entertainment Limited. All rights reserved.<br><br>

			<img src="modules/wfrp4e-core/warhammer.png" height=50 width=50/>
			<br>
			Homebrew by: <b>Naggaroth Anon</b><br>
			Foundry Edition by: <b>archa</b> and <b>cirrahn</b><br>`,
		).render(true);
	}
}
