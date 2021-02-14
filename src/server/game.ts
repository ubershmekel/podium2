
import { getTopics } from '../client/topics';
import type { Discussion, Player, UserIdToVote } from '../client/socket-constants';
import { userName } from '../client/stores';

interface Vote {
  user: string;
  topicId: string;
  choice: 'a' | 'b';
}

const topics = getTopics();

function shuffle(array: any[]) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const numOfSpeakers = 2;

export class ServerGameState {
  players: {[uid: string]: Player} = {};
  topicsPlayed: {[topicId: string]: boolean} = {};
  scores: {[user: string]: number} = {};
  discussion: Discussion;
  activeVotes: UserIdToVote;
  speakerA: string;
  speakerB: string;

  constructor() {
    this.nextRound();
  }

  nextRound() {
    const chosenTopicI = randomInt(0, topics.length);
    let found = false;
    // Cycle through topics from a random index until you find
    // one that was not played yet.
    for (let i = 0; i < topics.length; i++) {
      let discussion = topics[(chosenTopicI + i) % topics.length];
      const topicId = discussion.id;
      if (!this.topicsPlayed[topicId]) {
        found = true;
        this.discussion = discussion;
        this.topicsPlayed[topicId] = true;
        break;
      }
    }
    if (!found) {
      // Cycled through it all, let's start over
      console.log("Completed a game cycle on all topics!");
      this.discussion = topics[chosenTopicI];
      this.topicsPlayed = {};
    }
    this.activeVotes = {};

    const playerIds = Object.keys(this.players);
    if (playerIds.length < numOfSpeakers) {
      console.warn("next round on a game with not enough speakers!");
    }

    shuffle(playerIds);
    this.speakerA = playerIds[0];
    this.speakerB = playerIds[1];
    // console.log("next round state", this);
  }

  vote(userId: string, index: number) {
    this.activeVotes[userId] = index;
  }
}


function randomInt(min: number, maxExcluded: number) {
  const delta = maxExcluded - min;
  return Math.floor(min + Math.random() * delta);
}
