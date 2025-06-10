<script lang="ts">
  export let info_text = "";

  let largeTextEnabled = (navigator as any).largeTextEnabled;
</script>

<div
  class="info-text"
  style="--infotext-margin: {largeTextEnabled ? '0 0 0.5rem 0' : '0'}"
>
  <span class="p_sec">{info_text}</span>
</div>

<style>
  .info-text {
    padding: 0 1.5rem;
    margin: var(--infotext-margin);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--textColor);
    text-align: center;
  }
</style>
