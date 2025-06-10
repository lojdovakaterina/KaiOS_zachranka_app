<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager } from "../../utils/keyManager";
  import { screenRouteNames } from "../../utils/routing/router";
  import { setInitialFocus } from "../../utils/navigationUtils";
  import {
    goBackBackspace,
    navigate,
    noAction,
  } from "../../constants/keyOptions";
  import { click } from "../../constants/keyOptions";
  import type { Contact } from "../../data/Caller";

  import Layout from "../../components/layouts/Layout.svelte";
  import ListItem from "../../components/ListItem.svelte";
  import { fetchAllContacts } from "../../utils/deviceHandling/fetchContacts";

  let largeTextEnabled = (navigator as any).largeTextEnabled;

  // fetch contact list on mount
  let contactList: Contact[] = [];

  // trigget svelte reactivity
  function updateContactList(val: Contact) {
    contactList = [...contactList, val];
  }

  onMount(() => {
    fetchAllContacts(
      (contact) => {
        updateContactList(contact);
      },
      (err) => {
        console.warn(err);
      }
    );

    keyManager.set({
      left: navigate("zpět", screenRouteNames.ContactList, true),
      backspace: goBackBackspace,
    });
  });

  $: contactList.length > 0
    ? keyManager.update({ center: click("vybrat") })
    : keyManager.update({ center: noAction });

  $: contactList.length > 0 ? setInitialFocus() : () => {};
</script>

<Layout
  navbar={false}
  headerText={largeTextEnabled
    ? "Vybrat z adrešáře"
    : "Vybrat kontakt z adresáře"}
>
  {#each contactList as contact, index}
    <ListItem
      primary={contact.name}
      secondary={contact.phoneNumber}
      icon="phone"
      destination={screenRouteNames.ContactDetail}
      data={{ contact: contactList[index] }}
      method="replace"
    />
  {:else}
    <div class="not_found">
      <h2>
        Napovedlo se nám ve Vašem adresáři najít žádné kontakty, zadejte prosím
        údaje manuálně.
      </h2>
    </div>
  {/each}
</Layout>

<style>
  .not_found {
    width: 100%;
    height: 100%;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--textColor);
    text-align: center;
  }
</style>
