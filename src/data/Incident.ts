import { v4 as uuidv4 } from "uuid";

import { sendSMS, smsWillBeMultipart } from "../utils/deviceHandling/sms";
import { sendXmlHttpRequestAsync } from "../utils/deviceHandling/xhr";
import { appVersion } from "../constants/appVersion";
import type { Caller } from "./Caller";
import type { PositionIncidentData } from "./Position";
import type { DeviceInfo } from "./DeviceInfo";

export class Incident {
  requestedIncidentId: string;
  appInfo: {
    version: string;
    language: string;
  };
  deviceInfo: DeviceInfo;
  caller: Caller;
  position: PositionIncidentData;
  preferredEmergencyServices: EmergencyServicesType[] = ["All"];

  constructor(
    deviceInfo: DeviceInfo,
    caller: Caller,
    position: PositionIncidentData
  ) {
    this.requestedIncidentId = uuidv4();
    this.appInfo = {
      version: appVersion,
      language: "cs",
    };
    this.deviceInfo = deviceInfo;
    this.caller = caller;
    this.position = position;
  }

  sendIncident(smsOnly: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        smsOnly ||
        this.deviceInfo.internetConnectionType === "NoConnection"
      ) {
        // device not connected to the internet or user calling without prior registration --> send SMS
        this.sendUsingSms().then(() => {
          resolve();
          return;
        });
      } else {
        // device has internet access --> send incident to server, sms as a fallback
        this.sendUsingHttp()
          .then(() => {
            resolve();
            return;
          })
          .catch(() => {
            this.sendUsingSms()
              .then(() => {
                resolve();
              })
              .catch((e) => {
                reject(new Error(`Something went wrong with Promise`));
              });
          });
      }
    });
  }

  private sendUsingSms(): Promise<void> {
    console.log(`sendUsingSms`);
    return new Promise((resolve, reject) => {
      this.createSmsStringAsync().then((string) => {
        // sendSMS(``, string) // insert phone number here for the SMS to be sent
        //   .then(() => {
        //     resolve();
        //   })
        //   .catch((e: Error) => {
        //     console.warn(`SMS could not be sent: `, { e });
        //     reject(new Error(`SMS could not be sent`));
        //   });
      });
    });
  }

  private sendUsingHttp(): Promise<void> {
    let data = this;
    console.log(`send using HTTP: `, { data });
    return new Promise((resolve, reject) => {
      // sendXmlHttpRequestAsync(
      //   "POST",
      //   "", // API endpoint
      //   JSON.stringify(this)
      // )
      //   .then(() => {
      //     resolve();
      //   })
      //   .catch((e: any) => {
      //     console.log({ e });
      //     reject(new Error(e.message));
      //   });
      resolve();
    });
  }

  private createSmsStringAsync(): Promise<string> {
    let incidentString = `${this.position.latitude};${
      this.position.longitude
    };${Math.round(this.position.accuracy)};`;
    console.log(`SMS incidentString: ${incidentString}`);
    return new Promise((resolve) => {
      smsWillBeMultipart(incidentString)
        .then((multiPart) => {
          if (multiPart) {
            console.warn(`incident string longer than 160 characters, shorten`);
          }
          resolve(multiPart ? "" : incidentString);
        })
        .catch((e) => {
          resolve(incidentString);
        });
    });
  }
}

type EmergencyServicesType = "All";
