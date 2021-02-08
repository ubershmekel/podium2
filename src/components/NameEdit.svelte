<script lang="ts">
import { goto } from '@sapper/app';

import { saveName } from "../client/data";

import { sendMyNameIs } from "../client/sockets";
import { userName } from "../client/stores";

  // let userName: string;

  // $: if (userName) {
  //   console.log("username", userName);
  //   sendMyNameIs(userName);
  //   saveName(userName);
  // }
  function clickedSave() {
    sendMyNameIs($userName);
    saveName($userName);
    goto('play');
  }
</script>

<div>

<!-- svelte-ignore a11y-autofocus -->
<form>
  
  Name: <input bind:value={$userName} autofocus />
  <button on:click={clickedSave} type="submit">Save</button>
</form>
</div>

