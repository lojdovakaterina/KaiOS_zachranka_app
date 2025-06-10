<script lang="ts">
  import * as colors from "../constants/colors";
  import Icon from "./Icon.svelte";

  export let number = "155";
  export let color = colors.circleColor;
  export let icon_src = "";
</script>

<div class="circle">
  <span class="circle-shape" style="--circle-color: {color}">
    <div class="called-number">{number}</div>
    {#if icon_src.length > 0}
      <img
        class="AlarmCircle-icon"
        src={icon_src}
        alt="icon"
        width="25px"
        height="25px"
      />
    {:else}
      <Icon i="phone" class="AlarmCircle-icon" dimensions="25px" />
    {/if}
  </span>
</div>

<style>
  .circle {
    grid-row: button_start / span 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle-shape {
    background: var(--circle-color);
    width: var(--circleDiameter);
    height: var(--circleDiameter);
    border-radius: 50%;
    display: grid;
    grid-template-rows: 50% 50%;
    justify-content: center;
  }

  .called-number {
    grid-row: 0 span 1;
    align-self: end;
    padding-right: 6px;
    font-size: x-large;
    font-weight: bold;
    font-style: italic;
    color: white;
  }

  :global(.AlarmCircle-icon) {
    grid-row: 1 span 1;
    justify-self: center;
    align-self: start;
    color: white;
  }
</style>
