import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { Chess } from 'chess.js';

import { initializeSocket } from './socket.js';
import { startStockfish } from './stockfish.js';

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
