import { get, writable } from "svelte/store";

class Position {
  refresh = writable<number>(0);
  hasValues: boolean = false;
  private latitude: number | null = null;
  private longitude: number | null = null;
  private capturedAtUtc: string | null = null;
  private accuracy: number | null = null;
  private altitude: number | null = null;

  private savePosition(pos: GeolocationPosition) {
    console.log(`got position: `, { pos });
    this.refresh.set(get(this.refresh) + 1);
    this.hasValues = true;
    this.latitude = pos.coords.latitude;
    this.longitude = pos.coords.longitude;
    this.capturedAtUtc = new Date(pos.timestamp).toISOString();
    this.accuracy = pos.coords.accuracy;
    this.altitude = pos.coords.altitude ?? 0;
  }

  // get the current position
  readCurrentValueAsync(
    enableHighAccuracy: boolean = true,
    timeoutInSeconds: number = 30
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          this.savePosition(pos);
          resolve();
        },
        (err: GeolocationPositionError) => {
          console.warn(`position not acquired: `, { err });
          reject(new Error(`position not acquired: ${err.message}`));
        },
        {
          enableHighAccuracy: enableHighAccuracy, // high accuracy --> enforce GPS chip use
          timeout: timeoutInSeconds * 1000, // convert timeout to ms
          maximumAge: 0, // get fresh position data
        }
      );
    });
  }

  // start position watch
  collectWhenAppRunning(intervalInS: number) {
    let watchId: number | null = null;

    // user entered the app --> start collecting position
    window.addEventListener("focus", () => {
      watchId = setInterval(() => {
        this.readCurrentValueAsync();
      }, intervalInS * 1000);
    });

    // user left the app --> clear position watch
    window.addEventListener("blur", () => {
      if (watchId !== null) {
        clearInterval(watchId);
      }
    });
  }

  private getDMSFromDecimal(pos: number): DMSPosition {
    let positive = pos >= 0 ? true : false;

    let d = Math.floor(pos);
    pos = (pos - d) * 60;
    let m = Math.floor(pos);
    pos = (pos - m) * 60;
    let s = Number(Math.floor(pos).toString().substring(0, 2)); // keep only two first chars
    let position: DMSPosition = { d: d, m: m, s: s, positive: positive };
    return position;
  }

  // convert to DMS for display putposes
  toDMS(): DMSCoords | null {
    if (this.latitude === null || this.longitude === null) {
      return null;
    }

    return {
      latitude: this.getDMSFromDecimal(this.latitude),
      longitude: this.getDMSFromDecimal(this.longitude),
    };
  }

  // format to be used in an incident
  toIncidentFormat(): PositionIncidentData | null {
    if (
      !this.latitude ||
      !this.longitude ||
      !this.capturedAtUtc ||
      !this.accuracy ||
      !this.altitude
    ) {
      return null;
    }

    return {
      latitude: this.latitude,
      longitude: this.longitude,
      capturedAtUtc: this.capturedAtUtc,
      accuracy: this.accuracy,
      altitude: this.altitude,
    };
  }
}

export interface DMSPosition {
  d: number;
  m: number;
  s: number;
  positive: boolean;
}

export interface DMSCoords {
  latitude: DMSPosition;
  longitude: DMSPosition;
}

export interface PositionIncidentData {
  latitude: number;
  longitude: number;
  capturedAtUtc: string;
  accuracy: number;
  altitude: number;
}

export const currentPosition = new Position();
