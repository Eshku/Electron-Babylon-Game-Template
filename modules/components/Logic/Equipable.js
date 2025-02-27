const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Equipable extends Component {
	constructor(slots = []) {
		super()
		this.slots = slots // E.g., ["action_bar", "spell_book", "weaponslot", "armorslots"]
	}
}
