<script lang="ts">
  // the input field is type "tel" because of unsolved system backspace key management issues
  import { moveCursorToTheEnd } from "../../utils/formUtils";
  import InputFieldContainer from "./InputFieldContainer.svelte";

  export let description = "input field description";
  export let placeholder = "";
  export let value: number | null = null;
  export let inFocus = false;
  export let required = false;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let tooLowMessage = "Hodnota je příliš nízká";
  export let tooHighMessage = "Hodnota je příliš vysoká";
  export let mandatoryMessage = "Toto pole je povinné";
  export let patternMismatchMessage = "Do tohoto pole lze zadat pouze číslice";
  export let validate: boolean = false;

  let inputField: HTMLInputElement;
  let validationMessage: string = "";
  let invalid: boolean = false;

  // validate on submit
  $: {
    if (inputField && validate) {
      validateField();
    }
  }

  const validateField = () => {
    if (inputField.validity.valueMissing && required) {
      inputField.setCustomValidity(mandatoryMessage);
    } else if (inputField.value === "") {
      // no input --> do not validate
      inputField.setCustomValidity("");
    } else if (inputField.validity.patternMismatch) {
      inputField.setCustomValidity(patternMismatchMessage);
    } else if (max && Number(inputField.value) > max) {
      inputField.setCustomValidity(tooHighMessage);
    } else if (min && Number(inputField.value) < min) {
      inputField.setCustomValidity(tooLowMessage);
    } else {
      inputField.setCustomValidity("");
    }
    validationMessage = inputField.validationMessage;
    invalid = !inputField.checkValidity();
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<InputFieldContainer
  {description}
  bind:inFocus
  bind:inputField
  bind:validationMessage
>
  <input
    class="za-input-field p_pri"
    class:invalid
    type="tel"
    pattern="^[0-9]*$"
    inputmode="numeric"
    {placeholder}
    bind:value
    bind:this={inputField}
    {required}
    on:focus={(e) => {
      inFocus = true;
      moveCursorToTheEnd(e);
    }}
    on:blur={() => {
      inFocus = false;
    }}
    on:input={() => {
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
