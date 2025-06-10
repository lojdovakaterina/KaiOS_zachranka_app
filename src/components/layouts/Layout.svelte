<script lang="ts">
  import * as colors from "../../constants/colors";

  import Header from "../Header.svelte";
  import Navbar from "../Navbar.svelte";
  import SoftKeys from "../SoftKeys.svelte";

  export let navbar: boolean = true;
  export let headerText: string = "";
  export let color: string = colors.themeColor;
</script>

<svelte:head>
  <meta name="theme-color" content={color} />
</svelte:head>

<div class="layout">
  <Header text={headerText} {color} />
  {#if navbar === true}
    <Navbar style="new" />
  {/if}
  <div class="content {navbar ? 'navbar' : 'no_navbar'}">
    <slot />
  </div>
  <SoftKeys {color} />
</div>

<style>
  .layout {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
    bottom: 0;
    z-index: 10;
    background-color: var(--themeColorLight);
    font-family: sans-serif;
    display: grid;
    grid-template-rows: [header] 28px [navbar] 28px [content] auto [swkeys] 28px;
  }

  .content {
    width: 100%;
    height: max-content;
    overflow-y: auto;
  }

  .navbar {
    grid-row: content;
    height: calc(100vh - 3 * 28px);
  }

  .no_navbar {
    grid-row: navbar / content;
    height: calc(100vh - 2 * 28px);
  }
</style>
