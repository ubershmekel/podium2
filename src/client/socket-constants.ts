// These are constants that are shared between the client and server

export const socketPort = 2999;

export const names = {
  nameChange: "nameChange",
  buttonPress: "buttonPress",
  userId: "userId",
  usersList: "usersList",
  newRound: "newRound",
  nextTopic: "nextTopic",
  vote: "vote",
  newVotes: "newVotes",
}

export interface PlayerNameId {
  userId: string;
  userName: string;
}

export interface Player { 
  userId: string;
  userName: string;
  socket: any;
}

export interface NewConnectionHi {
  userId: string;
  userName: string;
  gameId: string;
}

export interface GameState {
  users: string[];
  speakerA: string;
  speakerB: string;
}

export interface Discussion {
  id: string;
  title: string;
  answerA: string;
  answerB: string;
  category: string;
}

export interface NewRound {
  discussion: Discussion;
  speakerA: string;
  speakerB: string;
  votes: UserIdToVote;
  // endTime: Date;
}

export interface AnswerState {
  text: string;
  speakerName: string;
  voterNames: string[];
}

export type UserIdToVote = {[uid: string]: number};
