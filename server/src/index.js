import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { Chess } from 'chess.js';
import * as dotenv from 'dotenv';

dotenv.config();

import { initializeSocket } from './socket.js';
import { startStockfish, startStockfishComputer } from './stockfish.js';

import { initializeApp } from 'firebase/app';
import { getDatabase, onChildAdded, onValue, ref } from 'firebase/database';
import { initializeDB } from './firebase.js';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyCupgmt57tzvco2d-yMpPIrmTzee20fC6o',
  authDomain: 'iot-project-led-chessboard.firebaseapp.com',
  databaseURL: 'https://iot-project-led-chessboard-default-rtdb.firebaseio.com',
  projectId: 'iot-project-led-chessboard',
  storageBucket: 'iot-project-led-chessboard.appspot.com',
  messagingSenderId: '605922107744',
  appId: '1:605922107744:web:fbae38a1c93fc233c0fe05',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const database = getDatabase();

// initialize database
initializeDB();

export const game = new Chess();
export let rooms = [];

export const STOCKFISH_DEPTH = 15;
export const engine = startStockfish();
export const computerEngine = startStockfishComputer();

const PORT = process.env.PORT || 8000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// express setup
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// socket setup
initializeSocket(io);

// start server
server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
