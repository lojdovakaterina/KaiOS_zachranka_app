<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager, type KeyOption } from "../utils/keyManager";
  import { formAnswersAreEqual, saveForm } from "../utils/formUtils";
  import { personalFormAnswers } from "../data/formAnswers";
  import { setInitialFocus } from "../utils/navigationUtils";
  import { getFromLocalStorage, storageHandles } from "../utils/storage";
  import { closeDialog, openDialog } from "../constants/dialogKeyOptions";
  import { Caller } from "../data/Caller";
  import { goBack, goBackBackspace } from "../constants/keyOptions";

  import Layout from "../components/layouts/Layout.svelte";
  import TextInputField from "../components/inputFields/TextInputField.svelte";
  import NumberInputField from "../components/inputFields/NumberInputField.svelte";
  import EmailInputField from "../components/inputFields/EmailInputField.svelte";
  import TelInputField from "../components/inputFields/TelInputField.svelte";
  import LanguagePicker from "../components/inputFields/LanguagePicker.svelte";
  import Dialog from "../components/dialog/Dialog.svelte";
  import DialogTextBox from "../components/dialog/DialogTextBox.svelte";
  import { popScreen } from "../utils/routing/router";

  let personalForm: HTMLFormElement;

  let formAnswers = new personalFormAnswers();
  let caller = getFromLocalStorage<Caller>(storageHandles.Caller, Caller);
  if (caller) {
    formAnswers.initFromCaller(caller);
  }

  let originalAnswers = { ...formAnswers };

  let currentYear = new Date().getFullYear();
  let focusPicker: boolean = false;
  let validate: boolean = false;

  let dialog: Dialog;

  const saveFormAndReturn = (
    desc: string,
    form: HTMLFormElement,
    formAnswers: personalFormAnswers,
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
    formAnswers: personalFormAnswers,
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
      right: saveFormAndReturn("uložit", personalForm, formAnswers, caller),
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

<Layout navbar={false} headerText="Osobní informace">
  <div class="za-info-text--large">
    Zadejte prosím maximum informací pro usnadnění Vaší záchranné akce.
  </div>
  <form bind:this={personalForm} on:submit|preventDefault>
    <TextInputField
      description="Jméno a příjmení"
      bind:value={formAnswers.name}
      {validate}
      minlength={3}
      tooShortMessage={"Jméno je příliš krátké"}
      maxlength={100}
      tooLongMessage={"Jméno je příliš dlouhé"}
    />
    <TelInputField
      description="Tel. číslo"
      bind:value={formAnswers.phoneNumber}
      {validate}
      required
      prefill
      patternMismatchMessage={"Zadejte tel. číslo včetně mezin. předvolby"}
    />
    <NumberInputField
      description="Rok narození"
      bind:value={formAnswers.birthYear}
      {validate}
      min={1875}
      tooLowMessage={"Minimální rok narození je 1875"}
      max={currentYear}
      tooHighMessage={`Maximální rok narození je ${currentYear.toString()}`}
      placeholder={currentYear.toString()}
    />
    <NumberInputField
      description="Váha [kg]"
      bind:value={formAnswers.weight}
      {validate}
      min={30}
      tooLowMessage={"Minimální možná váha je 30kg"}
      max={250}
      tooHighMessage={"Maximální možná váha je 250kg"}
    />
    <NumberInputField
      description="Výška [cm]"
      bind:value={formAnswers.height}
      {validate}
      min={100}
      tooLowMessage={"Minimální možná výška je 100cm"}
      max={250}
      tooHighMessage={"Maximální možná výška je 250cm"}
    />
    <EmailInputField
      description="E-mail"
      bind:value={formAnswers.email}
      {validate}
    />
    <TelInputField
      description="Číslo pojištěnce"
      bind:value={formAnswers.insuranceNumber}
      {validate}
      pattern={"^[0-9]{9,21}$"}
      patternMismatchMessage={"Nesprávný formát čísla pojištěnce"}
    />
    <LanguagePicker
      description="Jazyk komunikace"
      bind:value={formAnswers.communicationLanguage}
      bind:inFocus={focusPicker}
      {validate}
    />
    <TextInputField
      description="Trvalé bydliště"
      bind:value={formAnswers.permanentResidence}
      {validate}
      minlength={3}
      tooShortMessage={"Trvalé bydliště je příliš krátké"}
      maxlength={200}
      tooLongMessage={"Trvalé bydliště je příliš dlouhé"}
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
      personalForm,
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
