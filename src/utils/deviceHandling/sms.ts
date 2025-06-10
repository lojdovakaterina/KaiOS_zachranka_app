export function sendSMS(phoneNumber: string, text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let request = (navigator as any).mozMobileMessage.send(phoneNumber, text);

    request.onsuccess = () => {
      console.log(`message has been sent`);
      resolve();
    };

    request.onerror = (e: Error) => {
      console.warn({ e });
      reject();
    };
  });
}

export function smsWillBeMultipart(text: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let segments = (navigator as any).mozMobileMessage.getSegmentInfoForText(
      text
    );

    segments.onsuccess = (segment: any) => {
      if (segment.target.result.segments) {
        console.log(`num of SMS segments: ${segment.target.result.segments}`);
        resolve(segment.target.result.segments > 1);
        return;
      }
      reject(new Error(`Segments not available`));
    };

    segments.onerror = (e: Error) => {
      console.warn({ e });
      reject(new Error(e.message));
    };
  });
}
