import type { KeyOption } from "../utils/keyManager";
import { Caller } from "../data/Caller";
import { saveForm } from "../utils/formUtils";
import { type temporaryFormAnswers } from "../data/formAnswers";
import { type healthFormAnswers } from "../data/formAnswers";
import { type personalFormAnswers } from "../data/formAnswers";
import { popScreen } from "../utils/routing/router";
import Dialog from "../components/dialog/Dialog.svelte";

export const openDialog = (desc: string, dialog: Dialog): KeyOption => {
  return {
    text: desc,
    action: (e) => {
      if (e) {
        e.preventDefault();
      }
      dialog.open();
    },
  };
};

export const closeDialog = (desc: string, dialog: Dialog): KeyOption => {
  return {
    text: desc,
    action: (e) => {
      if (e) {
        e.preventDefault();
      }
      dialog.close();
    },
  };
};

export const saveFormAndCloseDialog = (
  desc: string,
  form: HTMLFormElement,
  formAnswers: healthFormAnswers | personalFormAnswers | temporaryFormAnswers,
  caller: Caller | null,
  dialog: Dialog
): KeyOption => {
  return {
    text: desc,
    action: () => {
      if (!form.checkValidity()) {
        dialog.close();
        return;
      }
      saveForm(form, formAnswers, caller);
      requestAnimationFrame(() => {
        popScreen();
      });
    },
  };
};
