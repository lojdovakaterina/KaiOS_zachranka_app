import { Caller } from "../data/Caller";
import { saveForm } from "../utils/formUtils";
import {
  type healthFormAnswers,
  type personalFormAnswers,
  type temporaryFormAnswers,
} from "../data/formAnswers";
import { clickItem } from "../utils/navigationUtils";
import { popScreen, pushScreen, replaceScreen } from "../utils/routing/router";
import type { KeyOption } from "../utils/keyManager";

export const noAction: KeyOption = {
  text: "",
  action: () => {},
};

// leave the screen
export const goBackBackspace: KeyOption = {
  text: "",
  action: (e) => {
    e.preventDefault();
    requestAnimationFrame(() => {
      popScreen();
    });
  },
};

export const actionBackspace = (action: () => void): KeyOption => {
  return {
    text: "",
    action: (e) => {
      e.preventDefault();
      requestAnimationFrame(() => {
        action();
      });
    },
  };
};

export const goBack = (desc: string): KeyOption => {
  return {
    text: desc,
    action: () => {
      // forget all changes
      popScreen();
    },
  };
};

// focus on field
export const click = (desc: string): KeyOption => {
  return {
    text: desc,
    action: () => {
      clickItem();
    },
  };
};

export const saveFormAndReturn = (
  desc: string,
  form: HTMLFormElement,
  formAnswers: healthFormAnswers | personalFormAnswers | temporaryFormAnswers,
  caller: Caller | null
): KeyOption => {
  return {
    text: desc,
    action: () => {
      if (form.checkValidity()) {
        saveForm(form, formAnswers, caller);
        popScreen();
      }
    },
  };
};

export const navigate = (
  desc: string,
  dest: string,
  replace: boolean = false
): KeyOption => {
  if (replace) {
    return {
      text: desc,
      action: () => {
        replaceScreen(dest);
      },
    };
  }

  return {
    text: desc,
    action: () => {
      pushScreen(dest);
    },
  };
};
