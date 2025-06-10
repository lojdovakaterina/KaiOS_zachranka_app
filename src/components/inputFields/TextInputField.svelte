<script lang="ts">
  import { moveCursorToTheEnd } from "../../utils/formUtils";
  import InputFieldContainer from "./InputFieldContainer.svelte";

  export let description = "input field description";
  export let placeholder = "";
  export let pattern: string | null = null;
  export let value: string = "";
  export let inFocus = false;
  export let required = false;
  export let minlength: number | undefined = undefined;
  export let maxlength: number | undefined = undefined;
  export let tooShortMessage = "Text je příliš krátký";
  export let tooLongMessage = "Text je příliš dlouhý";
  export let mandatoryMessage = "Toto pole je povinné";
  export let patternMismatchMessage = "Text není ve správném formátu";
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
      // field not required --> do not validate empty input
      inputField.setCustomValidity("");
    } else if (pattern && inputField.validity.patternMismatch) {
      inputField.setCustomValidity(patternMismatchMessage);
    } else if (maxlength && value.length > maxlength) {
      inputField.setCustomValidity(tooLongMessage);
    } else if (minlength && value.length < minlength) {
      inputField.setCustomValidity(tooShortMessage);
    } else {
      inputField.setCustomValidity("");
    }
    validationMessage = inputField.validationMessage;
    invalid = !inputField.checkValidity();
  };
</script>

<InputFieldContainer
  {description}
  bind:inFocus
  bind:inputField
  bind:validationMessage
>
  <input
    class="za-input-field p_pri"
    class:invalid
    type="text"
    {placeholder}
    {pattern}
    bind:value
    bind:this={inputField}
    {required}
    {minlength}
    {maxlength}
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
