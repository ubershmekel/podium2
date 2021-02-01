// These are constants that are shared between the client and server

export const socketPort = 2999;

export const names = {
  nameChange: "nameChange",
  buttonPress: "buttonPress",
  userId: "userId",
  usersList: "usersList",
  discussionChange: "discussionChange",
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
