import type { temporaryFormAnswers } from "./formAnswers";

export class TemporaryInformation {
  message: string = "";
  validUntilUtc: string = new Date().toISOString();

  initFromForm(answers: temporaryFormAnswers) {
    this.message = answers.information;
    this.validUntilUtc = new Date(
      answers.date + " " + answers.time
    ).toISOString();
  }
}
