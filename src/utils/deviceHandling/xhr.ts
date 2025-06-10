export function sendXmlHttpRequestAsync(
  method: string,
  endpoint: string,
  data: string
): Promise<number> {
  console.log(`sendXmlHttpRequestAsync`);
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest({ mozSystem: true });
    xhr.open(method, endpoint, true);
    xhr.onload = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(`XHR OK: `, { xhr });
          resolve(xhr.status);
        } else {
          console.error(`XHR ERROR: `, { xhr });
          reject(new Error(`XHR ERROR: ${xhr.status}`));
        }
      }
    };
    xhr.onerror = (e: any) => {
      console.error({ e }, { xhr });
      reject(new Error(`XHR ERROR: ${e.message}, ${xhr.status}`));
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  });
}
