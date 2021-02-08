import { get, writable } from 'svelte/store';
import { getName, getOrGenerateUserId } from './data';
import type { NewConnectionHi, Discussion } from './socket-constants';
import { onConnect, sendHi } from './sockets';

console.log("initializing stores");

interface ClientGameState {
  discussion: Discussion;
  speakerA: string;
  speakerB: string;
  users: string[],
}

const emptyState: ClientGameState = {
  discussion: {
    answerA: '',
    answerB: '',
    category: '',
    id: '',
    title: '',
  },
  speakerA: '',
  speakerB: '',
  users: [],
}

export const clientGameState = writable(emptyState);
export const userName = writable('');

onConnect(() => {
  const gameId = "onegame-temp-id";
  console.log("socket connected");
  if (!get(userName)) {
    userName.set(getName());
  }

  const newConnectionHi: NewConnectionHi = {
    userId: getOrGenerateUserId(),
    gameId,
    userName: get(userName),
  };
  sendHi(newConnectionHi);
});

