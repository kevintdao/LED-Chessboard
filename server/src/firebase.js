import { database } from './index.js';
import { ref, set } from 'firebase/database';

export function initializeDB() {
  set(ref(database, '/'), {
    users: {
      white: null,
      black: null,
    },
    moves: {},
    fen: {},
    turn: 'white',
    type: 'computer',
  });
}
