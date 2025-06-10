import { temporaryFormAnswers } from "./formAnswers";
import { healthFormAnswers } from "./formAnswers";
import { personalFormAnswers } from "./formAnswers";
import { MedicData } from "./MedicData";
import { TemporaryInformation } from "./TemporaryInformation";
import { saveToLocalStorage, storageHandles } from "../utils/storage";

export class Caller {
  phoneNumbers: string[] = [];
  fullName: string | null = null;
  gender: "Unknown" | "Male" | "Female" | "Other" = "Unknown";
  email: string | null = null;
  insuranceNumber: string | null = null;
  languages: string[] = ["cs"];
  age: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  residence: PermanentResidence | null = null;
  contacts: Contact[] = [];
  medicData: MedicData | null = null;
  temporaryInformation: TemporaryInformation | null = null;

  saveFromForm(
    answers: personalFormAnswers | healthFormAnswers | temporaryFormAnswers
  ) {
    if (answers instanceof personalFormAnswers) {
      answers.name === ""
        ? (this.fullName = null)
        : (this.fullName = answers.name);

      answers.phoneNumber === ""
        ? (this.phoneNumbers = [])
        : this.phoneNumbers.length === 0
        ? this.phoneNumbers.push(answers.phoneNumber) // add first phoneNumber
        : (this.phoneNumbers[0] = answers.phoneNumber); // replace the first phoneNumber

      answers.email === "" ? (this.email = null) : (this.email = answers.email);

      answers.insuranceNumber === ""
        ? (this.insuranceNumber = null)
        : (this.insuranceNumber = answers.insuranceNumber?.toString() ?? null);

      answers.communicationLanguage === ""
        ? (this.languages = ["cs"])
        : (this.languages = [answers.communicationLanguage]);

      answers.birthYear === null
        ? (this.age = null)
        : (this.age = this.calculateUserAge(answers.birthYear));

      this.height = answers.height;
      this.weight = answers.weight;

      answers.permanentResidence === ""
        ? (this.residence = null)
        : (this.residence = {
            userAddress: answers.permanentResidence,
            geoPoint: null,
          });
      return;
    }

    if (answers instanceof healthFormAnswers) {
      let medicData = new MedicData();
      medicData.initFromForm(answers);

      this.medicData = medicData;
      return;
    }

    if (answers instanceof temporaryFormAnswers) {
      let tempInfo = new TemporaryInformation();
      tempInfo.initFromForm(answers);

      this.temporaryInformation = tempInfo;
      return;
    }
  }

  removeTemporaryInformation(saveChange: boolean = false) {
    if (this.temporaryInformation === null) {
      return;
    }

    let currently = new Date();
    let validUntil = new Date(this.temporaryInformation.validUntilUtc);
    if (validUntil > currently) {
      return;
    }

    this.temporaryInformation = null;

    if (saveChange) {
      saveToLocalStorage(this, storageHandles.Caller);
    }
  }

  getContactDetail(index: number): Contact | null {
    if (this.contacts === null || index > this.contacts.length) {
      return null;
    }

    return this.contacts[index];
  }

  deleteContactDetail(index: number, saveChange: boolean = false) {
    if (this.contacts !== null && index <= this.contacts.length) {
      this.contacts.splice(index, 1);
    }

    if (saveChange) {
      saveToLocalStorage(this, storageHandles.Caller);
    }
  }

  saveContactDetail(
    index: number | null,
    contact: Contact,
    saveChange: boolean = false
  ) {
    // saving the first contact
    if (this.contacts === null) {
      this.contacts = [contact];
    }

    // save new contact
    if (index === null && this.contacts !== null) {
      this.contacts.push(contact);
    }

    // update contact
    if (index !== null && this.contacts !== null) {
      this.contacts[index] = contact;
    }

    if (saveChange) {
      saveToLocalStorage(this, storageHandles.Caller);
    }
  }

  calculateUserAge(birthYear: number): number {
    let currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }
}

interface PermanentResidence {
  userAddress: string;
  geoPoint: GeoPoint | null;
}

interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Contact {
  name: string;
  phoneNumber: string;
  email: string | null;
  description: string | null;
}
