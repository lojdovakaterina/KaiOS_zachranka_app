<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager, type KeyOption } from "../utils/keyManager";
  import { formAnswersAreEqual, saveForm } from "../utils/formUtils";
  import { healthFormAnswers } from "../data/formAnswers";
  import { setInitialFocus } from "../utils/navigationUtils";
  import { getFromLocalStorage, storageHandles } from "../utils/storage";
  import { closeDialog, openDialog } from "../constants/dialogKeyOptions";
  import { goBack, click, goBackBackspace } from "../constants/keyOptions";
  import { Caller } from "../data/Caller";

  import Layout from "../components/layouts/Layout.svelte";
  import CheckboxInputField from "../components/inputFields/CheckboxInputField.svelte";
  import TextInputField from "../components/inputFields/TextInputField.svelte";
  import Dialog from "../components/dialog/Dialog.svelte";
  import DialogTextBox from "../components/dialog/DialogTextBox.svelte";
  import { popScreen } from "../utils/routing/router";

  let healthForm: HTMLFormElement;
  let dialog: Dialog;

  let formAnswers = new healthFormAnswers();
  let caller = getFromLocalStorage<Caller>(storageHandles.Caller, Caller);
  if (caller) {
    formAnswers.initFromCaller(caller);
  }

  let originalAnswers = { ...formAnswers };

  let focusPresc: boolean;
  let focusOther: boolean;
  let validate: boolean = false;

  const saveFormAndReturn = (
    desc: string,
    form: HTMLFormElement,
    formAnswers: healthFormAnswers,
    caller: Caller | null
  ): KeyOption => {
    return {
      text: desc,
      action: () => {
        if (!form.checkValidity()) {
          validate = true;
          return;
        }
        saveForm(form, formAnswers, caller);
        popScreen();
      },
    };
  };

  const saveFormAndCloseDialog = (
    desc: string,
    form: HTMLFormElement,
    formAnswers: healthFormAnswers,
    caller: Caller | null,
    dialog: Dialog
  ): KeyOption => {
    return {
      text: desc,
      action: () => {
        if (!form.checkValidity()) {
          dialog.close();
          validate = true;
          return;
        }
        saveForm(form, formAnswers, caller);
        requestAnimationFrame(() => {
          popScreen();
        });
      },
    };
  };

  onMount(() => {
    setInitialFocus();

    keyManager.set({
      left: goBack("zrušit"),
      right: saveFormAndReturn("uložit", healthForm, formAnswers, caller),
      center: click("označit"),
      backspace: goBackBackspace,
    });
  });

  $: formAnswersAreEqual(originalAnswers, formAnswers)
    ? keyManager.update({
        left: goBack("zrušit"),
        backspace: goBackBackspace,
      })
    : keyManager.update({
        left: openDialog("zrušit", dialog),
        backspace: openDialog("", dialog),
      });
</script>

<Layout navbar={false} headerText="Zdravotní údaje">
  <div class="za-info-text--large">
    Údaje o Vašem zdravotním stavu budou využity pro rychlejší orientaci posádky
    během záchranné akce.
  </div>
  <form bind:this={healthForm} on:submit|preventDefault>
    <CheckboxInputField
      description="Léčím se s diabetem"
      bind:checked={formAnswers.diabetes}
    />
    <CheckboxInputField
      description="Léčím se s onemocněním srdce"
      bind:checked={formAnswers.heart}
    />
    <CheckboxInputField
      description="Léčím se s onemocněním plic"
      bind:checked={formAnswers.lungs}
    />
    <CheckboxInputField
      description="Mám vadu řeči"
      bind:checked={formAnswers.speechDefect}
    />
    <CheckboxInputField
      description="Jsem neslyšící"
      bind:checked={formAnswers.hearingImpairment}
    />
    <CheckboxInputField
      description="Jsem nevidomý"
      bind:checked={formAnswers.blind}
    />
    <TextInputField
      bind:inFocus={focusPresc}
      description="Užívané léky"
      bind:value={formAnswers.regularPrescription}
      {validate}
    />
    <TextInputField
      bind:inFocus={focusOther}
      description="Další informace"
      bind:value={formAnswers.other}
      {validate}
    />
  </form>
</Layout>

<Dialog
  bind:this={dialog}
  label="Opravdu chcete odejít?"
  keyOptions={{
    left: closeDialog("zrušit", dialog),
    right: goBack("odejít"),
    center: saveFormAndCloseDialog(
      "uložit",
      healthForm,
      formAnswers,
      caller,
      dialog
    ),
    backspace: closeDialog("", dialog),
  }}
>
  <DialogTextBox>
    Odchodem z formuláře budou ztraceny všechny provedené změny, opravdu si
    přejete odejít?
  </DialogTextBox>
</Dialog>
