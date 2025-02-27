class ComponentManager {
	constructor() {
		this.components = new Map() // Name -> ComponentClass
	}

	async register(name, folder) {
		try {
			if (this.components.has(name)) {
				console.warn(`Component ${name} already registered.`)
				return
			}

			const module = await import(`${PATH_COMPONENTS}/${folder}/${name}.js`)

			const ComponentClass = module[name]

			if (!ComponentClass) {
				console.error(`Component ${name} not found in module.`)
				return
			}
			this.components.set(name, ComponentClass)
		} catch (error) {
			console.error(`Failed to register component ${name}:`, error)
		}
	}

	getComponent(name) {
		return this.components.get(name) || null
	}

	hasComponent(name) {
		return this.components.has(name)
	}

	getComponentList() {
		return Array.from(this.components.keys())
	}
}

export const componentManager = new ComponentManager()


//!todo scan folders
await componentManager.register(`ArmorPenetration`, `Attributes`)
await componentManager.register(`Cooldown`, `Attributes`)
await componentManager.register(`Crit`, `Attributes`)
await componentManager.register(`Damage`, `Attributes`)
await componentManager.register(`Description`, `Attributes`)
await componentManager.register(`Health`, `Attributes`)
await componentManager.register(`Lifetime`, `Attributes`)
await componentManager.register(`Name`, `Attributes`)
await componentManager.register(`Range`, `Attributes`)
await componentManager.register(`Rarity`, `Attributes`)
await componentManager.register(`Size`, `Attributes`)
await componentManager.register(`Speed`, `Attributes`)
await componentManager.register(`Stackable`, `Attributes`)
await componentManager.register(`Status`, `Attributes`)
await componentManager.register(`Type`, `Attributes`)

await componentManager.register(`Controller`, `Logic`)
await componentManager.register(`Decay`, `Logic`)
await componentManager.register(`Delay`, `Logic`)
await componentManager.register(`Direction`, `Logic`)
await componentManager.register(`Equipable`, `Logic`)

await componentManager.register(`Jump`, `Logic`)
await componentManager.register(`Movement`, `Logic`)
await componentManager.register(`Parent`, `Logic`)
await componentManager.register(`PhysicsBody`, `Logic`)
await componentManager.register(`CharacterController`, `Logic`)
await componentManager.register(`Skills`, `Logic`)
await componentManager.register(`State`, `Logic`)
await componentManager.register(`Target`, `Logic`)

await componentManager.register(`Animation`, `Visuals`)
await componentManager.register(`Icon`, `Visuals`)
await componentManager.register(`Mesh`, `Visuals`)
await componentManager.register(`Skeleton`, `Visuals`)
//await componentManager.register(`Texture`, `Visuals`)
//await componentManager.register(`Sprite`, `Visuals`)
//await componentManager.register(`Text`, `Visuals`)
