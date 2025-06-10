<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "../constants/keyOptions";
  import { keyManager } from "../utils/keyManager";
  import { screenRouteNames } from "../utils/routing/router";

  import Layout from "../components/layouts/Layout.svelte";
  import InfoText from "../components/InfoText.svelte";
  import LocationBubble from "../components/LocationBubble.svelte";
  import AlarmCircle from "../components/AlarmCircle.svelte";
  import CallLayout from "../components/layouts/CallLayout.svelte";

  const info_text = "Pro přivolání pomoci stiskněte tlačítko VOLAT";
  const largeTextEnabled = (navigator as any).largeTextEnabled;

  onMount(() => {
    requestAnimationFrame(() => {
      keyManager.set({
        center: navigate("volat", screenRouteNames.ConfirmCreateIncident),
      });
    });
  });
</script>

<Layout headerText="přivolat pomoc">
  <CallLayout>
    {#if !largeTextEnabled}
      <LocationBubble />
    {/if}
    <InfoText {info_text} />
    <AlarmCircle />
  </CallLayout>
</Layout>
