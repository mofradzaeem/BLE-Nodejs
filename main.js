const noble = require('ble-host');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let SERVICE_UUID = '4fafc2011fb5459e8fccc5c9c331914b';
let CHARACTERISTIC_UUID = 'beb5483e36e14688b7f5ea07361b26a8';
let peripheralId = '';

noble.on('stateChange', function (state) {
    if (state === 'poweredOn' && peripheralId !== '') {
        noble.startScanning([SERVICE_UUID], false);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function (peripheral) {
    if (peripheral.id === peripheralId) {
        noble.stopScanning();

        peripheral.connect(function (error) {
            console.log('Connected to device');

            peripheral.discoverServices([SERVICE_UUID], function (error, services) {
                var service = services[0];
                service.discoverCharacteristics([CHARACTERISTIC_UUID], function (error, characteristics) {
                    var characteristic = characteristics[0];
                    console.log('Discovered characteristic');

                });
            });
        });
    }
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    ipcMain.on('connect-to-device', async (event, arg) => {
        peripheralId = arg;
        if(noble.state === 'poweredOn') {
            noble.startScanning([SERVICE_UUID], false);
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    console.log("Bye");
    app.quit();
});
