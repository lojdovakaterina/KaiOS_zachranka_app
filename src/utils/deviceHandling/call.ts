// start a call with Telephony API
export function call(number: string, onDisconnected: () => void = () => {}) {
  let tel = (navigator as any).mozTelephony;

  tel.dial(number).then((call: any) => {
    console.log({ call });

    call.ondialing = (e: Event) => {
      console.log("dialing", { e });
    };

    call.onconnected = (e: Event) => {
      console.log("connected", { e });
    };

    call.ondisconnected = (e: Event) => {
      console.log("disconnected", { e });
      onDisconnected();
    };

    call.onerror = (e: Event) => {
      console.error("Telephony error: ", { e });
    };
  });
}

// start a call with mozActivity -- requires user confirmation
export function callUsingMozActivity(number: string): Promise<void> {
  console.log(`callUsingMozActivity`);

  return new Promise((resolve, reject) => {
    let dial = new MozActivity({
      name: "dial",
      data: {
        number: number,
      },
    });

    dial.onsuccess(() => {
      console.log(`callUsingMozActivity success`);
      resolve();
    });
    dial.onerror(() => {
      console.log(`callUsingMozActivity error`);
      reject(new Error(`callUsingMozActivity error`));
    });
  });
}
