import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { Chess } from 'chess.js';
import * as dotenv from 'dotenv';

dotenv.config();

import { initializeSocket } from './socket.js';
import { startStockfish } from './stockfish.js';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeDB } from './firebase.js';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
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
