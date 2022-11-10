// For this example, a BLE device needs to have the following service UUID with
// a readable/writeable characteristic.
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';


const statusLabel = document.getElementById('statusLabel');
const connectButton = document.getElementById('connectButton');

connectButton.addEventListener('click', testIt);

// Display what's happening to user
function displayStatus(status) {
   statusLabel.innerHTML = status;
}

// Find device by service, connect, read, write
async function testIt() {
   displayStatus('Searching devices for service ' + SERVICE_UUID);

   try {
      // In a browser, this will display a device picker, but in Electron we handle
      // device selection via the select-bluetooth-device event on the server side.
      // This allows us to automatically pick the device, or display a picker, etc.
      // See Session.setBluetoothPairingHandler() for info on displaying a picker.
      const device = await navigator.bluetooth.requestDevice({
         filters: [{ services: [SERVICE_UUID] }]
      });
      displayStatus('Found device ' + device.name + ' with service');

      const server = await device.gatt.connect();
      displayStatus('Connected to GATT server');

      const service = await server.getPrimaryService(SERVICE_UUID);
      displayStatus('Connected to service ' + SERVICE_UUID);

      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
      let readData = await characteristic.readValue();

      // the characteristic may not have a value (empty buffer), we will init to zero if so
      let value = 0;
      if (readData.byteLength > 0) {
         value = readData.getUint8(0);
         displayStatus('Characteristic ' + CHARACTERISTIC_UUID + ' is ' + value.toString(16));
         value++;  // increment for writing later
      }

      // write new value to the characteristic (assumes "write with response")
      let writeBuffer = new ArrayBuffer(1);
      let writeData = new DataView(writeBuffer);
      writeData.setUint8(0, value);
      characteristic.writeValueWithResponse(writeData);
      displayStatus('Characteristic ' + CHARACTERISTIC_UUID + ' set to ' + value.toString(16));

   } catch (error) {
      displayStatus("Error: " + error);
   }
}

