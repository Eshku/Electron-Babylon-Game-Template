export class Force {
	/**
	 * @param {string} name - The unique name for this force.
	 * @param {Vector3} velocity - The force’s velocity (its contribution).
	 * @param {number} maxVelocity - Maximum magnitude allowed from this force.
	 * @param {number|null} duration - Duration in seconds (null means infinite, delete conditionally).
	 */

	constructor(name, velocity, maxMagnitude, duration) {
		this.name = name
		this.impulse = velocity
		this.maxMagnitude = maxMagnitude
		this.duration = duration // seconds; if <= 0, force expires
	}
}
