<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager, type KeyOption } from "../../utils/keyManager";
  import { goBackBackspace } from "../../constants/keyOptions";
  import { replaceScreen, screenRouteNames } from "../../utils/routing/router";
  import { setInitialFocus } from "../../utils/navigationUtils";

  import Layout from "../../components/layouts/Layout.svelte";
  import TextInputField from "../../components/inputFields/TextInputField.svelte";
  import TelInputField from "../../components/inputFields/TelInputField.svelte";
  import { Caller } from "../../data/Caller";
  import { saveToLocalStorage, storageHandles } from "../../utils/storage";

  let initForm: HTMLFormElement;
  let formAnswers = { fullName: "", phoneNumber: "" };
  let validate: boolean = false;

  const saveInfo: KeyOption = {
    text: "pokračovat",
    action: () => {
      validate = true;
      if (initForm.checkValidity()) {
        saveInitialCallerInfo(formAnswers);
        replaceScreen(screenRouteNames.PermissionsOnboarding);
      }
    },
  };

  function saveInitialCallerInfo(formAnswers: {
    fullName: string;
    phoneNumber: string;
  }) {
    let caller = new Caller();
    caller.fullName = formAnswers.fullName === "" ? null : formAnswers.fullName;
    formAnswers.phoneNumber === ""
      ? caller.phoneNumbers
      : caller.phoneNumbers.push(formAnswers.phoneNumber);

    saveToLocalStorage(caller, storageHandles.Caller);
  }

  onMount(() => {
    keyManager.set({
      right: saveInfo,
      backspace: goBackBackspace,
    });

    setInitialFocus();
  });
</script>

<Layout navbar={false} headerText="Základní údaje">
  <p class="za-info-text--large">
    Abychom vám mohli přivolat pomoc, potřebujeme znát Vaše základní údaje
  </p>
  <form bind:this={initForm} on:submit|preventDefault>
    <TextInputField
      description="Jméno a příjmení"
      bind:value={formAnswers.fullName}
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
      pattern={"^[+][1-9][0-9]{9,}$"}
      patternMismatchMessage={"Zadejte tel. číslo včetně mezin. předvolby"}
    />
  </form>
</Layout>
