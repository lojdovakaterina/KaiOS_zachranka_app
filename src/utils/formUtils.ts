import { Caller } from "../data/Caller";
import type {
  healthFormAnswers,
  personalFormAnswers,
  temporaryFormAnswers,
} from "../data/formAnswers";
import { saveToLocalStorage, storageHandles } from "./storage";

// move cursor to the end for easier user data manipulation
export function moveCursorToTheEnd(
  event: FocusEvent & {
    currentTarget: EventTarget & HTMLInputElement;
  }
) {
  if (event.currentTarget === null) {
    return;
  }

  const target = event.currentTarget;
  requestAnimationFrame(() => {
    target.selectionStart = target.selectionEnd = target.value.length;
  });
}

export function saveForm(
  form: HTMLFormElement,
  formAnswers: healthFormAnswers | personalFormAnswers | temporaryFormAnswers,
  caller: Caller | null
) {
  if (form.checkValidity()) {
    if (!caller) {
      caller = new Caller();
    }
    caller.saveFromForm(formAnswers);

    saveToLocalStorage(caller, storageHandles.Caller);
  }
}

export function formAnswersAreEqual(answ1: object, answ2: object) {
  return JSON.stringify(answ1) === JSON.stringify(answ2);
}
