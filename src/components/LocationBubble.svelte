<script lang="ts">
  import { currentPosition, type DMSPosition } from "../data/Position";

  let refresh = currentPosition.refresh;
  let showPosition = false;
  let DMS_latitude: DMSPosition | null = null;
  let DMS_longitude: DMSPosition | null = null;

  $: {
    if ($refresh) {
      showPosition = true;
      let coordsToDisplay = currentPosition.toDMS();
      DMS_latitude = coordsToDisplay?.latitude ?? null;
      DMS_longitude = coordsToDisplay?.longitude ?? null;
    }
  }
</script>

<div class="location">
  <div class="location-bubble">
    {#if !$refresh}
      <span>Načítám polohu...</span>
    {:else if DMS_latitude !== null && DMS_longitude !== null}
      <span
        >{DMS_latitude.d}° {DMS_latitude.m}' {DMS_latitude.s}" {DMS_latitude.positive
          ? "N"
          : "S"}, {DMS_longitude.d}° {DMS_longitude.m}' {DMS_longitude.s}" {DMS_longitude.positive
          ? "E"
          : "W"}</span
      >
    {/if}
  </div>
</div>

<style>
  .location {
    padding: 0.5rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .location-bubble {
    background-color: var(--highlight);
    color: var(--textColor);
    padding: 0 1rem;
    border-radius: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: small;
  }
</style>
