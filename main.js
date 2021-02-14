const { app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron');


let wind;
let win;
let tray = null
function createContainerWindow() {
    wind = new BrowserWindow({
        width: 99999,
        height: 350,
        x: 0,
        y: 100,
        frame: false,
        movable: false,
        resizable: false,
        transparent: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    wind.loadFile('container.html')
    wind.maximize()
    wind.webContents.openDevTools()
}


function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(() => {


    tray = new Tray('imgs/icon.png')
    
    const contextMenu = Menu.buildFromTemplate([
        { label: '偏好设置...', type: 'normal', accelerator: 'CommandOrControl+,', click: () => createWindow() },
        { label: '关于Paste', type: 'normal' },
        { label: '帮助', type: 'normal' },
        { label: '', type: 'separator' },
        { label: '暂停Paste', type: 'normal' },
        { label: '退出Paste', type: 'normal', accelerator: 'CommandOrControl+Q', role: 'quit' }
    ])
    // tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        if (win) {
            win.destroy();
        }
        if (wind.isVisible()) {
            wind.hide()
        } else {
            wind.show()
        }
    })
    tray.on('right-click', () => { // 右键icon显示菜单
        tray.popUpContextMenu(contextMenu)
    })
    createWindow();
    createContainerWindow();
    // app响应快捷键
    const ret = globalShortcut.register('CommandOrControl+Shift+V', () => {
        if (win) {
            win.destroy();
        }
        if (wind.isVisible()) {
            wind.hide()
        } else {
            const contents = wind.webContents;
            contents.executeJavaScript('getClipboardContent()', true)
            wind.show()
        }
    })

    // 监听复制快捷键
    // globalShortcut.register('CommandOrControl+C', () => {
    //     console.log('CommandOrControl+C is pressed')
    // })

    if (!ret) {
        console.log('CommandOrControl+Shift+V failed')
    }

    // 检查快捷键是否注册成功
    console.log(globalShortcut.isRegistered('CommandOrControl+Shift+V'))
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('browser-window-blur', () => {
    wind.hide();
})