export const storageHandles = {
  DeviceInfo: "DeviceInfo",
  Caller: "Caller",
  FirstRun: "FirstRun",
};

export function saveToLocalStorage(data: object, storageName: string) {
  const stringified = JSON.stringify(data);
  localStorage.setItem(storageName, stringified);
  console.log("Save to localStorage: ", { data });
}

// generic version
// returns a given class with all of its methods
export function getFromLocalStorage<C extends Object>(
  storageName: string,
  ctor?: new () => C
): C | null {
  const storageJSON = localStorage.getItem(storageName);
  if (storageJSON === null) {
    return null;
  }
  const parsedJSON = JSON.parse(storageJSON);
  if (ctor === undefined) {
    console.log("Get from localStorage: ", { parsedJSON });
    return parsedJSON;
  }
  console.log("Get from localStorage: ", { parsedJSON });
  return Object.assign(new ctor(), parsedJSON);
}
