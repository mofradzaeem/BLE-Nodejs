# WebBluetooth

This application demonstrates using the Web Bluetooth API from an Electron application.

## Setup

The application will scan for a BLE device service, connect to it, and then read/write a characteristic.  You will need a bluetooth device with a serivce providing a read/writeable characteristic.  You can simulate a BLE device using an app like [LightBlue](https://apps.apple.com/app/lightblue/id557428110).

The service and characteristic UUIDS are defined in render.js.  Ensure these match your device.

## Usage

1. You will need to install a recent verson of [Node.js](https://nodejs.org/en/download)
1. Clone this repository
1. Install dependencies with `npm install`
1. Start the application with `npm start`
1. Press the button



