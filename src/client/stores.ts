import { get, writable } from 'svelte/store';
import { getName, getOrGenerateUserId } from './data';
import { NewConnectionHi, Discussion, names, PlayerNameId, NewRound, UserIdToVote } from './socket-constants';
import type { AnswerState } from './socket-constants';
import { onConnect, sendHi, on } from './sockets';

console.log("initializing stores");

interface ClientGameState {
  discussion: Discussion;
  speakerIds: string[];
  speakerNames: string[];
  users: PlayerNameId[],
  votes: UserIdToVote,
  answerStates: AnswerState[],
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
  votes: {},
  answerStates: [],
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
  updateAnswerStates(newState);
  clientGameState.set(newState);
  console.log("userslist-", newState.speakerNames, newState.answerStates);
});


on(names.newVotes, (newVotes: UserIdToVote) => {
  console.log("newVotes", newVotes);
  const newState = get(clientGameState);
  newState.votes = newVotes;
  updateAnswerStates(newState);
  clientGameState.set(newState);
});


function userIdToName(state: ClientGameState, userId: string): string {
  for (const user of state.users) {
    if (user.userId === userId) {
      return user.userName;
    }
  }
  return '';
}

function updateAnswerStates(state: ClientGameState) {
  // update speakerNames, because I'm not sure where else to make
  // sure this happens.
  state.speakerNames = state.speakerIds.map((uid) => userIdToName(state, uid));

  const voterNames: string[][] = [[], []];
  for (const uid of Object.keys(state.votes)) {
    const vote = state.votes[uid];
    const name = userIdToName(state, uid);
    voterNames[vote].push(name);
    console.log("updateAnswerStates", voterNames);
  }
  const answerStateA: AnswerState = {
    text: state.discussion.answerA,
    speakerName: state.speakerNames[0],
    voterNames: voterNames[0],
  };
  const answerStateB: AnswerState = {
    text: state.discussion.answerB,
    speakerName: state.speakerNames[1],
    voterNames: voterNames[1],
  };

  state.answerStates = [answerStateA, answerStateB];
}

on(names.newRound, (round: NewRound) => {
  // discussion = newDiscussion;
  console.log("new round", round);
  const newState = get(clientGameState);
  newState.discussion = round.discussion;
  newState.votes = round.votes;
  const speakerIds = [round.speakerA, round.speakerB];
  newState.speakerIds = speakerIds;
  // newState.speakerNames = newState.speakerIds.map(userIdToName);
  // newState.answerStates.push({
    //   speaker: userIdToName(speakerIds[0]),
    //   text: round.discussion.answerA,
    //   voterNames: [],
    // })
  updateAnswerStates(newState);
  clientGameState.set(newState)
});