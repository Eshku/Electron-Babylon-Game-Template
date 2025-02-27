export class Component {
	constructor() {
		this.name = this.constructor.name
		this.entity = null // Reference to the owning entity
	}

	async init() {} // Optional initialization logic
}
