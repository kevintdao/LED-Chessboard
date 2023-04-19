import { Chess } from 'chess.js';
import { Server, Socket } from 'socket.io';
import { onChildAdded, push, ref, update } from 'firebase/database';
import { rooms } from './index.js';
import { getStockfishMove } from './stockfish.js';
import { database } from './index.js';
import { initializeDB } from './firebase.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    const { roomId, id, user, piece, type } = socket.handshake.query;

    // check if room exists
    const room = rooms.find((room) => room.id === roomId);

    // join or create room
    joinOrCreateRoom(io, socket, room, roomId, user, type, piece);

    socket.join(roomId);

    // check if type is computer and player is black
    if (room && room.type === 'computer' && piece === 'black') {
      computerMove(io, room, roomId);
    }

    console.log('a user connected');

    // disconnect socket event
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // get hint socket event
    socket.on('getHint', async (data) => {
      const { bestMove } = await getStockfishMove(data.fen, 15);
      const [from, to] = bestMove?.match(/\w\d/g);

      socket.emit('updateHint', { from, to });
    });

    // move socket event
    socket.on('move', async (data) => {
      // find room
      const room = rooms.find((room) => room.id === roomId);
      const { game } = room;

      // move piece
      // game.move(data);

      // update firebase
      push(ref(database, `moves`), { from: data.from, to: data.to });
      push(ref(database, 'fen'), { fen: game.fen() });
      update(ref(database, '/'), { turn: game.turn() });

      computeCP(io, room, roomId);

      // check if type is computer
      if (room.type === 'computer') {
        // wait 1 second before computer move
        setTimeout(() => {
          computerMove(io, room, roomId);
        }, 1000);
      }

      // check if type is multiplayer
      if (room.type === 'multiplayer') {
        socket.broadcast.emit('updateBoard', data);
      }
    });
  });
};

/**
 *
 * @param {Socket} socket
 * @param {*} room
 * @param {string} roomId
 * @param {string} user
 * @param {string} type
 * @param {string} piece
 */
function joinOrCreateRoom(io, socket, room, roomId, user, type, piece) {
  let playerPiece = piece;

  if (!room) {
    const game = new Chess();

    // create room
    rooms.push({
      id: roomId,
      users: [
        {
          id: user,
          piece: piece ?? 'white',
        },
      ],
      game,
      turn: game.turn(),
      type: type ?? 'computer',
    });

    // intialize firebase when new room is created
    initializeDB(type);

    // firebase "moves" listener
    const moveRef = ref(database, 'moves');
    onChildAdded(moveRef, (snapshot) => {
      const room = rooms.find((room) => room.id === roomId);
      const { game } = room;
      const move = snapshot.val();

      // move piece from firebase
      try {
        game.move(snapshot.val());
      } catch (err) {
        console.log(err);
      }

      computeCP(io, room, roomId);

      // update board
      if (room.type === 'multiplayer') {
        socket.broadcast.emit('updateBoard', move);
      }
    });
  } else {
    // get the player piece
    const existPlayerPiece = room.users[0].piece;
    playerPiece = existPlayerPiece === 'white' ? 'black' : 'white';

    // add player to room
    room.users.push({
      id: user,
      piece: playerPiece,
    });
  }

  // add user to firebase
  update(ref(database, `users/${playerPiece}`), {
    user,
  });

  socket.emit('updatePiece', playerPiece);
}

/**
 * Computer move
 * @param {Server} io
 * @param {*} room
 * @param {number} roomId
 */
async function computerMove(io, room, roomId) {
  const { game } = room;

  // get best move
  const { bestMove, CP } = await getStockfishMove(game.fen(), 15);
  const [from, to] = bestMove?.match(/\w\d/g);

  // move piece
  // game.move({ from, to });

  // update firebase
  push(ref(database, `moves`), { from, to });
  push(ref(database, 'fen'), { fen: game.fen() });
  update(ref(database, '/'), { turn: game.turn() });

  // update board
  io.in(roomId).emit('updateBoardComputer', { from, to, CP });
}

/**
 * Compute CP
 * @param {Server} io
 * @param {*} room
 * @param {number} roomId
 */
async function computeCP(io, room, roomId) {
  const { game } = room;

  const { CP, mate } = await getStockfishMove(game.fen(), 15);
  io.in(roomId).emit('updateCP', CP || mate);
}
