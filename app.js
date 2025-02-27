if (process.env.NODE_ENV === 'development') {
	require('electron-reload')(__dirname, {
		electron: require(`${__dirname}/node_modules/electron`),
	})
}

const { app, BrowserWindow, screen, ipcRenderer, contextBridge, ipcMain } = require('electron')
const path = require('path')

ipcMain.handle('get-root-directory', async () => __dirname)

app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer')
app.commandLine.appendSwitch('enable-unsafe-webgpu')
app.commandLine.appendSwitch('enable-webgpu-developer-features')

//app.commandLine.appendSwitch('disable-frame-rate-limit')
app.commandLine.appendSwitch('disable-renderer-backgrounding')
app.commandLine.appendSwitch('force_high_performance_gpu')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

app.whenReady().then(() => {
	const primaryDisplay = screen.getPrimaryDisplay()
	const { width, height } = primaryDisplay.size

	mainWindow = new BrowserWindow({
		width: width,
		height: height,
		webPreferences: {
			contextIsolation: true,
			preload: path.join(__dirname, './preload.js'),
		},
		frame: false,
		autoHideMenuBar: true,
		show: false,
	})
	mainWindow.loadFile('index.html')

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
		mainWindow.setResizable(false)
	})
})

app.on('window-all-closed', () => {
	app.quit()
})

//const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024; // In MB
