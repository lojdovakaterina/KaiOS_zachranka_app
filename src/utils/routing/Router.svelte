<script lang="ts">
  import { onMount, type ComponentType } from "svelte";
  import {
    currentScreen,
    lastVisitedScreen,
    parseRoute,
    replaceScreen,
  } from "./router";
  import { setTextSize } from "../deviceHandling/largeTextEnabledHandler";

  export let routes: Record<string, ComponentType>;
  export let initialScreen: string;
  export let invalidRouteScreen: ComponentType;

  let refresh = false;
  let currentRoute = initialScreen;

  onMount(() => {
    // set initial screen
    replaceScreen(initialScreen);
  });

  // re-render the entire page when large text is enabled
  window.addEventListener("largetextenabledchanged", () => {
    setTextSize();
    refresh = !refresh;
  });

  window.addEventListener(
    "hashchange",
    (change) => {
      currentRoute = parseRoute(new URL(change.newURL).hash);
      $lastVisitedScreen = parseRoute(new URL(change.oldURL).hash);
      $currentScreen = currentRoute;
    },
    false
  );

  $: component = routes[currentRoute || ""] || invalidRouteScreen;
</script>

{#key refresh}
  <svelte:component this={component} />
{/key}
