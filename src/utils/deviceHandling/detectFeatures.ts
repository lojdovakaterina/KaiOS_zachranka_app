import { storageAvailable } from "./storageAvailable";

export interface DeviceFeature {
  name: string;
  present: boolean;
  errorMessage?: string;
}

// detect features the app cannot run without
// eg. SMS, Telephony, GPS, storage
export function detectCriticalMissingFeatures(): Promise<DeviceFeature[]> {
  let detectedFeatures: DeviceFeature[] = [];
  let missingFeatures: DeviceFeature[] = [];

  detectedFeatures.push(detectLocalStorage());

  detectedFeatures.push(
    detectMozAPI(
      "mozMobileMessage",
      "Není povoleno programaticky posílat SMS, aplikace nebude moci fungovat korektně"
    )
  );

  detectedFeatures.push(
    detectMozAPI(
      "mozTelephony",
      "Není povoleno programaticky zahájit hovor, aplikace nebude moci fungovat korektně"
    )
  );

  return detectGeolocation().then((res: DeviceFeature) => {
    detectedFeatures.push(res);

    // return all missing features with the appropriate error message
    detectedFeatures.forEach((feature) => {
      if (!feature.present) {
        missingFeatures.push(feature);
      }
    });
    return missingFeatures;
  });
}

function detectLocalStorage(): DeviceFeature {
  if (storageAvailable("localStorage")) {
    return { name: "localStorage", present: true };
  }
  return {
    name: "localStorage",
    present: false,
    errorMessage:
      "Aplikaci není povoleno uložení dat. Uvolněte prostor, nebo přidělte patřičná oprávnění",
  };
}

function detectGeolocation(): Promise<DeviceFeature> {
  return (navigator as any)
    .hasFeature("device.capability.gps") // check if the device has GPS
    .then((feature: boolean) => {
      if (!feature) {
        console.error(`Device has no GPS`);
        return {
          name: "gps",
          present: false,
          errorMessage: "Zařízení nemá GPS, aplikaci není možné používat",
        };
      }

      // check if geolocation API present
      if (!("geolocation" in navigator)) {
        console.error("Geolocation not in navigator");
        return {
          name: "gps",
          present: false,
          errorMessage:
            "Použití GPS není k dispozici, správné fungování aplikace není možné",
        };
      }

      return new Promise<DeviceFeature>((resolve) => {
        // success --> we can use the gps
        const geoSuccess = () => {
          resolve({
            name: "gps",
            present: true,
          });
        };

        const geoError = (err: GeolocationPositionError) => {
          // permission denied --> we cannot use the gps
          // ask user for permission
          if (err.code === 1) {
            console.error(
              "Geolocation not allowed, please provide appropriate permissions"
            );
            resolve({
              name: "gps",
              present: false,
              errorMessage:
                "Používání GPS není povoleno, udělte, prosím, aplikaci v nastavení telefonu potřebná povolení.",
            });
          }
          // other error(possibly timeout) --> we can use the gps
          resolve({
            name: "gps",
            present: true,
          });
        };

        // try to use the gps to test permission
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
          timeout: 5000,
        });
      });
    });
}

// check if a given API is available
function detectMozAPI(apiName: string, errorMessage: string): DeviceFeature {
  if (apiName in navigator) {
    return {
      name: apiName,
      present: true,
    };
  }

  console.error(`detectMozApi: ${apiName} not in navigator`);
  return {
    name: apiName,
    present: false,
    errorMessage: errorMessage,
  };
}
