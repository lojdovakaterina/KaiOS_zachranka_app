import type { healthFormAnswers } from "./formAnswers";

export class MedicData {
  hearingImpairment: boolean = false;
  blind: boolean = false;
  diabetes: boolean = false;
  speechDefect: boolean = false;
  heartProblems: boolean = false;
  lungProblems: boolean = false;
  regularPrescription: string = "";
  other: string | null = null;
  lastUpdatedUtc: string = "";

  initFromForm(answers: healthFormAnswers) {
    this.hearingImpairment = answers.hearingImpairment;
    this.blind = answers.blind;
    this.diabetes = answers.diabetes;
    this.speechDefect = answers.speechDefect;
    this.heartProblems = answers.heart;
    this.lungProblems = answers.lungs;
    this.regularPrescription = answers.regularPrescription;
    answers.other === "" ? (this.other = null) : (this.other = answers.other);
    this.lastUpdatedUtc = new Date().toISOString();
  }
}
