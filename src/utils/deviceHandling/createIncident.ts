import { Caller } from "../../data/Caller";
import { DeviceInfo } from "../../data/DeviceInfo";
import { Incident } from "../../data/Incident";
import { currentPosition } from "../../data/Position";
import { getFromLocalStorage, storageHandles } from "../storage";

// send out incident message with appropriate information about the device
export function createIncidentAsync(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!currentPosition.hasValues) {
      console.log(`wait for position`);
      currentPosition
        .readCurrentValueAsync(true, 10)
        .then(() => {
          sendIncidentDataAsync()
            .then(() => {
              resolve();
              return;
            })
            .catch((e: any) => {
              reject(new Error(`sendIncidentDataError: ${e.message}`));
            });
        })
        .catch((e: Error) => {
          console.warn(
            `no position acquired, incident not created, proceed to call`
          );
          reject(
            new Error(
              `no position acquired, incident not created, proceed to call`
            )
          );
        });
    } else {
      sendIncidentDataAsync()
        .then(() => {
          resolve();
          return;
        })
        .catch((e: any) => {
          reject(new Error(`sendIncidentDataError: ${e.message}`));
        });
    }
  });
}

function sendIncidentDataAsync(): Promise<void> {
  return new Promise((resolve, reject) => {
    let position = currentPosition.toIncidentFormat();
    if (position === null) {
      reject(
        new Error(`no position acquired, incident not created, proceed to call`)
      );
      return;
    }
    // prepare device information
    let deviceInfo =
      getFromLocalStorage<DeviceInfo>(storageHandles.DeviceInfo, DeviceInfo) ??
      new DeviceInfo();
    // update device information -- battery, internetConnectionType
    deviceInfo.updateDeviceInfo();

    // prepare caller information
    let caller =
      getFromLocalStorage<Caller>(storageHandles.Caller, Caller) ??
      new Caller();
    // remove temporary information when outdated
    caller.removeTemporaryInformation();

    // if the app has not been properly set up, send only with sms
    let firstRun;
    getFromLocalStorage(storageHandles.FirstRun) === null
      ? (firstRun = true)
      : (firstRun = false);

    let incident = new Incident(deviceInfo, caller, position);

    incident.sendIncident(firstRun).then(() => {
      resolve();
    });
  });
}
