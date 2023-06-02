const { ipcRenderer } = require('electron');
const connectButton = document.getElementById('connectButton');
const statusLabel = document.getElementById('statusLabel');

connectButton.addEventListener('click', function() {
   ipcRenderer.send('connect-to-device');
});

ipcRenderer.on('device-data', (event, data) => {
   statusLabel.innerHTML = 'Characteristic set to ' + data;
});
