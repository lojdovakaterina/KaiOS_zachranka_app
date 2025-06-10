<script lang="ts">
  import ScrollContainer from "../ScrollContainer.svelte";

  let enabled = (navigator as any).largeTextEnabled;
</script>

<div class={enabled ? "dialog-textbox-large" : "dialog-textbox"}>
  <ScrollContainer inDialog={true}>
    <slot />
  </ScrollContainer>
</div>

<style>
  :global(.dialog-textbox) {
    padding: 0.5rem;
  }
  :global(.dialog-textbox-large) {
    padding: 0 0.5rem;
  }
</style>
