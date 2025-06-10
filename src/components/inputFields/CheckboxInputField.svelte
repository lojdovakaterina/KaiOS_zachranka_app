<script lang="ts">
  import { click, noAction } from "../../constants/keyOptions";
  import { keyManager } from "../../utils/keyManager";

  export let description = "input field description";
  export let checked = false;

  let inFocus = false;

  function toggleCheckbox(e: Event) {
    const input = (e.target as HTMLDivElement).querySelector("input");
    if (input === null) {
      return;
    }
    checked = !checked;
  }

  $: {
    if (inFocus) {
      keyManager.update({ center: click("označit") });
    } else {
      keyManager.update({ center: noAction });
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container navigationPool {inFocus ? 'dark' : 'light'}"
  tabindex="-1"
  on:focus={() => {
    inFocus = true;
  }}
  on:blur={() => {
    inFocus = false;
  }}
  on:click={(e) => {
    toggleCheckbox(e);
  }}
  on:keypress={() => {}}
>
  <div class="description p_pri {inFocus ? 'dark' : 'light'}">
    {description}
  </div>
  <label class="checkbox_container {inFocus ? 'dark' : 'light'}">
    <input type="checkbox" bind:checked />
    <span class="displayed_checkbox {inFocus ? 'dark' : 'light'}">
      {#if checked}
        <svg
          class="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          width="15px"
          height="15px"
          viewBox="0 0 48 48"
          fill="currentColor"
          stroke="currentColor"
        >
          <path
            d="M47.3287 6.68215C48.1676 7.53593 48.2201 8.88828 47.4868 9.80498L47.3302 9.98269L17.5825 40.3149C17.1476 40.7583 16.5562 41.0059 15.9408 40.9999C15.3255 40.9939 14.7377 40.7348 14.3111 40.283L0.639782 25.7989C-0.236929 24.8701 -0.209327 23.3929 0.702406 22.4998C1.61415 21.6069 3.06427 21.6364 3.94095 22.5652L15.9945 35.3329L44.0887 6.68367L44.2632 6.52419C45.1623 5.77634 46.4898 5.82843 47.3287 6.68215Z"
          />
        </svg>
      {/if}
    </span>
  </label>
</div>

<style>
  .container {
    padding: 1rem 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .light {
    color: var(--textColor);
    background-color: var(--themeColorLight);
  }

  .dark {
    color: var(--themeColorLight);
    background-color: var(--textColor);
  }

  .checkbox_container {
    display: flex;
    align-items: center;
  }

  .checkbox_container input {
    visibility: hidden;
    display: block;
    height: 0;
    width: 0;
    position: absolute;
    overflow: hidden;
  }

  .displayed_checkbox {
    height: 17px;
    width: 17px;
    border: 2px solid;
    border-radius: 7px;
    display: inline-block;
    position: relative;
  }

  .checkmark {
    position: absolute;
    top: 1px;
    left: 1px;
  }
</style>
