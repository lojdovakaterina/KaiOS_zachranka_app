<script lang="ts">
  import { onMount, tick } from "svelte";
  import {
    keyManager,
    type keyManagerParameters,
  } from "../../utils/keyManager";
  import Separator from "../Separator.svelte";
  import SoftKeys from "../SoftKeys.svelte";
  import {
    focusNthElement,
    setInitialFocus,
  } from "../../utils/navigationUtils";

  export let label = "Dialog header";
  export let keyOptions: keyManagerParameters = {};

  let viewKeyOptions: keyManagerParameters | undefined;
  let shown = false;
  let displayedBefore = false;

  export function open() {
    shown = true;
  }

  export function close() {
    shown = false;
  }

  export function isOpen(): boolean {
    return shown;
  }

  export function returnOriginalIndex(): number {
    return viewKeyOptions?.verticalIndex ?? 0;
  }

  onMount(() => {
    tick().then(() => {
      viewKeyOptions = keyManager.returnCurrentOptions();
    });
  });

  $: if (viewKeyOptions && shown) {
    viewKeyOptions = keyManager.returnCurrentOptions();
    keyManager.set(keyOptions);
    keyManager.update({
      scrollContainer: ".dialogScrollContainer",
      scrollListSelector: ".dialogNavigationPool",
      verticalIndex: 0,
    });
    displayedBefore = true;
    // set initial focus when Dialog shown
    requestAnimationFrame(() => {
      focusNthElement(0, ".dialogNavigationPool", ".dialogScrollContainer");
    });
  }

  $: if (viewKeyOptions && !shown && displayedBefore) {
    keyManager.set(viewKeyOptions);
    setInitialFocus();
  }
</script>

{#if shown}
  <div class="backdrop">
    <div class="dialog">
      <Separator text={label} />
      <div class="dialogScrollContainer">
        <slot />
      </div>
      <SoftKeys />
    </div>
  </div>
{/if}

<style>
  .backdrop {
    height: 100%;
    width: 100%;
    z-index: 100;
    margin: 0;
    padding: 0;
    background-color: rgba(0, 0, 0, 0.9);
    position: absolute;
    bottom: 0;
  }

  .dialog {
    width: 100%;
    position: absolute;
    bottom: 0;
    max-height: 250px;
  }

  .dialogScrollContainer {
    width: 100%;
    background-color: white;
    max-height: 180px;
  }
</style>
