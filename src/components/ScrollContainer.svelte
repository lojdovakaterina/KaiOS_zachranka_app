<script lang="ts">
  export let inDialog = false;
</script>

<div
  class="p_pri message {inDialog ? 'dialogNavigationPool' : 'navigationPool'}"
>
  <slot />
</div>

<style>
  .message {
    color: var(--textColor);
    border: none;
    outline: none;
    overflow: auto;
    scrollbar-width: none;
    max-height: 180px;
  }
</style>
