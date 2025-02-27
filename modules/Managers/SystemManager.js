//TODO Load systems and components dynamically, scan folder or idk ¯\_(ツ)_/¯

const { System } = await import(`${PATH_CORE}/System.js`)

const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

// Control
const { PlayerMoveDecision } = await import(`${PATH_SYSTEMS}/Behaviour/PlayerMoveDecision.js`)

// State
const { StateSystem } = await import(`${PATH_SYSTEMS}/Behaviour/StateSystem.js`)

// Movement
const { ForceSystem } = await import(`${PATH_SYSTEMS}/Behaviour/ForceSystem.js`)
const { ImpulseSystem } = await import(`${PATH_SYSTEMS}/Behaviour/ImpulseSystem.js`)
const { MovementSystem } = await import(`${PATH_SYSTEMS}/Behaviour/MovementSystem.js`)

// Rotation after movement
const { RotationSystem } = await import(`${PATH_SYSTEMS}/Visuals/RotationSystem.js`)


const { AnimationSystem } = await import(`${PATH_SYSTEMS}/Visuals/AnimationSystem.js`)

// Actions
const { ActionTrigger } = await import(`${PATH_SYSTEMS}/Behaviour/ActionTrigger.js`)
const { JumpSystem } = await import(`${PATH_SYSTEMS}/Behaviour/JumpSystem.js`)

const { CooldownSystem } = await import(`${PATH_SYSTEMS}/Item/CooldownSystem.js`)
const { ProjectileSystem } = await import(`${PATH_SYSTEMS}/Behaviour/ProjectileSystem.js`)

// Environment
const { DayNightCycle } = await import(`${PATH_SYSTEMS}/Environment/DayNightCycle.js`)

class SystemManager {
	constructor() {
		// Separate arrays for different update timings.
		this.systems = [] // List of all systems
		this.updateLoops = {
			updateBeforePhysics: [],
			updateAfterPhysics: [],
			updateBeforeRender: [],
			update: [],
			updateAfterRender: [],
		}
		this.systemConfigs = new Map()
		this.entityManager = entityManager

		this.addSystem(DayNightCycle)
		this.addSystem(PlayerMoveDecision, ['Player'])
		
		this.addSystem(StateSystem, ['Player', 'Creature'])
		
		this.addSystem(JumpSystem, ['Player'])

		this.addSystem(ForceSystem, ['Player'])
		this.addSystem(ImpulseSystem, ['Player'])
		this.addSystem(MovementSystem, ['Player'])

		this.addSystem(RotationSystem, ['Player', 'Creature'])
		this.addSystem(AnimationSystem, ['Player', 'Creature'], ['Animation'])
		this.addSystem(ActionTrigger, ['Player'])
		this.addSystem(CooldownSystem, ['Skill', 'Item'], ['Cooldown'])
		this.addSystem(ProjectileSystem, ['Projectile'])

		this.setFPS()
		this.setObservables()
	}

	setObservables() {
		//TODO need better way to define order, this won't do.
		scene.onBeforePhysicsObservable.add(() => {
			this.updateLoop('updateBeforePhysics', scene.getEngine().getDeltaTime() / 1000)
		})
		scene.onAfterPhysicsObservable.add(() => {
			this.updateLoop('updateAfterPhysics', scene.getEngine().getDeltaTime() / 1000)
		})

		scene.onBeforeRenderObservable.add(() => {
			this.updateLoop('updateBeforeRender', scene.getEngine().getDeltaTime() / 1000)
		})

		scene.onAfterRenderObservable.add(() => {
			this.updateLoop('updateAfterRender', scene.getEngine().getDeltaTime() / 1000)
		})
	}

	setFPS() {
		this.setSystemFPS('CooldownSystem', 30)
		//this.setSystemFPS('DayNightCycle', 60)
		//order issues with shadowcaster, gonna keep it out until we have a better way of ordering.
	}

	async addSystem(SystemClass, entityTypes = [], requiredComponents = []) {
		const system = new SystemClass()
		system.systemManager = this
		system.entityTypes = entityTypes
		system.requiredComponents = requiredComponents
		this.systems.push(system)
		this.systemConfigs.set(system.name, { lastUpdate: 0, targetFPS: 0 })

		// Iterate over keys from updateLoops
		Object.keys(this.updateLoops).forEach(methodName => {
			const method = system[methodName]

			// Check if method exists and isn't inherited from prototype
			if (typeof method === 'function' && method !== System.prototype[methodName]) {
				this.updateLoops[methodName].push(system)
			}
		})
	}

	updateLoop(loopName, delta) {
		const now = performance.now()
		const systems = this.updateLoops[loopName]

		for (const system of systems) {
			const config = this.systemConfigs.get(system.name)
			const targetFPS = config.targetFPS
			if (targetFPS === 0 || now - config.lastUpdate >= 1000 / targetFPS) {
				const systemDelta = targetFPS === 0 ? delta : (now - config.lastUpdate) / 1000
				config.lastUpdate = now
				const entities = this.entityManager.getEntitiesByType(system.entityTypes, system.requiredComponents)

				if (typeof system[loopName] === 'function') {
					system[loopName](entities, systemDelta)
				}
			}
		}
	}

	setSystemFPS(systemName, fps) {
		const system = this.getSystem(systemName)

		if (!system) {
			console.warn(`System ${systemName} not found. Cannot set FPS.`)
			return
		}
		this.systemConfigs.set(systemName, { lastUpdate: 0, targetFPS: fps })
	}

	getSystem(systemName) {
		const system = this.systems.find(s => s.name === systemName)
		if (!system) {
			console.error(`System ${systemName} not found in SystemManager.`)
			console.log(
				'Available systems:',
				this.systems.map(s => s.name)
			)
		}
		return system
	}

	async init() {
		for (const system of this.systems) {
			await system.init()
		}
	}
}
export const systemManager = new SystemManager()
