<script lang="ts">
  import {
    sendButtonPressed,
    on,
    onConnect,
    sendHi,
    sendVote,
  } from "../client/sockets";
  import { names } from "../client/socket-constants";
  import type {
    PlayerNameId,
    Discussion,
    NewRound,
  } from "../client/socket-constants";
  import { userName, clientGameState } from "../client/stores";
import { identity } from "svelte/internal";

  let discussion: Discussion = {
    answerA: "",
    answerB: "",
    category: "",
    id: "",
    title: "",
  };

  let users: PlayerNameId[] = [];
  let speakerA: string;
  let speakerB: string;

  function randomInt(min: number, maxExcluded: number) {
    const delta = maxExcluded - min;
    return Math.floor(min + Math.random() * delta);
  }

  function handleNextTopic() {
    sendButtonPressed(names.nextTopic);
    console.log("happening");
    // const chosenI = randomInt(0, topics.length);
    // const chosen = topics[chosenI];
    // title = chosen.title;
    // answerA = chosen.answerA;
    // answerB = chosen.answerB;

    // speakerA = users[0];
    // speakerB = users[1];
  }

  function handleAnswer(option: number) {
    sendVote(option);
  }

  function handleEndRound() {
    sendButtonPressed("end round");
  }
</script>

<div class="game">
  <div class="title">{$clientGameState.discussion.title}</div>

  {#each $clientGameState.answerStates as answer, index}
  <div class="answer">
    <div class="answer-text">
      {answer.text}
    </div>

    <div class="speaker">
      Speaker: {answer.speakerName}
    </div>

    <button class="answer-button" on:click={(event) => handleAnswer(index)}
      >vote</button
    
    ><div class="votes">
    {#each answer.voterNames as voterName}
      <span class="voted">{voterName}</span>
    {/each}
    </div>
  </div>
  {/each}

  <!-- {JSON.stringify($clientGameState.votes)} -->

  <div class="admin">
    <button on:click={handleEndRound}>End Round</button>
    <button on:click={handleNextTopic}>Next Topic</button>
  </div>

  <p>
    users:
    {#each $clientGameState.users as user}
      {user.userName};
    {/each}
  </p>

  <p>You are: {$userName}</p>
</div>

<style>
  .game {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .title {
    font-size: 4em;
  }

  @media (min-width: 640px) {
    .game {
      max-width: none;
    }
  }

  @media (max-width: 640px) {
    .game {
      max-width: none;
    }
    .title {
      font-size: 2.5em;
    }
  }

  .answer {
    /* border-bottom: 2px solid #666; */
    display: inline-block;
    border: 1px solid rgba(0,0,0,.1);
    box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
    border-radius: .25rem;
    margin: 0.5em 0.5em 0.5em 1em;
    padding: 0.5em;
    transition: all 100ms;
    min-height: 3em;
    vertical-align: top;
  }

  .answer-text {
    background-color: #ccf;
    padding: 0.2em;
    font-size: 1.1em;
  }

  .answer-button:hover {
    cursor: pointer;
    box-shadow: 0 0 6px rgb(35 173 255);
  }

  .admin {
    margin-top: 8em;
  }

  .voted:hover {
    background-color: #9f9;
  }

  .voted {
    display: inline-block;
    margin: 0.2em;
    padding: 0.1em;
    border: 0.1rem outset pink;
    outline: 0.1rem solid khaki;
    box-shadow: 0 0 0 0.2rem skyblue;
    box-sizing: border-box;
  }
</style>
