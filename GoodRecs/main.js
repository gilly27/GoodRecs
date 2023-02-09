// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')
const path = require('path')
var os = require('os')
const fs = require('fs')
const { Configuration, OpenAIApi } = require("openai")
const config = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(config);

const runPrompt = async () => {
  const prompt = "Give me 10 good book recommendations";
  const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.7,
  })
  console.log(response.data.choices[0].text);
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 350,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

ipcMain.on("open-file", (event,data) => {
  dialog.showOpenDialog({
    filters: [{ name: 'Excel File', extensions: ['csv']}],
    defaultPath: app.getPath('downloads'),
  }).then(result => {
    fs.readFile(result.filePaths[0], 'utf8', (err, data) => {
      if(err){
        alert("Error reading file", err);
        return;
      }
      runPrompt();
    });
  }).catch(err => {
    console.log(err)
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

