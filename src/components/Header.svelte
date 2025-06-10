<script lang="ts">
  import * as colors from "../constants/colors";

  export let text = "záchranka";
  export let color = colors.themeColor;
</script>

<div class="header-container" style="--header-color: {color}">
  <h1 class="header-content">
    {text}
  </h1>
</div>

<style>
  .header-container {
    grid-row: header;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 4px;
    width: 100%;
    height: 28px;
    background-color: var(--header-color);
  }

  .header-content {
    color: white;
    text-transform: capitalize;
  }
</style>
