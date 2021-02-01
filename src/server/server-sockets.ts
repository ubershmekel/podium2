import type socketio from 'socket.io';
import { names, NewConnectionHi, Player, PlayerNameId, socketPort } from '../client/socket-constants';
import { ServerGameState } from './game';

const activeGames: {[gameId: string]: ServerGameState | undefined} = {};

function sendUsersList(game: ServerGameState) {
  const playersList: PlayerNameId[] = [];
  for(const key in game.players) {
    const player = game.players[key];
    playersList.push({
      userId: player.userId,
      userName: player.userName,
    });
  }
  for(const key in game.players) {
    game.players[key].socket.emit(names.usersList, playersList);
  }
}

export function onConnect(socket: socketio.Socket) {
  console.log('a user connected');

  let player: Player | null = null;
  let gameId: string | null = null;

  socket.on(names.userId, (hi: NewConnectionHi) => {
    console.log(`uid: ${hi.userId} gameid: ${hi.gameId}`);

    let existingGame = activeGames[hi.gameId];
    let game: ServerGameState;
    if (existingGame) {
      game = existingGame;
    } else {
      game = new ServerGameState();
      activeGames[hi.gameId] = game;
    }
    const existingPlayer = game.players[hi.userId];
    if (!existingPlayer) {
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

    sendUsersList(game);
  });

  socket.on(names.buttonPress, (msg) => {
    console.log('button pressed', player ? player.userName : '-?-', msg);
    // io.emit('button pressed', msg);
  });

  socket.on(names.nameChange, (newName) => {
    console.log('name changed', newName);
    if (player) {
      player.userName = newName;
    } else {
      console.log("ERROR invalid user");
    }
    // io.emit('button pressed', msg);
    // io.emit(names.usersList, players);
    if (!gameId) {
      console.log("gameId not found for name change");
      return;
    }

    const game = activeGames[gameId];
    if (!game) {
      console.log("game not found for name change");
      return
    }

    sendUsersList(game);
  });
}
