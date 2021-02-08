<script lang="ts">
  import {
    sendButtonPressed,
    on,
    onConnect,
    sendHi,
  } from "../client/sockets";
  import { names } from "../client/socket-constants";
  import type { PlayerNameId, Discussion, NewRound } from "../client/socket-constants";
  import { userName } from "../client/stores";

  let discussion: Discussion = {
    answerA: '',
    answerB: '',
    category: '',
    id: '',
    title: '',
  };

  let users: PlayerNameId[] = [];
  let speakerA: string;
  let speakerB: string;


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

  function userIdToName(userId: string) {
    for (const user of users) {
      if (user.userId === userId) {
        return user.userName;
      }
    }
  }

  function main() {
    // handleNextTopic();

    on(names.usersList, (userList: PlayerNameId[]) => {
      console.log("userslist", userList);
      users = userList;
    });

    on(names.newRound, (round: NewRound) => {
      // discussion = newDiscussion;
      console.log("new round", round);
      discussion = round.discussion;
      speakerA = userIdToName(round.speakerA);
      speakerB = userIdToName(round.speakerB);
    });


  }

  main();
</script>

<div class="game">

  <div class="title">{discussion.title}</div>

  <button class="answer answer-text" on:click={(event) => handleAnswer(0)}
    >{discussion.answerA} [{speakerB}]</button
  >

  <button class="answer answer-text" on:click={(event) => handleAnswer(1)}
    >{discussion.answerB} [{speakerA}]</button
  >

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
    /* box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2); */
    margin: 0.5em 0.5em 0.5em 1em;
    padding: 0.5em;
    transition: all 100ms;
    cursor: pointer;
  }

  .answer:hover {
    box-shadow: 0 0 6px rgb(35 173 255);
  }

  .admin {
    margin-top: 8em;
  }
</style>
