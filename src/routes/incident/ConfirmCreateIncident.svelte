<script lang="ts">
  import { keyManager } from "../../utils/keyManager";
  import { screenRouteNames } from "../../utils/routing/router";
  import {
    goBack,
    goBackBackspace,
    navigate,
  } from "../../constants/keyOptions";

  import Layout from "../../components/layouts/Layout.svelte";

  keyManager.set({
    center: navigate("volat", screenRouteNames.CallService, true),
    left: goBack("zrušit"),
    backspace: goBackBackspace,
  });
</script>

<Layout navbar={false} headerText="přivolat pomoc">
  <div class="container">
    <h2 class="large-text">Opravdu si přejete přivolat pomoc?</h2>
  </div>
</Layout>

<style>
  .container {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    background-color: var(--themeColorLight);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .large-text {
    text-align: center;
    color: var(--textColor);
  }
</style>
