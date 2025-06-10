<script lang="ts">
  import { onMount } from "svelte";
  import Router from "./utils/routing/Router.svelte";
  import { keyManager } from "./utils/keyManager";
  import { getFromLocalStorage, storageHandles } from "./utils/storage";
  import { setTextSize } from "./utils/deviceHandling/largeTextEnabledHandler";
  import { currentPosition } from "./data/Position";
  import { readBatteryLevelAsync } from "./data/DeviceInfo";
  import { screenRouteNames } from "./constants/screenRouteNames";
  import { routes } from "./constants/routes";

  import Home from "./routes/Home.svelte";

  const intervalInS = 60; //one minute interval for position watch

  // start onboarding if the app is run for the first time
  let initialScreen =
    getFromLocalStorage(storageHandles.FirstRun) === null
      ? screenRouteNames.InitOnboarding
      : screenRouteNames.Home;

  // get current device position
  currentPosition.readCurrentValueAsync();
  // if battery above 10%, start watching position every minute
  readBatteryLevelAsync().then((level) => {
    if (level > 0.1) {
      currentPosition.collectWhenAppRunning(intervalInS);
    }
  });

  onMount(() => {
    keyManager.createListener(); // start listening to keyboard events
    setTextSize(); // get the correct text sizing and change the layouts accordingly
  });
</script>

<Router {routes} {initialScreen} invalidRouteScreen={Home} />
