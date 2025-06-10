<script lang="ts">
  import { click, noAction } from "../../constants/keyOptions";
  import { keyManager } from "../../utils/keyManager";
  import { focusAfterInputExit } from "../../utils/navigationUtils";
  import InputFieldContainer from "./InputFieldContainer.svelte";

  export let description = "input field description";
  export let placeholder = "";
  export let value: string | null = null;
  export let inFocus = false;
  export let required = false;
  export let min: string | undefined = undefined;
  export let max: string | undefined = undefined;
  export let tooSoonMessage = "Zadejte pozdější datum";
  export let tooLateMessage = "Zadejte dřívější datum";
  export let mandatoryMessage = "Toto pole je povinné";
  export let validate: boolean = false;

  let container: HTMLDivElement;
  let inputField: HTMLInputElement;
  let validationMessage: string = "";
  let invalid: boolean = false;

  const validateField = () => {
    if (inputField.validity.valueMissing && required) {
      inputField.setCustomValidity(mandatoryMessage);
    } else if (min && inputField.validity.rangeUnderflow) {
      inputField.setCustomValidity(tooSoonMessage);
    } else if (max && inputField.validity.rangeOverflow) {
      inputField.setCustomValidity(tooLateMessage);
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<InputFieldContainer
  {description}
  bind:inFocus
  bind:inputField
  bind:container
  bind:validationMessage
  focusOnClick={true}
>
  <input
    class="za-input-field p_pri"
    class:invalid
    type="date"
    {placeholder}
    bind:value
    bind:this={inputField}
    {required}
    {min}
    {max}
    on:focus={() => {
      inFocus = true;
    }}
    on:blur={() => {
      focusAfterInputExit(inputField, container);
    }}
    on:change={() => {
      if (!inputField) return;
      validateField();
    }}
  />
</InputFieldContainer>

<style>
  .invalid {
    border: 1px solid var(--circleColor);
    box-shadow: 0 0 3px 0 var(--circleColor);
  }
</style>
