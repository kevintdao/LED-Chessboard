import { database } from './index.js';
import { ref, set } from 'firebase/database';

export function initializeDB(type) {
  set(ref(database, '/'), {
    users: {
      white: null,
      black: null,
    },
    moves: {},
    fen: {},
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
