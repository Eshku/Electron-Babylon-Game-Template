const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	sendMessage: (channel, data) => {
		ipcRenderer.send(channel, data)
	},
	receiveMessage: (channel, func) => {
		// Ensure to remove the listener when the renderer process is destroyed
		ipcRenderer.on(channel, (event, ...args) => func(...args))
		// Cleanup listener on renderer process destroy
		window.addEventListener('beforeunload', () => {
			ipcRenderer.removeListener(channel, func)
		})
	},
	getRootDirectory: () => {
		return ipcRenderer.invoke('get-root-directory')
	},
})
