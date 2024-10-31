const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

 
ipcMain.on('create-country', (event, newCountry) => {
    const filePath = path.join(__dirname, newCountry.fileName); 
    const data = newCountry.fileContents;

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error(err);
            return;  
        }
        event.reply('country-created'); 
    });
});

 
ipcMain.on('read-countries', (event) => {
    const directoryPath = __dirname;  
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(err);
            return;  
        }
        const countries = files.map(file => ({
            fileName: file,
            fileContents: fs.readFileSync(path.join(directoryPath, file), 'utf-8'),  
        }));
        event.reply('countries-read', countries); 
    });
});

 
ipcMain.on('delete-country', (event, fileName) => {
    const filePath = path.join(__dirname, fileName);  
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        event.reply('country-deleted'); 
    });
});
