<script lang="ts">
  import {
    sendButtonPressed,
    sendMyNameIs,
    on,
    onConnect,
    sendHi,
  } from "../client/sockets";
  import { getName, getOrGenerateUserId, saveName } from "../client/data";
  import { names } from "../client/socket-constants";
  import type { NewConnectionHi, PlayerNameId } from "../client/socket-constants";
import type { Discussion } from "../client/topics";

  let userName: string;

  let discussion: Discussion = {
    answerA: '',
    answerB: '',
    category: '',
    id: '',
    title: '',
  };
  let answerA: string;
  let answerB: string;

  let users: PlayerNameId[] = [];
  let speakerA: string;
  let speakerB: string;

  $: if (userName) {
    console.log("username", userName);
    sendMyNameIs(userName);
    saveName(userName);
  }

  function randomInt(min: number, maxExcluded: number) {
    const delta = maxExcluded - min;
    return Math.floor(min + Math.random() * delta);
  }

  function handleNextTopic() {
    sendButtonPressed("next topic");
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
    sendButtonPressed("answer-" + option);
  }

  function handleEndRound() {
    sendButtonPressed("end round");
  }

  function main() {
    // handleNextTopic();

    on(names.usersList, (userList: PlayerNameId[]) => {
      console.log("userslist", userList);
      users = userList;
    });

    on(names.discussionChange, (newDiscussion: Discussion) => {
      discussion = newDiscussion;
    });

    onConnect(() => {
      const gameId = "onegame-temp-id";
      if (!userName) {
        userName = getName();
      }
      console.log("connected");
      const newConnectionHi: NewConnectionHi = {
        userId: getOrGenerateUserId(),
        gameId,
        userName,
      };
      sendHi(newConnectionHi);
    });
  }

  main();
</script>

<div class="game">
  <h1>Closing Arguments</h1>
  <input bind:value={userName} />

  <div class="title">{discussion.title}</div>

  <button class="answer answer-text" on:click={(event) => handleAnswer(0)}
    >{discussion.answerA}</button
  >

  <button class="answer answer-text" on:click={(event) => handleAnswer(1)}
    >{discussion.answerB}</button
  >

  <p class="speaker">a {speakerA}</p>
  vs
  <p class="speaker">b {speakerB}</p>

  <div class="admin">
    <button on:click={handleEndRound}>End Round</button>
    <button on:click={handleNextTopic}>Next Topic</button>
  </div>

  <p>
    users:
    {#each users as user}
      {user.userName};
    {/each}
  </p>
</div>

<style>
  .game {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #333;
    text-transform: uppercase;
    font-size: 1.5em;
    font-weight: 100;
  }

  .title {
    font-size: 4em;
  }

  @media (min-width: 640px) {
    .game {
      max-width: none;
    }
  }

  .answer {
    /* border-bottom: 2px solid #666; */
    display: inline-block;
    width: 25%;
    /* box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2); */
    margin: 0.5em 0.5em 0.5em 1em;
    padding: 0.5em;
    transition: all 100ms;
    cursor: pointer;
  }

  .answer:hover {
    box-shadow: 0 0 6px rgb(35 173 255);
  }
</style>
