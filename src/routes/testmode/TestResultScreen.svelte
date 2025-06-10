<script lang="ts">
  import { keyManager } from "../../utils/keyManager";
  import { goBack } from "../../constants/keyOptions";
  import * as colors from "../../constants/colors";

  import Layout from "../../components/layouts/Layout.svelte";
  import ScrollContainer from "../../components/ScrollContainer.svelte";

  const color = colors.testColor;

  keyManager.set({
    center: goBack("pokračovat"),
  });
</script>

<Layout navbar={false} headerText="test proběhl úspěšně" {color}>
  <div class="container">
    <h2 class="headline">Test byl úspěšný!</h2>
    <ScrollContainer>
      Nouzová zpráva byla v pořádku vygenerována. V případě reálné situace by
      nyní došlo k vytočení tísňové linky.
    </ScrollContainer>
  </div>
</Layout>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: var(--themeColorLight);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
  }

  .headline {
    text-align: center;
    color: var(--textColor);
    margin: 0 0 1rem 0;
  }
</style>
