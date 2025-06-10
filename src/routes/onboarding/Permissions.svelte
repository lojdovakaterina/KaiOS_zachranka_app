<script lang="ts">
  import { keyManager } from "../../utils/keyManager";
  import { setupApp } from "../../utils/setupApp";
  import { screenRouteNames } from "../../utils/routing/router";
  import {
    detectCriticalMissingFeatures,
    type DeviceFeature,
  } from "../../utils/deviceHandling/detectFeatures";

  import Layout from "../../components/layouts/Layout.svelte";
  import Icon from "../../components/Icon.svelte";
  import { navigate } from "../../constants/keyOptions";

  const largeTextEnabled: boolean = (navigator as any).largeTextEnabled;

  keyManager.set({});

  let checkedFeatures = false;
  let hasErrors = false;
  let showErrMessages = false;
  let missingFeatures: DeviceFeature[] = [];

  function runFeaturesTest(reset: boolean = false) {
    if (reset) {
      checkedFeatures = false;
      hasErrors = false;
      showErrMessages = false;
      missingFeatures = [];
      keyManager.set({});
    }

    detectCriticalMissingFeatures()
      .then((missing) => {
        // show appropriate error messages
        if (missing.length !== 0) {
          missingFeatures = missing;
          hasErrors = true;
        } else {
          checkedFeatures = true;
        }
      })
      .catch((e: Error) => {
        console.error(`detectCriticalMissingFeatures.catch: `, { e });
        missingFeatures.push({
          name: "fatal error",
          present: false,
          errorMessage: "Neočekávaná chyba",
        });
        hasErrors = true;
      });
  }

  runFeaturesTest();

  $: if (checkedFeatures) {
    setupApp();
    keyManager.set({
      center: navigate("doplnit", screenRouteNames.Profile, true),
      left: navigate("později", screenRouteNames.Home, true),
    });
  }

  $: if (hasErrors) {
    keyManager.set({
      center: {
        text: showErrMessages ? "skrýt" : "zobrazit",
        action: showErrMessages
          ? () => {
              showErrMessages = false;
            }
          : () => {
              showErrMessages = true;
            },
      },
      right: {
        text: "znovu",
        action: () => {
          runFeaturesTest(true);
        },
      },
    });
  }

  $: headerText = checkedFeatures ? "Hotovo!" : "Kontrola zařízení";
</script>

<Layout navbar={false} {headerText}>
  <div class="container">
    {#if !checkedFeatures}
      {#if !hasErrors}
        <p class="infoTextBold">
          Vydržte prosím, probíhá kontrola funkcí, které potřebujeme pro správné
          fungování aplikace.
        </p>
        {#if !largeTextEnabled}
          <Icon i="hourglass" class="perm-hourglass" dimensions="50px" />
        {/if}
      {:else}
        <p class="infoTextBold">
          {showErrMessages
            ? "Nastaly tyto problémy: "
            : "Něco se pokazilo, aplikace teď nemůže správně fungovat. Chcete ukázat v čem je problém?"}
        </p>
        {#if showErrMessages}
          <div class="errMsgContainer navigationPool">
            <ul>
              {#each missingFeatures as feature}
                <li class="errMsg">{feature.errorMessage}</li>
              {/each}
            </ul>
          </div>
        {/if}
      {/if}
    {:else}
      <div class={largeTextEnabled ? "errMsgContainer navigationPool" : ""}>
        <p class="infoText">
          Každý další údaj o vás může zrychlit komunikaci s tísňovou linkou a
          urychlit příjezd záchranářů nebo zjednodušit vaši indikaci.
        </p>
        <p class="infoTextBold">
          Najděte si prosím čas na doplnění údajů ve vašem profilu
        </p>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: var(--themeColorLight);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
  }

  .infoText {
    color: var(--textColor);
    text-align: start;
    margin: 0.5rem 0;
  }

  .infoTextBold {
    color: var(--textColor);
    text-align: start;
    font-weight: bold;
    margin: 0.5rem 0;
  }

  :global(.perm-hourglass) {
    color: var(--textColor);
    margin: 1rem 0;
  }

  .errMsg {
    color: var(--textColor);
  }

  .errMsgContainer {
    border: none;
    outline: none;
    overflow-x: auto;
    scrollbar-width: none;
  }
</style>
