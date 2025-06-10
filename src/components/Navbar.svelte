<script lang="ts">
  import { onMount } from "svelte";
  import * as colors from "../constants/colors";
  import { currentScreen } from "../utils/routing/router";
  import { screenRouteNames } from "../utils/routing/router";
  import {
    calculateNavBarWidth,
    scrollItemIntoView,
  } from "../utils/frontEndUtils";

  export let color = colors.themeColorLight;
  export let style: "old" | "new" = "old";

  let largeTextEnabled = (navigator as any).largeTextEnabled;
  let tabText = [
    { path: screenRouteNames.Test, text: "Test" },
    { path: screenRouteNames.Home, text: "Alarm" },
    { path: screenRouteNames.Profile, text: "Můj profil" },
  ];
  let navBarWidth = calculateNavBarWidth(tabText, 12, largeTextEnabled);

  if (navBarWidth < 240) {
    navBarWidth = 240;
  }

  onMount(() => {
    const navbarContainer = document.getElementById("navbar");
    const centerElement = document.getElementById($currentScreen);

    if (navbarContainer && centerElement) {
      scrollItemIntoView(navbarContainer, centerElement);
    }
  });
</script>

{#if style === "old" || largeTextEnabled}
  <div id="navbar" class="container">
    <div
      class="tab"
      style="--navbar-color: {color}; width: {navBarWidth.toString() + 'px'};"
    >
      {#each tabText as option}
        <div
          class="item"
          style="--item-padding: {largeTextEnabled ? '0' : '2px 0 1px 0'}"
          id={option.path}
        >
          <h3
            class="item__underline {option.path === $currentScreen
              ? 'highlight'
              : ''}"
            style="--highlight-padding: {largeTextEnabled
              ? '0 12px'
              : '2px 12px 1px 12px'};
            --item-und-padding: {largeTextEnabled ? '0' : '2px 12px'}
            "
          >
            {option.text}
          </h3>
        </div>
      {:else}
        Navigace
      {/each}
    </div>
  </div>
{:else}
  <div id="navbar" class="container cont-new">
    <div
      class="tab"
      style="--navbar-color: {color}; width: {navBarWidth.toString() + 'px'};"
    >
      {#each tabText as option}
        <h3
          class="item-new {option.path === $currentScreen
            ? 'highlight-new'
            : ''}"
          style={largeTextEnabled ? "font-size: 14px;" : ""}
        >
          {option.text.toUpperCase()}
        </h3>
      {:else}
        Navigace
      {/each}
    </div>
    <div class="dots">
      {#each tabText as option}
        {#if option.path === $currentScreen}
          <svg
            class="dot"
            width="16.5"
            height="5.5"
            viewBox="0 0 51 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42 0.0146484C42.1654 0.00505127 42.3321 0 42.5 0C47.1944 0 51 3.80558 51 8.5C51 13.1944 47.1944 17 42.5 17C42.3321 17 42.1655 16.994 42 16.9844V17H8V16.9844C3.53834 16.7255 0 13.0266 0 8.5C0 3.97343 3.53832 0.273463 8 0.0146484V0H42V0.0146484Z"
              fill="#124139"
            />
          </svg>
        {:else}
          <svg
            class="dot"
            width="5.5"
            height="5.5"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8.5" cy="8.5" r="8.5" fill="#829795" />
          </svg>
        {/if}
      {:else}
        ...
      {/each}
    </div>
  </div>
{/if}

<style>
  /* new navbar styles */
  .cont-new {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .dots {
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
  }

  .dot {
    margin: 0 3px;
  }

  .item-new {
    font-weight: bold;
    color: var(--grayColor);
  }

  .highlight-new {
    color: var(--textColor);
  }

  /* old navbar styles */
  .container {
    grid-row: navbar;
    height: max-content;
    width: 100%;
    overflow-x: hidden;
  }

  .tab {
    height: max-content;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: var(--navbar-color);
  }

  .item {
    width: max-content;
    padding: var(--item-padding);
    color: var(--textColor);
  }

  .item__underline {
    padding: var(--item-und-padding);
  }

  .highlight {
    font-weight: bold;
    border-bottom: 3px solid var(--textColor);
    padding: var(--highlight-padding);
  }
</style>
