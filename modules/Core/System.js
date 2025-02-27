const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

export class System {
	constructor() {
		this.priority = 0
		this.entities = new Set()
		this.systemManager = null
		this.entityManager = entityManager

		this.name = this.constructor.name
		this.requiredComponents = []
	}

	onAddedToManager() {}

	// Called in setup, make sure all dependencies await.
	async init() {}

	// Called before the physics update.
	updateBeforePhysics(entities, delta) {
    }

	updateBeforeRender(entities, delta) {
    }

	update(){
		//default render method
	}

	//!Physics run before render by babylon.
}
