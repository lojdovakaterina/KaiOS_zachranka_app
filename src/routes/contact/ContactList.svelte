<script lang="ts">
  import { onMount } from "svelte";
  import { keyManager, type KeyOption } from "../../utils/keyManager";
  import { noAction } from "../../constants/keyOptions";
  import { screenRouteNames } from "../../utils/routing/router";
  import { getFromLocalStorage, storageHandles } from "../../utils/storage";
  import {
    clickItem,
    focusNthElement,
    setInitialFocus,
  } from "../../utils/navigationUtils";
  import { click, goBackBackspace } from "../../constants/keyOptions";
  import { closeDialog, openDialog } from "../../constants/dialogKeyOptions";
  import { Caller, type Contact } from "../../data/Caller";

  import Layout from "../../components/layouts/Layout.svelte";
  import ListItem from "../../components/ListItem.svelte";
  import Dialog from "../../components/dialog/Dialog.svelte";
  import DialogListOption from "../../components/dialog/DialogListOption.svelte";
  import DialogTextBox from "../../components/dialog/DialogTextBox.svelte";
  import Icon from "../../components/Icon.svelte";

  let largeTextEnabled = (navigator as any).largeTextEnabled;
  let contactList: Contact[] = [];

  let confirmDeleteDialog: Dialog;
  let pickContactInputFormDialog: Dialog;

  let caller = getFromLocalStorage<Caller>(storageHandles.Caller, Caller);
  if (caller) {
    contactList = caller.contacts ?? [];
  }

  const deleteContactAndCloseDialog = (
    desc: string,
    dialog: Dialog
  ): KeyOption => {
    return {
      text: desc,
      action: () => {
        caller?.deleteContactDetail(dialog.returnOriginalIndex(), true);
        // trigger life cycle update
        contactList = caller?.contacts ?? [];
        // reset focus correctly
        contactList.length > 0
          ? requestAnimationFrame(() => {
              focusNthElement(keyManager.verticalIndex - 1);
            })
          : requestAnimationFrame(() => {
              setInitialFocus();
            });
        dialog.close();
      },
    };
  };

  onMount(() => {
    // prevent button click on focus
    requestAnimationFrame(() => {
      setInitialFocus();
      keyManager.set({
        backspace: goBackBackspace,
      });
    });
  });

  $: {
    if (contactList.length === 0) {
      requestAnimationFrame(() => {
        keyManager.update({
          left: noAction,
          center: openDialog("přidat", pickContactInputFormDialog),
          right: noAction,
        });
      });
    } else {
      requestAnimationFrame(() => {
        keyManager.update({
          left: openDialog(`smazat`, confirmDeleteDialog),
          center: click("upravit"),
          right: openDialog("přidat", pickContactInputFormDialog),
        });
      });
    }
  }
</script>

<Layout
  navbar={false}
  headerText={largeTextEnabled
    ? "Kontakt na blízké"
    : "Kontakt na osobu blízkou"}
>
  <div class="za-info-text--large">
    Vložte prosím kontakty na vaše blízké, kteří mohou být v případě nouze
    kontaktováni zdravotnickou záchrannou službou.
  </div>
  {#each contactList as contact, index}
    <ListItem
      primary={contact.name}
      secondary={contact.phoneNumber}
      icon="phone"
      destination={screenRouteNames.ContactDetail}
      data={{ index: index }}
      hideArrow={true}
    />
  {:else}
    {#if !largeTextEnabled}
      <Icon i="contact" class="contact-icon" dimensions="65px" />
    {/if}
  {/each}
</Layout>

<Dialog
  bind:this={confirmDeleteDialog}
  label="Smazat kontakt"
  keyOptions={{
    left: closeDialog("zrušit", confirmDeleteDialog),
    right: deleteContactAndCloseDialog(`smazat`, confirmDeleteDialog),
    backspace: closeDialog("", confirmDeleteDialog),
  }}
>
  <DialogTextBox>Opravdu chcete kontakt smazat?</DialogTextBox>
</Dialog>

<Dialog
  bind:this={pickContactInputFormDialog}
  label="Přidat kontakt"
  keyOptions={{
    left: closeDialog("zrušit", pickContactInputFormDialog),
    center: {
      text: "vybrat",
      action: () => {
        clickItem(".dialogNavigationPool");
      },
    },
    backspace: closeDialog("", pickContactInputFormDialog),
  }}
>
  <DialogListOption
    desc="Vybrat z adresáře"
    destination={screenRouteNames.AddContactFromContactList}
  />
  <DialogListOption
    desc="Vytvořit nový"
    destination={screenRouteNames.ContactDetail}
  />
</Dialog>

<style>
  :global(.contact-icon) {
    color: var(--textColor);
  }
</style>
