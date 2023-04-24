import React from 'react';
import EvalBar from '../EvalBar/EvalBar';
import Turn from '../Turn';

interface Props {
  gameOver: GameOver | undefined;
  turn: string;
  CP: number;
  mate?: number;
  pieceColor: string;
}

export default function Left({ gameOver, turn, CP, mate, pieceColor }: Props) {
  return (
    <div className="w-16 sm:block hidden">
      <div className="h-full bg-dark-300 rounded-md overflow-y-auto flex flex-col items-center text-center gap-2 py-2 pb-4">
        <Turn gameOver={gameOver} turn={turn} />
        <EvalBar CP={CP} mate={mate} boardOrientation={pieceColor} />

        {/* stockfish depth */}
        <div className="text-xs block">
          <div className="font-semibold">Depth</div>
          <div>15</div>
        </div>
      </div>
    </div>
  );
}
