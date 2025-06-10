import { saveToLocalStorage, storageHandles } from "./storage";
import { DeviceInfo } from "../data/DeviceInfo";

// setup app for the first time
// save static device information to localstorage
// save information about the app being run for the first time
export function setupApp() {
  let deviceInfo = new DeviceInfo();

  saveToLocalStorage(deviceInfo, storageHandles.DeviceInfo);
  saveToLocalStorage({ firstRun: true }, storageHandles.FirstRun);
}
