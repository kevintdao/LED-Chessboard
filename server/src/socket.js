import { Chess } from 'chess.js';
import { rooms } from './index.js';
import { getStockfishMove } from './stockfish.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    const { roomId, id, user, piece } = socket.handshake.query;

    // check if room exists
    const room = rooms.find((room) => room.id === roomId);
    if (!room) {
      // create room
      rooms.push({
        id: roomId,
        users: [
          {
            id: user,
            piece: piece ?? 'white',
          },
        ],
        game: new Chess(),
        type: 'computer',
      });
    }

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
      game.move(data);

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

async function computerMove(io, room, roomId) {
  const { game } = room;

  // get best move
  const { bestMove, CP } = await getStockfishMove(game.fen(), 15);
  const [from, to] = bestMove?.match(/\w\d/g);

  // move piece
  game.move({ from, to });

  // update board
  io.in(roomId).emit('updateBoardComputer', { from, to, CP });
}

async function computeCP(io, room, roomId) {
  const { game } = room;

  const { CP } = await getStockfishMove(game.fen(), 15);
  io.in(roomId).emit('updateCP', CP);
}
