<script lang="ts">
  import { onMount } from "svelte";
  import * as colors from "../../constants/colors";
  import { navigate } from "../../constants/keyOptions";
  import { keyManager, type KeyOption } from "../../utils/keyManager";
  import {
    lastVisitedScreen,
    replaceScreen,
    screenRouteNames,
  } from "../../utils/routing/router";
  import { closeDialog } from "../../constants/dialogKeyOptions";

  import Layout from "../../components/layouts/Layout.svelte";
  import LocationBubble from "../../components/LocationBubble.svelte";
  import InfoText from "../../components/InfoText.svelte";
  import AlarmCircle from "../../components/AlarmCircle.svelte";
  import CallLayout from "../../components/layouts/CallLayout.svelte";
  import Dialog from "../../components/dialog/Dialog.svelte";
  import DialogTextBox from "../../components/dialog/DialogTextBox.svelte";

  const number = "TEST";
  const info_text = "Pro testovací volání stiskněte tlačítko TEST";
  const color = colors.testColor;
  const largeTextEnabled = (navigator as any).largeTextEnabled;

  let dialog: Dialog;

  const goHome: KeyOption = {
    text: "zpět",
    action: (e: any) => {
      if (e) {
        e.preventDefault();
      }
      requestAnimationFrame(() => {
        replaceScreen(screenRouteNames.Home);
      });
    },
  };

  keyManager.set({
    center: navigate("test", screenRouteNames.TestConfirmCreateIncident),
  });

  onMount(() => {
    // if test mode not confirmed, return back to home page
    if ($lastVisitedScreen === screenRouteNames.Home) {
      dialog.open();
    }
  });
</script>

<Layout headerText="testovací režim" {color}>
  <CallLayout>
    {#if !largeTextEnabled}
      <LocationBubble />
    {/if}
    <InfoText {info_text} />
    <AlarmCircle {number} {color} />
  </CallLayout>
</Layout>

<Dialog
  bind:this={dialog}
  label="Testovací režim"
  keyOptions={{
    left: goHome,
    right: closeDialog("pokračovat", dialog),
    backspace: goHome,
  }}
>
  <DialogTextBox>
    Aplikace je nyní v testovacím režimu. Nedojde k volání záchranné služby. Po
    aktivaci nouzové zprávy Vám bude zobrazena zpráva potvrzující správný chod
    aplikace.
  </DialogTextBox>
</Dialog>
