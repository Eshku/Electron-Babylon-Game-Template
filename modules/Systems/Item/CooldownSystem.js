const { System } = await import(`${PATH_CORE}/System.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class CooldownSystem extends System {
	constructor() {
		super()
		this.lastUpdate = 0
		this.updateInterval = 0.1
	}

	init() {
		eventEmitter.on('startCooldown', skillEntity => this.startCooldown(skillEntity))
	}

	update(entities, delta) {
		this.updateCooldowns(entities, delta)
		this.updateHotbar(entities, delta)
	}

	updateCooldowns(entities, delta) {
		for (const entity of entities.values()) {
			const cooldownComponent = entity.getComponent('Cooldown')
			if (cooldownComponent && cooldownComponent.isOnCooldown) {
				cooldownComponent.remainingTime = Math.max(0, cooldownComponent.remainingTime - delta)
				if (cooldownComponent.remainingTime <= 0) {
					cooldownComponent.isOnCooldown = false
					cooldownComponent.remainingTime = 0
					eventEmitter.emit('cooldownFinished', entity.id)
				}
			}
		}
	}

	startCooldown(skillEntity) {
		const targetNameID = skillEntity.entityNameID

		const entitiesToUpdate = this.systemManager.entityManager.getEntitiesByType(['Skill', 'Item'], ['Cooldown'])

		for (const entity of entitiesToUpdate) {
			const cooldownComponent = entity.getComponent('Cooldown')
			if (entity.entityNameID === targetNameID) {
				if (!cooldownComponent.isOnCooldown) {
					cooldownComponent.isOnCooldown = true
					cooldownComponent.remainingTime = cooldownComponent.cooldown
					eventEmitter.emit('cooldownUpdate', entity.id, cooldownComponent.remainingTime)
				}
			}
		}
	}

	updateHotbar(entities, delta) {
		this.lastUpdate += delta
		if (this.lastUpdate >= this.updateInterval) {
			this.lastUpdate = 0
			for (const entity of entities) {
				const cooldownComponent = entity.getComponent('Cooldown')
				if (cooldownComponent && cooldownComponent.isOnCooldown) {
					eventEmitter.emit('cooldownUpdate', entity.id, cooldownComponent.remainingTime)
				}
			}
		}
	}
}
