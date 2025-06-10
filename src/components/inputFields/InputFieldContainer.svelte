<script lang="ts">
  import Icon from "../Icon.svelte";

  export let description = "input field description";
  export let inFocus = false;
  export let focusOnClick: boolean = false;
  export let container: HTMLDivElement | null = null;
  export let inputField: HTMLInputElement | HTMLSelectElement;
  export let validationMessage = "";

  function focusInput(
    e: FocusEvent | MouseEvent,
    selector: string = ".za-input-field"
  ) {
    const inputField = (e.target as HTMLElement).querySelector(selector);
    if (inputField) {
      (inputField as HTMLElement).focus();
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container navigationPool {inFocus ? 'dark' : 'light'}"
  tabindex="-1"
  bind:this={container}
  on:focus={(e) => {
    inFocus = true;
    if (!focusOnClick) {
      focusInput(e);
    }
  }}
  on:blur={() => {
    inFocus = false;
  }}
  on:click={(e) => {
    if (focusOnClick) {
      focusInput(e);
    }
  }}
  on:keypress={() => {}}
>
  <div class="description">
    <p class="p_thi ok {inFocus ? 'dark' : 'light'}">
      {description}
    </p>
    {#if inputField && validationMessage !== ""}
      <div class="validationMessage">
        <Icon
          i={"exclamation_circle"}
          dimensions="14px"
          class="inputField-err"
        />
        <p class="p_thi inputField-err">
          {validationMessage}
        </p>
      </div>
    {/if}
  </div>
  <slot></slot>
</div>

<style>
  .container {
    padding: 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: max-content;
  }

  .description {
    padding: 0.5rem 0;
  }

  .ok {
    color: var(--textColor);
  }

  .validationMessage {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
  }

  .validationMessage p {
    margin-left: 0.3rem;
  }

  :global(.inputField-err) {
    color: var(--circleColor);
    font-weight: bolder;
  }

  .light {
    color: var(--textColor);
    background-color: var(--themeColorLight);
  }

  .dark {
    color: var(--themeColorLight);
    background-color: var(--textColor);
  }
</style>
