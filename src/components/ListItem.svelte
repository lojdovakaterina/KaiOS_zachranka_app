<script lang="ts">
  import { pushScreen, replaceScreen } from "../utils/routing/router";
  import Icon from "./Icon.svelte";

  export let primary = "";
  export let secondary = "";
  export let icon:
    | "arrowhead-right"
    | "first-aid-kit"
    | "hourglass"
    | "phone"
    | "user"
    | "exclamation_circle"
    | "locator_call"
    | "locator_test"
    | null = null;
  export let destination = "";
  export let data = {};
  export let hideArrow: boolean = false;
  export let method: "push" | "replace" = "push";

  let largeTextEnabled = (navigator as any).largeTextEnabled;
</script>

<button
  class="li-container navigationPool"
  tabindex="-1"
  on:click={() => {
    if (method === "push") {
      pushScreen(destination, data);
    }
    if (method === "replace") {
      replaceScreen(destination, data);
    }
  }}
>
  <div class="li-layout">
    <div
      class={icon !== null && !largeTextEnabled ? "icon-text-container" : ""}
    >
      {#if icon !== null && !largeTextEnabled}
        <Icon
          i={icon}
          class="ListItem-icon ListItem-icon-link"
          dimensions="20px"
        />
      {/if}
      <div class="text-col">
        <span class={primary.length > 0 ? "p_pri" : "hidden"}>{primary}</span>
        <span class={secondary.length > 0 ? "p_sec" : "hidden"}
          >{secondary}</span
        >
      </div>
    </div>
    {#if !hideArrow}
      <Icon class="ListItem-icon" i="arrowhead-right" dimensions="16px" />
    {/if}
  </div>
</button>

<style>
  .li-container {
    width: 100%;
    height: 60px;
    background: none;
    border: none;
    border-radius: 0;
  }

  .li-layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  :global(.ListItem-icon) {
    /* filter: var(--textColorFilter); */
    color: var(--textColor);
  }

  :global(.ListItem-icon-link) {
    margin-right: 8px;
  }

  .icon-text-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .text-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    text-align: start;
    color: var(--textColor);
  }

  .li-container:focus {
    background-color: var(--textColor);
  }

  :global(.li-container:focus .ListItem-icon) {
    /* filter: var(--themeColorLightFilter); */
    color: var(--themeColorLight);
  }

  .li-container:focus .text-col {
    color: var(--themeColorLight);
  }

  .hidden {
    display: none;
  }
</style>
