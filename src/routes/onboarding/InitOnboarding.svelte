<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager } from "../../utils/keyManager";
  import { setInitialFocus } from "../../utils/navigationUtils";
  import { pushScreen, screenRouteNames } from "../../utils/routing/router";
  import { click } from "../../constants/keyOptions";

  import Layout from "../../components/layouts/Layout.svelte";
  import Button from "../../components/Button.svelte";

  onMount(() => {
    requestAnimationFrame(() => {
      keyManager.set({
        center: click("zvolit"),
      });
    });

    setInitialFocus();
  });
</script>

<Layout navbar={false} headerText="">
  <div class="container">
    <h2 class="headline">Vítejte v aplikaci Záchranka!</h2>
    <img
      class="za_logo"
      src="./static/ZachrankaApp_112.png"
      alt="Zachranka App logo"
    />
    <div class="buttons">
      <Button
        action={() => {
          pushScreen(screenRouteNames.RegisterUserOnboarding);
        }}
        text="Nastavit"
      />
      <Button
        action={() => {
          pushScreen(screenRouteNames.ConfirmCreateIncident);
        }}
        text="Volat pomoc"
      />
    </div>
  </div>
</Layout>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: var(--themeColorLight);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
  }

  .headline {
    text-align: center;
    color: var(--textColor);
  }

  .za_logo {
    width: 75px;
    display: block;
  }
</style>
