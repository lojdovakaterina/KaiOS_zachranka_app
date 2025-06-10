<script lang="ts">
  import { keyManager } from "../../utils/keyManager";
  import { screenRouteNames } from "../../utils/routing/router";
  import {
    goBack,
    goBackBackspace,
    navigate,
  } from "../../constants/keyOptions";
  import * as colors from "../../constants/colors";

  import Layout from "../../components/layouts/Layout.svelte";

  const color = colors.testColor;

  keyManager.set({
    center: navigate("volat", screenRouteNames.TestCallService, true),
    left: goBack("zrušit"),
    backspace: goBackBackspace,
  });
</script>

<Layout navbar={false} headerText="přivolat pomoc" {color}>
  <div class="container">
    <h2 class="large-text">Opravdu si přejete přivolat pomoc?</h2>
    <p class="confirmation">Toto je pouze test</p>
  </div>
</Layout>

<style>
  .container {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    background-color: var(--themeColorLight);
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-rows: 1fr 1fr 1fr;
  }

  .large-text {
    text-align: center;
    color: var(--textColor);
    grid-row-start: 2;
    grid-row-end: 2;
  }

  .confirmation {
    color: var(--testColor);
    grid-row-start: 3;
    grid-row-end: 3;
    opacity: 0.5;
  }
</style>
