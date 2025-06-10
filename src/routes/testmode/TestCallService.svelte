<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { keyManager } from "../../utils/keyManager";
  import { replaceScreen, screenRouteNames } from "../../utils/routing/router";
  import { goBack, goBackBackspace } from "../../constants/keyOptions";
  import * as colors from "../../constants/colors";

  import Layout from "../../components/layouts/Layout.svelte";
  import Icon from "../../components/Icon.svelte";

  const color = colors.testColor;

  let countdown = 5;
  let intervalId: number | null;
  let timeoutId: number;

  keyManager.set({
    left: goBack("zrušit"),
    backspace: goBackBackspace,
  });

  onMount(() => {
    // count down from given amount of seconds
    intervalId = setInterval(() => {
      countdown -= 1;
    }, 1000);
    // timeout for createIncident function
    timeoutId = setTimeout(() => {
      replaceScreen(screenRouteNames.TestResultScreen);
    }, countdown * 1000);
  });

  onDestroy(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  // clear interval when the counter reaches 0
  $: {
    if (countdown === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
</script>

<Layout navbar={false} headerText="kontaktuji záchranáře" {color}>
  <div class="container">
    <h2 class="large-text">Do {countdown} vteřin můžete volání zrušit</h2>
    <Icon i="locator_test" dimensions="150px" />
  </div>
</Layout>

<style>
  .container {
    width: 100%;
    height: 100%;
    padding: 1rem 1rem;
    background-color: var(--themeColorLight);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .large-text {
    text-align: center;
    color: var(--textColor);
  }
</style>
