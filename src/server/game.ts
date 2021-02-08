
import { parseTopics } from '../client/topics';
import type { Discussion, Player } from '../client/socket-constants';

interface Vote {
  user: string;
  topicId: string;
  choice: 'a' | 'b';
}

const topics = parseTopics();

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


export class ServerGameState {
  players: {[uid: string]: Player} = {};
  topicsPlayed: string[] = [];
  scores: {[user: string]: number} = {};
  discussion: Discussion;
  activeVotes: Vote[];
  speakerA: string;
  speakerB: string;

  constructor() {
    this.nextRound();
  }

  nextRound() {
    const chosenTopicI = randomInt(0, topics.length);
    this.discussion = topics[chosenTopicI];
    this.activeVotes = [];

    const playerIds = Object.keys(this.players);
    shuffle(playerIds);
    this.speakerA = playerIds[0];
    this.speakerB = playerIds[1];
  }

  vote(vote: Vote) {
    for (let i = 0; i < this.activeVotes.length; i++) {
      if (this.activeVotes[i].user === vote.user) {
        this.activeVotes[i] = vote;
        return;
      }
    }

    this.activeVotes.push(vote);
  }
}


function randomInt(min: number, maxExcluded: number) {
  const delta = maxExcluded - min;
  return Math.floor(min + Math.random() * delta);
}
