const { Component } = await import(`${PATH_CORE}/Component.js`)

const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class Animation extends Component {
	constructor(animationGroups = []) {
		super()
		this.animationGroups = animationGroups
		this.currentAnimation = null
		this.previousAnimation = null
		this.targetAnimation = null
		this.animationBlendSpeed = 4
	}

	addAnimation(animation) {
		this.animationGroups.push(animation)
	}

	removeAnimation(animation) {
		this.animationGroups = this.animationGroups.filter(anim => anim !== animation)
	}

	init() {
		this.createMissingAnimationGroups()

		this.animationGroups.forEach(animation => {
			animation.stop()
			animation.weight = 0
		})

		const idleAnimation = this.animationGroups.find(animation => animation.name === 'idle')
		if (idleAnimation) {
			this.currentAnimation = idleAnimation
			this.currentAnimation.weight = 1
			this.currentAnimation.play(true)
		} else {
			console.warn('Idle animation not found!')
		}
	}

	createLayeredAnimationGroup(layers) {
		const layerName = layers.map(layer => layer.animationName).join('_')

		const newGroup = new BABYLON.AnimationGroup(layerName)

		layers.forEach(({ animationName, bones }) => {
			const baseGroup = this.animationGroups.find(g => g.name === animationName)

			if (!baseGroup) {
				console.warn(`Base animation group '${animationName}' not found!`)
				return
			}

			baseGroup.targetedAnimations.forEach(({ animation, target }) => {
				if (bones.some(bone => bone.name === target.name)) {
					newGroup.addTargetedAnimation(animation, target)
				}
			})
		})
		return newGroup
	}

	createMissingAnimationGroups() {
		this.createRunningCast()
		this.createJumpingCast()
		this.createFallingCast()
	}

	createRunningCast() {
		const layers = [
			{ animationName: 'run', bones: this.entity.getComponent('Skeleton').nonCastingBones },
			{ animationName: 'cast_right_hand', bones: this.entity.getComponent('Skeleton').castingBones },
		]
		this.addAnimation(this.createLayeredAnimationGroup(layers))
	}

	createJumpingCast() {
		const layers = [
			{ animationName: 'jump', bones: this.entity.getComponent('Skeleton').nonCastingBones },
			{ animationName: 'cast_right_hand', bones: this.entity.getComponent('Skeleton').castingBones },
		]
		this.addAnimation(this.createLayeredAnimationGroup(layers))
	}

	createFallingCast() {
		const layers = [
			{ animationName: 'fall', bones: this.entity.getComponent('Skeleton').nonCastingBones },
			{ animationName: 'cast_right_hand', bones: this.entity.getComponent('Skeleton').castingBones },
		]
		this.addAnimation(this.createLayeredAnimationGroup(layers))
	}
}
