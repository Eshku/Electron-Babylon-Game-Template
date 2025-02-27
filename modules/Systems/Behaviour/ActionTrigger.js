const { System } = await import(`${window.PATH_CORE}/System.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

const { FireballProjectile } = await import(`${PATH_PREFABS}/Projectiles/FireballProjectile.js`)

const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

export class ActionTrigger extends System {
	constructor() {
		super()
	}

	async updateBeforePhysics(entities, delta) {
		for (const entity of entities) {
			const controller = entity.getComponent('Controller')
			if (controller && controller.isKeyDown('MainAttack')) {
				const skillEntityId = await this.getActiveSkillEntityId()
				if (skillEntityId) {
					this.executeSkill(skillEntityId, delta)
				}
			}
		}
	}

	async getActiveSkillEntityId() {
		const { hotbar } = await import(`${PATH_ROOT}/setup.js`)
		return hotbar.activeSkill
	}

	executeSkill(skillEntity, delta) {
		if (!skillEntity) {
			console.warn(`Skill entity with ID ${skillEntityId} not found`)
			return
		}

		let skillEntityId = skillEntity.id

		const cooldownComponent = skillEntity.getComponent('Cooldown')
		if (cooldownComponent && cooldownComponent.isOnCooldown) return

		const typeComponent = skillEntity.getComponent('Type')
		if (!typeComponent) {
			console.warn(`Skill ${skillEntityId} missing Type component`)
			return
		}

		//Emit event to signal cooldown start
		eventEmitter.emit('startCooldown', skillEntity)

		switch (typeComponent.type) {
			case 'Projectile':
				this.castProjectile(skillEntity)
				break
			case 'AOE':
				this.castAOE(skillEntity)
				break
			case 'Buff':
				this.castBuff(skillEntity)
				break
			case 'Debuff':
				this.castDebuff(skillEntity)
				break
			case 'Melee':
				this.castMelee(skillEntity)
				break
			default:
				console.warn(`Unknown skill type: ${typeComponent.type}`)
		}
	}

	async castProjectile(skillEntity) {
		eventEmitter.emit('createProjectile', skillEntity)
	}

	castAOE(skillEntity) {
		console.log(`${skillEntity.name} (AOE) cast!`)
	}

	castBuff(skillEntity) {
		console.log(`${skillEntity.name} (Buff) cast!`)
	}

	castDebuff(skillEntity) {
		console.log(`${skillEntity.name} (Debuff) cast!`)
	}

	castMelee(skillEntity) {
		console.log(`${skillEntity.name} (Melee) cast!`)
	}
}
