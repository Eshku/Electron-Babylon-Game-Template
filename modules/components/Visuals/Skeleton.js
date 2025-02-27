const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Skeleton extends Component {
	constructor(skeleton) {
		super()
		this.skeleton = skeleton
		this.bones = skeleton.bones
		this.boneNames = this.bones.map(bone => bone.name)

		this.handPrefixes = [
			'mixamorig:LeftHand',
			'mixamorig:LeftForeArm',
			'mixamorig:LeftArm',
			'mixamorig:LeftShoulder',
			'mixamorig:RightHand',
			'mixamorig:RightForeArm',
			'mixamorig:RightArm',
			'mixamorig:RightShoulder',
		]

		this.spinePrefixes = [`mixamorig:Spine`, `mixamorig:Spine1`, `mixamorig:Spine2`]
		this.neckPrefixes = [`mixamorig:Neck`]
		this.headPrefixes = [`mixamorig:Head`, `mixamorig:HeadTop_End`]

		this.eyePrefixes = [`mixamorig:Leye`, `mixamorig:Reye`]

		this.upperBodyBones = skeleton.bones.filter(
			bone =>
				bone.name.startsWith('mixamorig:LeftArm') ||
				bone.name.startsWith('mixamorig:RightArm') ||
				bone.name.startsWith('mixamorig:LeftHand') ||
				bone.name.startsWith('mixamorig:RightHand') ||
				bone.name.startsWith('mixamorig:Head') ||
				bone.name.startsWith('mixamorig:Neck') ||
				bone.name.startsWith('mixamorig:Spine1') ||
				bone.name.startsWith('mixamorig:Spine2') ||
				bone.name.startsWith('mixamorig:Spine')
		)

		this.lowerBodyBones = skeleton.bones.filter(
			bone =>
				bone.name.startsWith('mixamorig:Hips') ||
				bone.name.startsWith('mixamorig:LeftUpLeg') ||
				bone.name.startsWith('mixamorig:RightUpLeg') ||
				bone.name.startsWith('mixamorig:LeftLeg') ||
				bone.name.startsWith('mixamorig:RightLeg') ||
				bone.name.startsWith('mixamorig:LeftFoot') ||
				bone.name.startsWith('mixamorig:RightFoot') ||
				bone.name.startsWith('mixamorig:LeftToeBase') ||
				bone.name.startsWith('mixamorig:RightToeBase')
		)

		this.handBones = skeleton.bones.filter(
			bone =>
				bone.name.startsWith('mixamorig:LeftHand') ||
				bone.name.startsWith('mixamorig:LeftForeArm') ||
				bone.name.startsWith('mixamorig:LeftArm') ||
				bone.name.startsWith('mixamorig:LeftShoulder') ||
				bone.name.startsWith('mixamorig:RightHand') ||
				bone.name.startsWith('mixamorig:RightForeArm') ||
				bone.name.startsWith('mixamorig:RightArm') ||
				bone.name.startsWith('mixamorig:RightShoulder')
		)

		this.castingBonePrefixes = [...this.handPrefixes, ...this.spinePrefixes]

		this.castingBones = this.bones.filter(bone => this.castingBonePrefixes.some(prefix => bone.name.startsWith(prefix)))

		this.nonCastingBones = this.bones.filter(
			bone => bone.name.startsWith('mixamorig:') && !this.castingBonePrefixes.some(prefix => bone.name.startsWith(prefix))
		)

	}
}
