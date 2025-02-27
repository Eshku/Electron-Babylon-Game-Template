export class EntityManager {
	constructor() {
		this.entities = new Map() // Entity ID -> Entity
		this.entitiesByType = new Map() // Entity Type -> Entity
		this.nextEntityId = 0
	}

	async createEntity(ClassName, ...args) {
		const entity = new ClassName(...args)
		entity.id = this.nextEntityId++
		this.entities.set(entity.id, entity)
		await entity.init()

		this.entitiesByType.set(entity.entityType, entity)

		this.onEntityReady(entity)
		return entity
	}

	onEntityReady(entity) {}

	destroyEntity(entity) {
		this.entities.delete(entity.id)
		this.entitiesByType.delete(entity.entityType)
	}

	getEntityById(id) {
		return this.entities.get(id)
	}

	getEntitiesByType(entityTypes, components = []) {
		if (!Array.isArray(entityTypes)) entityTypes = [entityTypes]
		if (!Array.isArray(components)) components = [components]

		const entities = []
		for (const entityType of entityTypes) {
			for (const entity of this.entities.values()) {
				if (entity.entityType === entityType && components.every(component => entity.hasComponent(component))) {
					entities.push(entity)
				}
			}
		}
		return entities
	}

	getAllEntities() {
		return Array.from(this.entities.values())
	}

	hasComponent(entity, componentName) {
		return entity.hasComponent(componentName)
	}

	getPlayer() {
		return this.entitiesByType.get('Player')
	}

	async spawnEntity(ClassName, position, ...args) {
		const entity = await this.createEntity(ClassName, ...args)
		if (!entity) return null // Handle entity creation failure

		const spawnPosition = await this.findValidSpawnPosition(position, entity)

		//!now won't work, gonna be different based on mesh \ controller

		//entity.getComponent('Mesh').mesh.position = v3(0, 40, 0)
		/* 		if (spawnPosition && entity.hasComponent('Mesh')) {
			entity.getComponent('Mesh').mesh.position = spawnPosition
		} else if (spawnPosition) {
			console.warn(`Entity ${entity.name} doesn't have a Mesh component. Position not set.`)
		} else {
			console.error(`Could not find a valid spawn position for ${entity.name} near ${position}.`)
			this.destroyEntity(entity) // Clean up if we couldn't spawn
			return null
		} */

		return entity
	}

	async findValidSpawnPosition(position, entity) {
		const meshComponent = entity.getComponent('Mesh')
		if (!meshComponent) return null
		const ellipsoid = meshComponent.mesh.ellipsoid
		const ellipsoidOffset = meshComponent.mesh.ellipsoidOffset.y

		const ray = new BABYLON.Ray(position.add(new BABYLON.Vector3(0, 50, 0)), new BABYLON.Vector3(0, -1, 0), 100)
		const pickInfo = scene.pickWithRay(ray, mesh => {
			// Ignore the entity's own mesh in the raycast
			return mesh !== meshComponent.mesh
		})

		if (pickInfo.hit) {
			return pickInfo.pickedPoint
		} else {
			return null // No suitable spawn point found
		}
	}
}

export const entityManager = new EntityManager()
