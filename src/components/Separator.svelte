<script lang="ts">
  export let text: string = "";
</script>

<div class="container">
  <h4 class="text">{text}</h4>
</div>

<style>
  .container {
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: start;
    align-items: center;
    background-color: var(--highlight);
    padding: 0.5rem 0.5rem;
  }

  .text {
    color: var(--textColor);
  }
</style>
