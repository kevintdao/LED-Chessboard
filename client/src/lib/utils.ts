import type { Chess, Square } from 'chess.js';
import { MOVE_COLOR } from '../constant';

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function CPClassName(bot: string, CP: number) {
  if (bot === 'white' && CP < 0) return 'bottom-0 text-black';
  if (bot === 'white' && CP > 0) return 'top-0 text-white';
  if (bot === 'black' && CP > 0) return 'bottom-0 text-white';
  if (bot === 'black' && CP < 0) return 'top-0 text-black';

  return '';
}

export function gameOverClassName(
  bot: string,
  draw?: boolean,
  winner?: string
) {
  if (draw) return 'top-[48%] text-black';

  if (winner) {
    if (bot === 'white' && winner === 'white') return 'bottom-0 text-black';
    if (bot === 'white' && winner === 'black') return 'top-0 text-white';
    if (bot === 'black' && winner === 'black') return 'bottom-0 text-white';
    if (bot === 'black' && winner === 'white') return 'top-0 text-black';
  }
  return '';
}

export function evalBarClassName(
  percent: number,
  bot: string,
  mate?: number,
  winner?: string
): number {
  if (winner) {
    if (bot === 'white' && winner === 'white') return 0;
    if (bot === 'white' && winner === 'black') return 100;
    if (bot === 'black' && winner === 'black') return 0;
    if (bot === 'black' && winner === 'white') return 100;
  }

  if (mate) {
    if (bot === 'white' && mate < 0) return 0;
    if (bot === 'white' && mate > 0) return 100;
    if (bot === 'black' && mate > 0) return 0;
    if (bot === 'black' && mate < 0) return 100;
  }

  if (bot === 'black') return percent;
  else return 100 - percent;
}

export function showAvailableMoves(game: Chess, square: Square) {
  const moves = game.moves({
    square,
    verbose: true,
  });

  // no move on square
  if (moves.length === 0) return;

  const newSquares: OptionSquare = {};
  moves.map((move) => {
    newSquares[move.to] = {
      background:
        game.get(move.to) && game.get(move.to).color !== game.get(square).color
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      borderRadius: '50%',
    };
    return move;
  });
  newSquares[square] = {
    background: MOVE_COLOR,
  };

  return newSquares;
}

export function gameOverType(
  game: Chess,
  resign: string | undefined
): GameOver | undefined {
  // win
  if (game.isCheckmate())
    return {
      winner: game.turn() === 'w' ? 'black' : 'white',
      condition: 'Checkmate',
    };
  if (resign) {
    return {
      winner: resign === 'w' ? 'black' : 'white',
      condition: 'Resignation',
    };
  }

  // draw
  if (game.isStalemate())
    return {
      draw: true,
      condition: 'Stalemate',
    };
  if (game.isInsufficientMaterial())
    return {
      draw: true,
      condition: 'Insufficient Material',
    };
  if (game.isThreefoldRepetition())
    return {
      draw: true,
      condition: 'Repetition',
    };

  return undefined;
}
