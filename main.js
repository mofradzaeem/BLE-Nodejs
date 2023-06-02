const noble = require('ble-host');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let SERVICE_UUID = '4fafc2011fb5459e8fccc5c9c331914b';
let CHARACTERISTIC_UUID = 'beb5483e36e14688b7f5ea07361b26a8';

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
      noble.on('stateChange', function(state) {
         if (state === 'poweredOn') {
            noble.startScanning([SERVICE_UUID], false);
         }
         else {
            noble.stopScanning();
         }
      });
   
      noble.on('discover', function(peripheral) {
         if (peripheral.advertisement.serviceUuids.includes(SERVICE_UUID)) {
            noble.stopScanning();
   
            peripheral.connect(function(error) {
               if (error) {
                  console.log("Connection Error: ", error);
                  return;
               }
   
               peripheral.discoverServices([SERVICE_UUID], function(error, services) {
                  const deviceService = services[0];
                  deviceService.discoverCharacteristics([CHARACTERISTIC_UUID], function(error, characteristics) {
                     if (error) {
                        console.log("Characteristic Error: ", error);
                        return;
                     }
   
                     let deviceCharacteristic = characteristics[0];
                     deviceCharacteristic.read((error, data) => {
                        if (error) {
                           console.log("Read Error: ", error);
                           return;
                        }
                        let value = data.readUInt8(0);
                        value++; 
                        let buffer = Buffer.from([value]);
                        deviceCharacteristic.write(buffer, false, (error) => {
                           if (error) {
                              console.log("Write Error: ", error);
                              return;
                           }
                           event.reply('device-data', value.toString(16));
                        });
                     });
                  });
               });
            });
         }
      });
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