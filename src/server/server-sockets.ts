import type socketio from 'socket.io';
import { names, NewConnectionHi, socketPort } from '../client/socket-constants';
import { Game } from './game';

const activeGames: {[gameId: string]: Game} = {};

function sendUsersList(game: Game) {
  const playersList = [];
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

  let hi: NewConnectionHi = null;

  socket.on(names.userId, (newHi: NewConnectionHi) => {
    hi = newHi;
    console.log('uid', hi.userId);

    let game: Game = activeGames[hi.gameId];
    if (!game) {
      game = new Game();
      activeGames[hi.gameId] = game;
    }
    const playa = game.players[hi.userId];
    if (!playa) {
      game.players[hi.userId] = {
        userId: hi.userId,
        userName: hi.userName,
        socket: socket,
      };
    }

    socket.on('disconnect', function() {
      console.log("disconnected, removing", hi.userId, hi.userName);
      delete game.players[hi.userId];
      sendUsersList(game);
    });

    sendUsersList(game);
  });

  socket.on(names.buttonPress, (msg) => {
    console.log('button pressed', msg);
    // io.emit('button pressed', msg);
  });

  socket.on(names.nameChange, (newName) => {
    console.log('name changed', newName);
    const game = activeGames[hi.gameId];
    let playa = game.players[hi.userId];
    if (playa) {
      playa.userName = newName;
    } else {
      console.log("ERROR invalid user");
    }
    // io.emit('button pressed', msg);
    // io.emit(names.usersList, players);
    sendUsersList(game);
  });
}
