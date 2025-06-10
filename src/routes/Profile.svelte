<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager } from "../utils/keyManager";
  import { lastVisitedScreen } from "../utils/routing/router";
  import { screenRouteNames } from "../utils/routing/router";
  import { setInitialFocus } from "../utils/navigationUtils";
  import { click } from "../constants/keyOptions";

  import Layout from "../components/layouts/Layout.svelte";
  import ListItem from "../components/ListItem.svelte";

  const detailScreens = [
    screenRouteNames.PersonalInformation,
    screenRouteNames.HealthInformation,
    screenRouteNames.TemporaryInformation,
    screenRouteNames.ContactList,
  ];

  keyManager.set({ center: click("vybrat") });

  onMount(() => {
    // set focus to the last visited detail screen or to the first element
    let toFocus = detailScreens.includes($lastVisitedScreen ?? "")
      ? detailScreens.indexOf($lastVisitedScreen ?? "")
      : 0;

    setInitialFocus(toFocus);
  });
</script>

<Layout headerText="můj profil">
  <ListItem
    primary="Osobní informace"
    icon="user"
    destination={screenRouteNames.PersonalInformation}
  />
  <ListItem
    primary="Zdravotní údaje"
    icon="first-aid-kit"
    destination={screenRouteNames.HealthInformation}
  />
  <ListItem
    primary="Dočasná informace"
    icon="hourglass"
    destination={screenRouteNames.TemporaryInformation}
  />
  <ListItem
    primary="Kontakt na osobu blízkou"
    icon="phone"
    destination={screenRouteNames.ContactList}
  />
</Layout>
