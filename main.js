// This application demonstrates how to use the Web Bluetooth API
// it was adapted from: https://github.com/electron/electron/tree/main/docs/fiddles/features/web-bluetooth

"use strict";

const { strict, strictEqual } = require('assert');
const { app, BrowserWindow } = require('electron');
const path = require('path');


function createWindow() {
   const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         preload: path.join(__dirname, 'preload.js')
      }
   });

   // Device scans start with calling Bluetooth.requestDevice(...) on the renderer side.  
   // When devices are found, this event is triggered.  We can use this event to present 
   // a device picker to the user, or we can automaically pick something.
   win.webContents.on('select-bluetooth-device', (event, devices, callback) => {
      event.preventDefault()

      // just pick the first device discovered (requestDevice() handles filtering)
      if (devices && devices.length > 0) {
         callback(devices[0].deviceId)
      }
   });

   win.loadFile('index.html');
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


