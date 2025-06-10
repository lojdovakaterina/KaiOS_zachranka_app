<script lang="ts">
  const largeTextEnabled = (navigator as any).largeTextEnabled;
</script>

<div class="layout {largeTextEnabled ? 'large-text' : 'base'}">
  <slot></slot>
</div>

<style>
  .layout {
    width: 100%;
    height: 100%;
    background-color: var(--themeColorLight);
  }

  .base {
    display: grid;
    grid-template-rows: [gps_start] 25% [text_start] 25% [button_start] auto;
    justify-items: center;
  }

  .large-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
