const { componentManager } = await import(`${PATH_MANAGERS}/ComponentManager.js`)

export class Entity {
	constructor() {
		this.components = {}
		this.id = null // Avaliable only after init.
		this.name = this.constructor.name
		this.entityNameID = this.name
			.replace(/([a-z])([A-Z])/g, '$1_$2') // Add underscore between camelCase words
			.toLowerCase()

		this.entityType = 'Entity'
	}

	init() {
		//Entity ID and Components access avaliable there.
	}

	async addComponent(componentName, ...constructorArgs) {
		const ComponentClass = componentManager.getComponent(componentName)
		if (!ComponentClass) {
			console.error(`Component ${componentName} not registered.`)
			return null
		}

		try {
			const component = new ComponentClass(...constructorArgs) // Pass all args to constructor
			this.components[componentName] = component
			component.entity = this

			await component.init()

			return component
		} catch (error) {
			console.error(`Error creating component ${componentName}:`, error)
			return null
		}
	}

	async compose(data) {
		const promises = []

		if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
			for (const [componentNameLower, componentData] of Object.entries(data)) {
				const componentName = this.capitalizeFirstLetter(componentNameLower)
				promises.push(this.addComponent(componentName, componentData))
			}
		} else {
			console.log('Invalid data format')
			return
		}

		try {
			await Promise.all(promises)
		} catch (error) {
			console.log('Error adding components:', error)
		}
	}

	removeComponent(componentName) {
		if (this.components[componentName]) {
			delete this.components[componentName]
		}
	}

	getComponent(componentName) {
		return this.components[componentName]
	}

	hasComponent(componentName) {
		return !!this.components[componentName]
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
}
