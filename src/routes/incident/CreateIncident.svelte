<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { keyManager } from "../../utils/keyManager";
  import { createIncidentAsync } from "../../utils/deviceHandling/createIncident";
  import { call } from "../../utils/deviceHandling/call";
  import { popScreen } from "../../utils/routing/router";
  import { goBack, goBackBackspace } from "../../constants/keyOptions";

  import Layout from "../../components/layouts/Layout.svelte";
  import Icon from "../../components/Icon.svelte";

  const messages = [
    "Odesílám zprávu...",
    "Načítám polohu...",
    "Zpřesňuji polohu...",
    "Vytvářím zprávu...",
    "Odesílám zprávu...",
  ];

  let countdown = 5;
  let intervalId: number | null;
  let createIncidentTimeoutId: number;
  let infoMessagesTimeoutId: number;

  let infoText: string;

  function setInfoText(newText: string) {
    infoText = newText;
  }

  function loopArrayWithDelay(arr: string[], delayInSeconds: number): number {
    let i = 1;

    setInfoText(arr[0]);
    const watchId = setInterval(() => {
      if (i >= arr.length) {
        clearTimeout(watchId);
      }
      setInfoText(arr[i]);

      i = i + 1;
    }, delayInSeconds * 1000);

    return watchId;
  }

  keyManager.set({
    left: goBack("zrušit"),
    backspace: goBackBackspace,
  });

  onMount(() => {
    setInfoText(`Do ${countdown} vteřin můžete volání zrušit`);
    // count down from given amount of seconds
    intervalId = setInterval(() => {
      countdown -= 1;
      setInfoText(`Do ${countdown} vteřin můžete volání zrušit`);
    }, 1000);

    // timeout for createIncident function
    createIncidentTimeoutId = setTimeout(() => {
      // create incident message
      infoMessagesTimeoutId = loopArrayWithDelay(messages, 3);

      createIncidentAsync()
        .then(() => {
          clearTimeout(infoMessagesTimeoutId);
          setInfoText(`Zpráva úspěšně odeslána, vytáčím nouzovou linku...`);
          // call("", popScreen); // insert the number that is supposed to be called
        })
        .catch(() => {
          clearTimeout(infoMessagesTimeoutId);
          setInfoText(`Zprávu se nepovedlo odeslat, vytáčím nouzovou linku...`);
          // call("", popScreen); // insert the number that is supposed to be called
        });
    }, countdown * 1000);
  });

  // clear all intervals
  onDestroy(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    if (createIncidentTimeoutId) {
      clearTimeout(createIncidentTimeoutId);
    }
    if (infoMessagesTimeoutId) {
      clearTimeout(infoMessagesTimeoutId);
    }
  });

  // clear interval when the counter reaches 0
  $: {
    if (countdown === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // trigger reactivity
  $: displayText = infoText;
</script>

<Layout navbar={false} headerText="kontaktuji záchranáře">
  <div class="container">
    <h2 class="large-text">{displayText}</h2>
    <Icon i="locator_call" dimensions="150px" />
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
