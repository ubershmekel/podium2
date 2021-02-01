import type socketio from 'socket.io';
import { names, NewConnectionHi, Player, PlayerNameId, socketPort } from '../client/socket-constants';
import { ServerGameState } from './game';

const activeGames: {[gameId: string]: ServerGameState | undefined} = {};

function sendToGamePlayers(game: ServerGameState, eventName: string, data: any) {
  for(const uid in game.players) {
    game.players[uid].socket.emit(eventName, data);
  }
}

function sendUsersList(game: ServerGameState) {
  const playersList: PlayerNameId[] = [];
  for(const key in game.players) {
    const player = game.players[key];
    playersList.push({
      userId: player.userId,
      userName: player.userName,
    });
  }
  return sendToGamePlayers(game, names.usersList, playersList);
}

export function onConnect(socket: socketio.Socket) {
  console.log('a user connected');

  socket.on(names.userId, (hi: NewConnectionHi) => {
    let player: Player;
    let gameId: string = hi.gameId;
    console.log(`uid: ${hi.userId} gameid: ${hi.gameId}`);
    let existingGame = activeGames[gameId];
    let game: ServerGameState;
    if (existingGame) {
      game = existingGame;
      socket.emit(names.discussionChange, game.discussion);
    } else {
      game = new ServerGameState();
      activeGames[gameId] = game;
      sendToGamePlayers(game, names.discussionChange, game.discussion);
    }
    
    const existingPlayer = game.players[hi.userId];
    if (existingPlayer) {
      player = existingPlayer;
    } else {
      player = {
        userId: hi.userId,
        userName: hi.userName,
        socket: socket,
      };
      game.players[hi.userId] = player;
    }

    socket.on('disconnect', function() {
      console.log("disconnected, removing", hi.userId, hi.userName);
      delete game.players[hi.userId];
      sendUsersList(game);
    });

    socket.on(names.buttonPress, (msg: string) => {
      console.log('button pressed', player ? player.userName : '-?-', msg);
      if (msg === 'next topic') {
        game.nextTopic();
        sendToGamePlayers(game, names.discussionChange, game.discussion);
      }
      // io.emit('button pressed', msg);
    });

    socket.on(names.nameChange, (newName: string) => {
      console.log('name changed', newName);
      if (player) {
        player.userName = newName;
      } else {
        console.log("ERROR invalid user");
      }
      // io.emit('button pressed', msg);
      // io.emit(names.usersList, players);
      if (!gameId) {
        console.log("gameId not found for name change: ", gameId);
        return;
      }
  
      const game = activeGames[gameId];
      if (!game) {
        console.log("game not found for name change");
        return
      }
  
      sendUsersList(game);
    });

    sendUsersList(game);
  });



}
