<script lang="ts">
  import { moveCursorToTheEnd } from "../../utils/formUtils";
  import InputFieldContainer from "./InputFieldContainer.svelte";

  export let description = "input field description";
  export let placeholder = "";
  export let value: string | null = "";
  export let inFocus = false;
  export let required = false;
  export let validate: boolean = false;
  export let invalidFormatMessage = "Nesprávný formát e-mailové adresy";
  export let mandatoryMessage = "Toto pole je povinné";

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
    } else if (inputField.validity.typeMismatch) {
      inputField.setCustomValidity(invalidFormatMessage);
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
    type="email"
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
