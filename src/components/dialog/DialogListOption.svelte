<script lang="ts">
  import { pushScreen } from "../../utils/routing/router";

  export let desc;
  export let destination;
  export let data = {};
</script>

<button
  class="li-container dialogNavigationPool"
  tabindex="-1"
  on:click={() => {
    pushScreen(destination, data);
  }}
>
  <p>{desc}</p>
</button>

<style>
  .li-container {
    width: 100%;
    background: none;
    border: none;
    border-radius: 0;
    color: var(--textColor);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem 0.5rem;
    max-height: 100%;
  }

  .li-container p {
    width: 100%;
    text-align: start;
  }

  .li-container:focus {
    color: white;
    background-color: var(--textColor);
  }
</style>
