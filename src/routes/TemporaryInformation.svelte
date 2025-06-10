<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager, type KeyOption } from "../utils/keyManager";
  import { formAnswersAreEqual, saveForm } from "../utils/formUtils";
  import { temporaryFormAnswers } from "../data/formAnswers";
  import { setInitialFocus } from "../utils/navigationUtils";
  import { getFromLocalStorage, storageHandles } from "../utils/storage";
  import { closeDialog, openDialog } from "../constants/dialogKeyOptions";
  import { Caller } from "../data/Caller";
  import { goBack, goBackBackspace } from "../constants/keyOptions";

  import Layout from "../components/layouts/Layout.svelte";
  import TimeInputField from "../components/inputFields/TimeInputField.svelte";
  import TextInputField from "../components/inputFields/TextInputField.svelte";
  import DateInputField from "../components/inputFields/DateInputField.svelte";
  import Dialog from "../components/dialog/Dialog.svelte";
  import DialogTextBox from "../components/dialog/DialogTextBox.svelte";
  import { popScreen } from "../utils/routing/router";

  let temporaryForm: HTMLFormElement;
  let dialog: Dialog;

  let formAnswers = new temporaryFormAnswers();
  let caller = getFromLocalStorage<Caller>(storageHandles.Caller, Caller);
  if (caller) {
    // remove temporary information if outdated
    caller.removeTemporaryInformation(true);
    formAnswers.initFromCaller(caller);
  }
  let originalAnswers = { ...formAnswers };

  let dateInFocus: boolean;
  let timeInFocus: boolean;
  let today = new Date().toISOString().split("T")[0]; // today's date in yyyy-mm-dd format
  let validate: boolean = false;

  const saveFormAndReturn = (
    desc: string,
    form: HTMLFormElement,
    formAnswers: temporaryFormAnswers,
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
    formAnswers: temporaryFormAnswers,
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
      right: saveFormAndReturn("uložit", temporaryForm, formAnswers, caller),
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

<Layout navbar={false} headerText="Dočasná informace">
  <div class="za-info-text--large">
    Zadejte prosím informace, které jsou platné pouze po omezený čas.
  </div>
  <form bind:this={temporaryForm} on:submit|preventDefault>
    <TextInputField
      description="Informace"
      bind:value={formAnswers.information}
      {validate}
      required
      minlength={3}
      tooShortMessage={"Zadaná informace je příliš krátká"}
      maxlength={250}
      tooLongMessage={"Zadaná informace je příliš dlouhá"}
    />
    <DateInputField
      description="Informace platí do (datum):"
      bind:value={formAnswers.date}
      bind:inFocus={dateInFocus}
      {validate}
      required
      min={today}
    />
    <TimeInputField
      description="Informace platí do (čas):"
      bind:value={formAnswers.time}
      bind:inFocus={timeInFocus}
      {validate}
      required
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
      temporaryForm,
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
