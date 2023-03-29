import stockfish from 'stockfish';
import { engine, STOCKFISH_DEPTH } from './index.js';

let bestMove;
let CP;
let mate;
let finished = false;

// start stockfish engine
export function startStockfish() {
  const engine = stockfish();
  engine.onmessage = (message) => onMessageListener(message);

  return engine;
}

// check if stockfish has finished analysis
export function finishAnalysis(message) {
  console.log(message);
  return (
    message.startsWith(`info depth ${STOCKFISH_DEPTH}`) &&
    (message.includes(' cp ') || message.includes(' mate '))
  );
}

// get best move from stockfish message
export function onMessageListener(message) {
  if (finishAnalysis(message)) {
    console.log(message, '\n');

    finished = true;
    const re = /cp [-\d]+|mate [\d]+|(?<!\w)pv [\w\d]+/g;
    const stockfishMessage = message.match(re);

    if (stockfishMessage) {
      const [type, score] = stockfishMessage[0].split(' ');

      if (type === 'mate') {
        mate = parseInt(score, 10);
      }

      if (type === 'cp') {
        CP = parseInt(score, 10) / 100;
      }

      bestMove = stockfishMessage[1].split(' ')[1];
    }
  }
  return;
}

// get stockfish move
export async function getStockfishMove(fen, depth) {
  finished = false;
  mate = undefined;
  engine.postMessage(`position fen ${fen}`);
  engine.postMessage(`go depth ${depth}`);

  while (!finished) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return new Promise((resolve) => {
    resolve({
      bestMove,
      CP,
      mate,
    });
  });
}

// compute centipawn score
export function computeCP(whiteCP, blackCP) {
  return whiteCP + blackCP;
}
