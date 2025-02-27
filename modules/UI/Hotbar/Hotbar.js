const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

export class Hotbar {
	constructor() {
		this.name = this.constructor.name
		this.assignedSkillIds = []
		this.activeSkill = null
		this.cooldowns = new Map()

		this.skillSlotTemplate = `
            <div class="skill_slot">
                <div class="cooldown-timer"></div>
                <div class="icon"></div> 
                <div class="keybinding"></div>
                <div class="description">Empty Slot</div>
            </div>`
		this.hotbarTemplate = `
            <div id="skill_panel">
                <div class="skill_slots">
                    ${Array(10).fill(this.skillSlotTemplate).join('')}
                </div>
            </div>`

		$(canvas).after(this.hotbarTemplate)

		this.$hotbar = $('#skill_panel')
		this.$skillCells = this.$hotbar.find('.skill_slot')

		this.init()
	}

	async init() {
		await this.loadCSS()
		this.createKeyHints()
		this.updateHotbar()
		this.setupEventListeners()
		this.selectSkill(0)
	}

	updateHotbar() {
		const player = entityManager.getPlayer()

		const skillsAssigned = player.getComponent('Skills')
		if (skillsAssigned) {
			this.assignedSkillIds = skillsAssigned.slots.map(skillEntity => skillEntity?.id)
			this.updateHotbarVisuals()
		}
	}

	updateSlot(slotIndex, skill) {
		const $slot = this.$skillCells.eq(slotIndex)
		$slot.find('img').remove()
		if (skill) {
			const { path: icon, value: name } = skill.getComponent('Icon')
			if (icon) {
				$slot.append(`<img src="${icon}" alt="${name}">`)
			}
			$slot.find('.description').html(this.generateSkillDescription(skill))
		} else {
			$slot.find('.description').html('Empty Slot')
		}
		this.updateCooldownTimer(slotIndex, 0)
	}

	updateHotbarVisuals() {
		this.assignedSkillIds.forEach((skillId, index) => this.updateSlot(index, entityManager.getEntityById(skillId)))
		this.selectSkill(0)
	}

	setupEventListeners() {
		eventEmitter.on('hotbarSlotSelected', slotIndex => this.selectSkill(slotIndex))
		eventEmitter.on('hotbarSlotActivated', (skillId, cooldown) => this.startCooldown(skillId, parseFloat(cooldown)))
		eventEmitter.on('cooldownUpdate', (skillId, remainingTime) => {
			const slotIndex = this.getSlotIndexFromSkillId(skillId)
			if (slotIndex !== -1) this.updateCooldownTimer(slotIndex, remainingTime)
		})
		eventEmitter.on('cooldownFinished', skillId => this.endCooldown(skillId))
	}

	selectSkill(slotIndex) {
		const skillId = this.getSkillIdFromSlot(slotIndex)
		this.highlightActiveSkill(slotIndex)
		this.setActiveSkill(skillId)
		eventEmitter.emit('ActionSelected', skillId, slotIndex, 'skill')
	}

	highlightActiveSkill(slotIndex) {
		this.$skillCells.removeClass('active').eq(slotIndex).addClass('active')
	}

	setActiveSkill(skillId) {
		this.activeSkill = entityManager.getEntityById(skillId)
	}

	startCooldown(skillId, cooldownDuration) {
		const slotIndex = this.getSlotIndexFromSkillId(skillId)
		if (slotIndex !== -1) this.updateCooldownTimer(slotIndex, cooldownDuration)
	}

	endCooldown(skillId) {
		const slotIndex = this.getSlotIndexFromSkillId(skillId)
		if (slotIndex !== -1) this.updateCooldownTimer(slotIndex, 0)
	}

	updateCooldownTimer(slotIndex, time) {
		const $slot = this.$skillCells.eq(slotIndex)
		const $cooldownTimer = $slot.find('.cooldown-timer')
		$cooldownTimer
			.text(time.toFixed(1) || 0)
			.parent()
			.toggleClass('on-cooldown', time > 0)
	}

	async loadCSS() {
		const { loadCSSAsync } = await import(`${PATH_LIBRARY}/Eshku.async.core.js`)
		await loadCSSAsync(`${PATH_UI}/Hotbar/Hotbar.css`)
	}

	createKeyHints() {
		this.$skillCells.each((index, cell) => {
			const keyHint = index === 9 ? 0 : index + 1
			$(cell).find('.keybinding').text(keyHint)
		})
	}

	getSkillIdFromSlot(slotIndex) {
		return this.assignedSkillIds[slotIndex]
	}

	generateSkillDescription(skill) {
		const name = skill.getComponent('Name').value
		const icon = skill.getComponent('Icon').path
		const rarity = skill.getComponent('Rarity')?.value
		const type = skill.getComponent('Type')?.type
		const cooldown = skill.getComponent('Cooldown')?.cooldown
		const damage = skill.getComponent('Damage')?.value

		let description = `<div class="img_box ${rarity?.toLowerCase()}"><img src="${icon}" alt="${name} Icon"></div><div class="txt_box">
						   <div class="skill_stats"><div class="header">Stats</div>`

		description += this._formatSkillProperty('Type', type)
		description += this._formatSkillProperty('Damage', damage)
		description += this._formatSkillProperty('Cooldown', cooldown, 's')

		const range = skill.getComponent('Range')?.range
		const speed = skill.getComponent('Speed')?.speed

		if (range || speed) {
			description += `<div class="header">Projectile</div>`
			if (range) {
				description += this._formatSkillProperty('Range', range, 'm')
			}
			if (speed) {
				description += this._formatSkillProperty('Speed', speed, 'm/s')
			}
		}

		const statusComponent = skill.getComponent('Status')
		if (statusComponent?.effects.length) {
			description += '<div class="header">Effects</div>'
			statusComponent.effects.forEach(({ type, damage, duration }) => {
				description += `<div class="item"><span class="label">${type}</span><span class="value">${damage} damage over ${duration}<span class="unit">s</span></div>`
			})
		}

		description += '</div>'
		return description
	}

	_formatSkillProperty(label, value, unit = '') {
		return `<div class="item"><span class="label">${label}</span><span class="value">${value}<span class="unit">${unit}</span></span></div>`
	}

	getSlotIndexFromSkillId(skillId) {
		return this.assignedSkillIds.indexOf(skillId)
	}

	static async create() {
		return new this()
	}
}
