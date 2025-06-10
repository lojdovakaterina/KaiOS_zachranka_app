<script lang="ts">
  export let action = () => {};
  export let text = "";
  export let inFocus = false;
</script>

<button
  class="za-button navigationPool"
  tabindex="-1"
  on:focus={() => {
    inFocus = true;
  }}
  on:blur={() => {
    inFocus = false;
  }}
  on:click={action}
>
  <div class="za-button_contents">
    <span class="p_pri">{text}</span>
  </div>
</button>

<style>
  .za-button {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
  }
  .za-button_contents {
    padding: 0.5rem 1.75rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background-color: var(--themeColorLight);
    border: 2px solid var(--textColor);
  }

  .za-button span {
    color: var(--textColor);
    text-transform: uppercase;
    font-size: medium;
  }

  .za-button:focus .za-button_contents {
    border: none;
    background-color: var(--textColor);
  }
  .za-button:focus span {
    color: var(--themeColorLight);
  }
</style>
