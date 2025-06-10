import type { Caller } from "./Caller";

export class personalFormAnswers {
  name: string = "";
  phoneNumber: string = "";
  birthYear: number | null = null;
  weight: number | null = null;
  height: number | null = null;
  email: string = "";
  insuranceNumber: string | undefined = undefined;
  communicationLanguage: string = "";
  permanentResidence: string = "";

  initFromCaller(caller: Caller) {
    this.name = caller.fullName ?? "";
    this.phoneNumber = caller.phoneNumbers[0] ?? "";
    this.birthYear =
      caller.age !== null ? new Date().getFullYear() - caller.age : null;
    this.weight = caller.weight;
    this.height = caller.height;
    this.email = caller.email ?? "";
    this.insuranceNumber = caller.insuranceNumber ?? "";
    this.communicationLanguage = caller.languages[0] ?? "";
    this.permanentResidence = caller.permanentResidence?.userAddress ?? "";
  }
}

export class healthFormAnswers {
  hearingImpairment: boolean = false;
  blind: boolean = false;
  diabetes: boolean = false;
  speechDefect: boolean = false;
  heart: boolean = false;
  lungs: boolean = false;
  regularPrescription: string = "";
  other: string = "";

  initFromCaller(caller: Caller) {
    this.hearingImpairment = caller.medicData?.hearingImpairment ?? false;
    this.blind = caller.medicData?.blind ?? false;
    this.diabetes = caller.medicData?.diabetes ?? false;
    this.speechDefect = caller.medicData?.speechDefect ?? false;
    this.heart = caller.medicData?.heartProblems ?? false;
    this.lungs = caller.medicData?.lungProblems ?? false;
    this.regularPrescription = caller.medicData?.regularPrescription ?? "";
    this.other = caller.medicData?.other ?? "";
  }
}

export class temporaryFormAnswers {
  information: string = "";
  date: string | null = null;
  time: string | null = null;
  // validUntil: Date | null = null;
  initFromCaller(caller: Caller) {
    this.information = caller.temporaryInformation?.message ?? "";

    let validUntil = caller.temporaryInformation?.validUntilUtc;
    if (!validUntil) {
      this.date = null;
      this.time = null;
      return;
    }

    // convert valitUntil to a format accepted by date and time input fields
    let dateComponents = new Date(validUntil)
      .toLocaleDateString("cs-CZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split(". "); // DD. MM. YYYY
    this.date = dateComponents.reverse().join("-"); // YYYY-MM-DD

    this.time = new Date(validUntil).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // HH:mm
  }
}
