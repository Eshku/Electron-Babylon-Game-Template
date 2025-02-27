/**
 * Stores loaded assets.
 * @type {Map<string, { asset: BABYLON.AssetContainer, id: number, addedToScene:boolean }>}
 */

export class AssetManager {
	constructor() {
		this.assets = new Map()
		this.nextID = 1
	}

	async loadAndCloneAssetAsync(assetName, modelPath, modelFileName) {
		await this.loadAssetAsync(assetName, modelPath, modelFileName)

		return await this.cloneAsset(assetName)
		//use only clones, keep original stored
		//also don't need to worry about linked animations in original (idk why it's a thing)
	}

	async loadAssetAsync(assetName, modelPath, modelFileName) {
		if (this.assets.has(assetName)) {
			console.warn(`Asset ${assetName} is already loaded.`)
			return
		}

		const asset = await BABYLON.SceneLoader.LoadAssetContainerAsync(modelPath, modelFileName, undefined)

		this.assets.set(assetName, {
			asset,
			id: this.nextID++,
			addedToScene: false,
		})

		return asset
	}

	cloneAsset(originalAssetName, newAssetName) {
		const originalAssetData = this.getAssetData(originalAssetName)
		if (!originalAssetData) {
			console.warn(`Asset ${originalAssetName} not found.`)
			return null
		}

		const clonedAsset = originalAssetData.asset.instantiateModelsToScene(
			name => name, // cause why would I care
			true, // clone materials
			{ doNotInstantiate: true }
		)

		return clonedAsset
	}

	async addToScene(assetName, scene) {
		const assetData = this.getAssetData(assetName)

		if (!assetData || assetData.addedToScene) return

		assetData.asset.addAllToScene(scene)
		assetData.addedToScene = true
	}

	async removeFromScene(assetName, scene) {
		const assetData = this.getAssetData(assetName)

		if (!assetData || !assetData.addedToScene) return

		assetData.asset.removeAllFromScene(scene)
		assetData.addedToScene = false
	}

	getAssetData(assetName) {
		return this.assets.get(assetName)
	}
}

export const assetManager = new AssetManager()
