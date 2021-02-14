import type { Server } from 'http';
import type socketio from 'socket.io';
import { names, NewConnectionHi, NewRound, Player, PlayerNameId, socketPort } from '../client/socket-constants';
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

function sendRoundData(game: ServerGameState) {
  sendToGamePlayers(game, names.newRound, roundData(game));
}

function roundData(game: ServerGameState): NewRound {
  return {
    discussion: game.discussion,
    speakerA: game.speakerA,
    speakerB: game.speakerB,
  };
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
      socket.emit(names.newRound, roundData(game));
    } else {
      console.log("creating game");
      game = new ServerGameState();
      activeGames[gameId] = game;
      sendRoundData(game);
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
      if (msg === names.nextTopic) {
        game.nextRound();
        sendRoundData(game);
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
