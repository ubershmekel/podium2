import { get, writable } from 'svelte/store';
import { getName, getOrGenerateUserId } from './data';
import { NewConnectionHi, Discussion, names, PlayerNameId, NewRound } from './socket-constants';
import { onConnect, sendHi, on } from './sockets';

console.log("initializing stores");

interface ClientGameState {
  discussion: Discussion;
  speakerIds: string[];
  speakerNames: string[];
  users: PlayerNameId[],
}

const emptyState: ClientGameState = {
  discussion: {
    answerA: '',
    answerB: '',
    category: '',
    id: '',
    title: '',
  },
  speakerIds: ['', ''],
  speakerNames: ['', ''],
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

on(names.usersList, (userList: PlayerNameId[]) => {
  console.log("userslist", userList);
  const newState = get(clientGameState);
  newState.users = userList;
  clientGameState.set(newState)
  newState.speakerNames = newState.speakerIds.map(userIdToName);
  clientGameState.set(newState)
});

function userIdToName(userId: string): string {
  const state = get(clientGameState);
  for (const user of state.users) {
    if (user.userId === userId) {
      return user.userName;
    }
  }
  return '';
}

on(names.newRound, (round: NewRound) => {
  // discussion = newDiscussion;
  console.log("new round", round);
  const newState = get(clientGameState);
  newState.discussion = round.discussion;
  const speakerIds = [round.speakerA, round. speakerB];
  newState.speakerIds = speakerIds;
  newState.speakerNames = newState.speakerIds.map(userIdToName);
  clientGameState.set(newState)
});