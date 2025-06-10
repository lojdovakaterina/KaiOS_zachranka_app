import type { Contact } from "../../data/Caller";

// fetch all contacts and return cursor to iterate over them
export function fetchAllContacts(
  callback: (contact: Contact) => void,
  error?: (e?: Error) => void
) {
  if (!(navigator as any).mozContacts) {
    console.warn(`mozContacts not availbale on this device`);
    error?.(new Error(`mozContacts not availbale on this device`));
  }

  let allContacts = (navigator as any).mozContacts.getAll({
    sortBy: "familyName",
    sortOrder: "descending",
  });

  allContacts.onsuccess = function (event: any) {
    var cursor = event.target;
    if (cursor.result) {
      let contact = {
        name: cursor.result.givenName[0] + " " + cursor.result.familyName[0],
        phoneNumber: cursor.result.tel[0].value,
        email:
          cursor.result.email && cursor.result.email.length > 0
            ? cursor.result.email[0].value
            : null,
        description: null,
      };
      callback(contact);
      cursor.continue();
    }
  };

  allContacts.onerror = function () {
    console.warn("Contacts could not be fetched");
    error?.(new Error(`Contacts could not be fetched`));
  };
}
