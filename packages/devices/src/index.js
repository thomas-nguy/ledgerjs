// @flow

export type DeviceInfo = {
  id: string,
  productName: string,
  usbProductId: number,
  bluetoothSpec?: Array<{
    serviceUuid: string,
    writeUuid: string,
    notifyUuid: string
  }>
};

const devices: { [id: string]: DeviceInfo } = {
  blue: {
    id: "blue",
    productName: "Ledger Blue",
    usbProductId: 0x0000
  },
  nanoS: {
    id: "nanoS",
    productName: "Ledger Nano S",
    usbProductId: 0x0001
  },
  nanoX: {
    id: "nanoX",
    productName: "Ledger Nano X",
    usbProductId: 0x0004,
    bluetoothSpec: [
      {
        // this is the legacy one (prototype version). we will eventually drop it.
        serviceUuid: "d973f2e0-b19e-11e2-9e96-0800200c9a66",
        notifyUuid: "d973f2e1-b19e-11e2-9e96-0800200c9a66",
        writeUuid: "d973f2e2-b19e-11e2-9e96-0800200c9a66"
      },
      {
        serviceUuid: "13d63400-2c97-0004-0000-4c6564676572",
        notifyUuid: "13d63400-2c97-0004-0001-4c6564676572",
        writeUuid: "13d63400-2c97-0004-0002-4c6564676572"
      }
    ]
  }
};

// $FlowFixMe
const devicesList: DeviceInfo[] = Object.values(devices);

export const ledgerUSBVendorId = 0x2c97;

export const getDeviceInfo = (id: string): DeviceInfo => {
  const info = devices[id];
  if (!info) throw new Error("device '" + id + "' does not exist");
  return info;
};

export const identifyUSBProductId = (usbProductId: number): ?DeviceInfo =>
  devicesList.find(d => d.usbProductId === usbProductId);

export type BluetoothInfos = {
  deviceInfo: DeviceInfo,
  serviceUuid: string,
  writeUuid: string,
  notifyUuid: string
};

const bluetoothServices: string[] = [];
const serviceUuidToInfos: {
  [_: string]: BluetoothInfos
} = {};

for (let id in devices) {
  const deviceInfo = devices[id];
  const { bluetoothSpec } = deviceInfo;
  if (bluetoothSpec) {
    for (let i = 0; i < bluetoothSpec.length; i++) {
      const spec = bluetoothSpec[i];
      bluetoothServices.push(spec.serviceUuid);
      serviceUuidToInfos[spec.serviceUuid] = { deviceInfo, ...spec };
    }
  }
}

export const getBluetoothServiceUuids = () => bluetoothServices;

export const getInfosForServiceUuid = (uuid: string): ?BluetoothInfos =>
  serviceUuidToInfos[uuid.toLowerCase()];
