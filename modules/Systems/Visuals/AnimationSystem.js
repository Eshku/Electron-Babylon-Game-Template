const { System } = await import(`${window.PATH_CORE}/System.js`)

const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class AnimationSystem extends System {
	constructor() {
		super()
		this.setupEvents()
	}

	setupEvents() {
		eventEmitter.on('stateChanged', (entity, stateComp) => {
			const animationName = this.getAnimationNameForState(stateComp)

			this.swapAnimationTo(entity, animationName)
		})
	}

	update(entities, delta) {
		for (const entity of entities) {
			this.blendAnimations(entity.getComponent('Animation'), delta)
		}
	}

	blendAnimations(animationComponent, delta) {
		const blendAmount = delta * animationComponent.animationBlendSpeed

		animationComponent.animationGroups.forEach(animation => {
			if (animation !== animationComponent.currentAnimation) {
				animation.weight = 0
				animation.stop()
			}
		})

		animationComponent.previousAnimation = null

		if (animationComponent.currentAnimation) {
			animationComponent.currentAnimation.weight = BABYLON.Scalar.Lerp(
				animationComponent.currentAnimation.weight,
				1,
				blendAmount
			)
		}
	}

	swapAnimationTo(entity, animationName) {
		const animationComponent = entity.getComponent('Animation')

		const targetAnimation = animationComponent.animationGroups.find(animation => animation.name === animationName)

		if (!targetAnimation) {
			console.warn(`Animation '${animationName}' not found!`)
			return
		}

		if (animationComponent.currentAnimation !== targetAnimation) {
			animationComponent.previousAnimation = animationComponent.currentAnimation
			if (animationComponent.currentAnimation) {
				animationComponent.currentAnimation.stop()
			}
			animationComponent.currentAnimation = targetAnimation
			animationComponent.currentAnimation.play(true)
		}
	}

	getAnimationNameForState(state) {
		if (state.isDead) {
			return 'die'
		}
		if (state.isJumping && !state.isCasting && !state.isFalling) {
			//moving doesn't matter
			return 'jump'
		}
		if (!state.isJumping && !state.isCasting && state.isFalling) {
			//moving doesn't matter
			return 'fall'
		}
		if (!state.isJumping && !state.isCasting && state.isMoving && !state.isFalling) {
			return 'run'
		}
		if (!state.isJumping && state.isCasting && !state.isMoving && !state.isFalling) {
			return 'cast_right_hand'
		}
		if (!state.isJumping && !state.isCasting && !state.isMoving && !state.isFalling && !state.isDead) {
			return 'idle'
		}
		if (state.isJumping && state.isCasting && !state.isFalling) {
			return 'jump_cast_right_hand'
		}
		if (!state.isJumping && state.isCasting && state.isFalling) {
			return 'fall_cast_right_hand'
		}
		if (!state.isJumping && state.isCasting && state.isMoving && ~state.isFalling) {
			return 'run_cast_right_hand'
		}
	}
}
