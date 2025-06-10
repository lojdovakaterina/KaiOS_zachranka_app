<script lang="ts">
  import { keyManager } from "../utils/keyManager";
  import * as colors from "../constants/colors";

  export let color = colors.themeColor;

  let left = keyManager.left;
  let right = keyManager.right;
  let center = keyManager.center;
</script>

<div class="sk-container" style="--keys-color: {color}">
  <h5 class="sk-left">{$left.text}</h5>
  <h5 class="sk-center">{$center.text}</h5>
  <h5 class="sk-right">{$right.text}</h5>
</div>

<style>
  .sk-container {
    display: grid;
    grid-template-columns: [left]1fr [center]1fr [right]1fr;
    align-items: center;
    padding: 0 0.5em;
    grid-row: swkeys;
    height: 28px;
    background-color: var(--keys-color);
    color: white;
  }

  .sk-left {
    grid-column: left;
    justify-self: left;
    text-transform: capitalize;
  }

  .sk-center {
    grid-column: center;
    justify-self: center;
    text-transform: uppercase;
  }

  .sk-right {
    grid-column: right;
    justify-self: right;
    text-transform: capitalize;
  }
</style>
