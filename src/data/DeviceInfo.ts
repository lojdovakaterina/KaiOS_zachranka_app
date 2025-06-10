interface UserAgentInfo {
  deviceName: string | null;
  systemVersion: string | null;
}

export class DeviceInfo {
  id: string | null;
  name: string | null;
  manufacturer: string | null;
  batteryLevel: number | null;
  system: "KaiOS";
  systemVersion: string | null;
  internetConnectionType: "Unknown" | "NoConnection" | "WiFi" | "Data";

  constructor() {
    let infoFromAgent = this.parseUserAgent(navigator.userAgent);

    this.id = this.generateNewDeviceId();
    this.name = infoFromAgent.deviceName;
    this.manufacturer = null;
    this.batteryLevel = null;
    this.system = "KaiOS";
    this.systemVersion = infoFromAgent.systemVersion;
    this.internetConnectionType = "Unknown";
  }

  readBatteryLevel(): Promise<number> | null {
    try {
      return (navigator as any).getBattery().then((battery: any) => {
        // battery has type BatteryManager
        this.batteryLevel = battery.level;
        return this.batteryLevel;
      });
    } catch (e) {
      console.error(e);
      this.batteryLevel = null;
      return null;
    }
  }

  private generateNewDeviceId(): string {
    return (
      Date.now().toString(36).substring(2, 6) +
      Math.random().toString(36).substring(2, 6)
    );
  }

  // Mozilla/[version] ([system and browser information]) [platform] ([platform details]) [extensions]
  // Mozilla/5.0 (Mobile; 3088X; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5.1.1
  parseUserAgent(agent: string): UserAgentInfo {
    const regexp = /^(.*) (\(.+\)) (.+) (.+) (.+)$/gm;
    let match = regexp.exec(agent);

    if (!match) {
      return { deviceName: null, systemVersion: null };
    }

    let deviceName = match[2].slice(1, -1).split("; ")[1] ?? null;
    let systemVersion = match[5].split("/")[1] ?? null;

    return {
      deviceName: deviceName,
      systemVersion: systemVersion,
    };
  }

  // called when an incident occurs
  // to gather information that needs to be read at the moment
  updateDeviceInfo(): Promise<void> {
    return new Promise((resolve) => {
      // get the current internet connection type
      this.internetConnectionType = this.getInternetConnectionType();
      // update battery level stats
      this.readBatteryLevel();
      resolve();
    });
  }

  getInternetConnectionType(): "Unknown" | "NoConnection" | "WiFi" | "Data" {
    try {
      // check if the device is online
      if (!navigator.onLine) {
        return "NoConnection";
      }

      // check if device connected using wifi and ready
      let wifiManager = (navigator as any).mozWifiManager;
      if (wifiManager && wifiManager.connection.status === "connected") {
        return "WiFi";
      }

      // check for mobile connection type
      // 2G --> gsm, gprs, edge, is95a, is95b
      // 3G --> umts, hsdpa, evdo0, evdoa, evdob, 1xrtt, hsupa, hspa, ehrpd
      // 4G --> lte, hspa+
      let dataType = (navigator as any).mozMobileConnections[0].data.type;
      if (!dataType) {
        return "Unknown";
      }

      if (
        dataType === "gsm" ||
        dataType === "gprs" ||
        dataType === "edge" ||
        dataType === "is95a" ||
        dataType === "is95b"
      ) {
        return "Data";
      }

      if (
        dataType === "umts" ||
        dataType === "hsdpa" ||
        dataType === "evdo0" ||
        dataType === "evdoa" ||
        dataType === "evdob" ||
        dataType === "1xrtt" ||
        dataType === "hsupa" ||
        dataType === "hspa" ||
        dataType === "ehrpd"
      ) {
        return "Data";
      }

      if (dataType === "lte" || dataType === "hspa+") {
        return "Data";
      }

      return "Unknown";
    } catch (e) {
      console.warn(e);
      return "Unknown";
    }
  }
}

export function readBatteryLevelAsync(): Promise<number> {
  return new Promise((resolve, reject) => {
    (navigator as any)
      .getBattery()
      .then((battery: any) => {
        resolve(battery.level);
      })
      .catch((e: Error) => {
        reject(new Error(e.message));
      });
  });
}
