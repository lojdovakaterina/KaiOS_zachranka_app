<script lang="ts">
  import { click, noAction } from "../../constants/keyOptions";
  import { languageCodes } from "../../constants/languageCodes";
  import { keyManager } from "../../utils/keyManager";
  import { focusAfterInputExit } from "../../utils/navigationUtils";
  import InputFieldContainer from "./InputFieldContainer.svelte";

  export let description = "input field description";
  export let value: string = "";
  export let inFocus = false;
  export let required = false;
  export let mandatoryMessage = "Toto pole je povinné";
  export let validate: boolean = false;

  let container: HTMLDivElement;
  let inputField: HTMLSelectElement;
  let validationMessage: string = "";
  let invalid: boolean = false;

  const validateField = () => {
    if (inputField.validity.valueMissing && required) {
      inputField.setCustomValidity(mandatoryMessage);
    } else if (inputField.value === "") {
      // field not required --> do not validate empty input
      inputField.setCustomValidity("");
    } else {
      inputField.setCustomValidity("");
    }
    validationMessage = inputField.validationMessage;
    invalid = !inputField.checkValidity();
  };

  // validate on submit
  $: {
    if (inputField && validate) {
      validateField();
    }
  }

  $: {
    if (inFocus) {
      keyManager.update({ center: click("zadat") });
    } else {
      keyManager.update({ center: noAction });
    }
  }
</script>

<InputFieldContainer
  {description}
  bind:inFocus
  bind:inputField
  bind:container
  bind:validationMessage
  focusOnClick={true}
>
  <select
    class="za-input-field p_pri"
    class:invalid
    bind:value
    bind:this={inputField}
    {required}
    on:focus={(e) => {
      console.log(`LanguagePicker got focus`);
      inFocus = true;
    }}
    on:blur={() => {
      focusAfterInputExit(inputField, container);
    }}
    on:input={() => {
      if (!inputField) return;
      validateField();
    }}
  >
    <option value="">nevybráno</option>
    {#each languageCodes as code}
      <option value={code.code}>{code.name}</option>
    {/each}
  </select>
</InputFieldContainer>

<style>
  select {
    background-image: none;
  }

  .invalid {
    border: 1px solid var(--circleColor);
    box-shadow: 0 0 3px 0 var(--circleColor);
  }
</style>
