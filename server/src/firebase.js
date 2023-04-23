import { Chess } from 'chess.js';
import { database } from './index.js';
import { ref, set } from 'firebase/database';

export function initializeDB(type) {
  const game = new Chess();
  set(ref(database, '/'), {
    users: {
      white: null,
      black: null,
    },
    moves: {},
    fen: game.fen(),
    turn: 'w',
    type: type ?? 'computer',
    boardPiece: 'w',
    hint: {
      from: '',
      to: '',
    },
    showHint: false,
  });
}
