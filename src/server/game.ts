
import { Discussion, parseTopics } from '../client/topics';
import type { Player } from '../client/socket-constants';

interface Vote {
  user: string;
  topicId: string;
  choice: 'a' | 'b';
}

const topics = parseTopics();

export class Game {
  players: {[uid: string]: Player} = {};
  topicsPlayed: string[] = [];
  scores: {[user: string]: number} = {};
  discussion: Discussion;
  activeVotes: Vote[];

  constructor() {

  }

  nextTopic() {
    const chosenI = randomInt(0, topics.length);
    this.discussion = topics[chosenI];
    this.activeVotes = [];
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


function randomInt(min, maxExcluded) {
  const delta = maxExcluded - min;
  return Math.floor(min + Math.random() * delta);
}
