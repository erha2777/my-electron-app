// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 970,
    //禁止改变主窗口尺寸
    resizable: false,
    // 无边框窗口
    frame: false,
    // 窗口是否为页面大小
    // useContentSize:true,
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // preload加载的js文件可以直接使用nodejs模块
      nodeIntegration: true,   //允许渲染进程使用node.js
      contextIsolation: false  //允许渲染进程使用node.js
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('public/index.html')

  // mainWindow.maximize()
  // mainWindow.webContents.openDevTools()

  // 1. 窗口 最小化
  ipcMain.on('window-min', function () { // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
    mainWindow.minimize();
  })
  // 2. 窗口 最大化、恢复
  ipcMain.on('window-max', function () {
    if (mainWindow.isMaximized()) { // 为true表示窗口已最大化
      mainWindow.restore();// 将窗口恢复为之前的状态.
    } else {
      mainWindow.maximize();
    }
  })

  // 3. 关闭窗口
  ipcMain.on('window-close', function () {
    mainWindow.close();
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

