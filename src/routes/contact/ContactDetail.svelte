<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager, type KeyOption } from "../../utils/keyManager";
  import {
    getParamsFromRoute,
    popScreen,
    screenRouteNames,
  } from "../../utils/routing/router";
  import { setInitialFocus } from "../../utils/navigationUtils";
  import { formAnswersAreEqual } from "../../utils/formUtils";
  import { getFromLocalStorage, storageHandles } from "../../utils/storage";
  import { goBack, goBackBackspace } from "../../constants/keyOptions";
  import { closeDialog, openDialog } from "../../constants/dialogKeyOptions";
  import { Caller, type Contact } from "../../data/Caller";

  import Layout from "../../components/layouts/Layout.svelte";
  import TextInputField from "../../components/inputFields/TextInputField.svelte";
  import EmailInputField from "../../components/inputFields/EmailInputField.svelte";
  import TelInputField from "../../components/inputFields/TelInputField.svelte";
  import Dialog from "../../components/dialog/Dialog.svelte";
  import DialogTextBox from "../../components/dialog/DialogTextBox.svelte";

  const largeTextEnabled = (navigator as any).largeTextEnabled;
  const params = getParamsFromRoute(screenRouteNames.ContactDetail);
  // index from ContactList page
  let index: number | null = params.index ?? null;
  // contact from phoneBook
  let contactFromPhoneBook: Contact | null = params.contact ?? null;

  let contactForm: HTMLFormElement;
  let formAnswers: Contact = {
    name: "",
    phoneNumber: "",
    email: null,
    description: null,
  };
  let dialog: Dialog;

  let caller = getFromLocalStorage<Caller>(storageHandles.Caller, Caller);
  if (!caller) {
    caller = new Caller();
  }

  // user has come from the ContactList page
  if (index !== null) {
    formAnswers = caller.getContactDetail(index) ?? formAnswers;
  }
  // use has come from phoneBook
  if (contactFromPhoneBook !== null) {
    formAnswers = contactFromPhoneBook;
  }

  let originalAnswers = { ...formAnswers };

  let validate: boolean = false;

  const saveContact: KeyOption = {
    text: "uložit",
    action: () => {
      validate = true;
      // save or update
      if (contactForm.checkValidity()) {
        caller.saveContactDetail(index, formAnswers, true);
        popScreen();
        return;
      }

      if (dialog.isOpen()) {
        dialog.close();
      }
    },
  };

  onMount(() => {
    requestAnimationFrame(() => {
      setInitialFocus();
    });

    keyManager.set({
      left: goBack("zrušit"),
      right: saveContact,
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

<Layout
  navbar={false}
  headerText={largeTextEnabled ? "Kontakt" : "Kontakt na osobu blízkou"}
>
  <form bind:this={contactForm} on:submit|preventDefault>
    <TextInputField
      description="Jméno a příjmení"
      bind:value={formAnswers.name}
      {validate}
      required
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
    <EmailInputField
      description="E-mail(nepovinný)"
      bind:value={formAnswers.email}
    />
  </form>
</Layout>

<Dialog
  bind:this={dialog}
  label="Opravdu chcete odejít?"
  keyOptions={{
    left: closeDialog("zrušit", dialog),
    right: goBack("odejít"),
    center: saveContact,
    backspace: closeDialog("", dialog),
  }}
>
  <DialogTextBox>
    Odchodem z formuláře budou ztraceny všechny provedené změny, opravdu si
    přejete odejít?
  </DialogTextBox>
</Dialog>
