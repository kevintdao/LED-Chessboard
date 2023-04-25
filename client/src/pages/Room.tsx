import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import CaptureSound from '../assets/audios/capture.mp3';
import MoveSound from '../assets/audios/move-self.mp3';
import NotifySound from '../assets/audios/notify.mp3';
import CustomPieces from '../components/CustomPieces';
import User from '../components/User';
import { CHECK_COLOR, MOVE_COLOR } from '../constant';

import type {
  BoardOrientation,
  Square,
} from 'react-chessboard/dist/chessboard/types';
import { gameOverType, showAvailableMoves } from '../lib/utils';
import { useGame } from '../contexts/GameContext';
import { io } from 'socket.io-client';
import { v4 } from 'uuid';
import Right from '../components/Room/Right';
import Left from '../components/Room/Left';
import GameOverDialog from '../components/Dialogs/GameOverDialog';
import Button from '../components/Button';
import { ClipboardDocumentIcon } from '@heroicons/react/24/solid';

const captureAudio = new Audio(CaptureSound);
const moveAudio = new Audio(MoveSound);
const NotifyAudio = new Audio(NotifySound);

const initialCaptures: Captures = {
  p: 0,
  b: 0,
  n: 0,
  r: 0,
  q: 0,
};

export default function Room() {
  const { state } = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const depth = searchParams.get('depth');
  const { socket, setSocket } = useGame();

  // game states
  const [game, setGame] = useState(new Chess());
  const [kingPosition, setKingPosition] = useState<KingPosition>({
    w: 'e1',
    b: 'e8',
  });
  const [pieceColor, setPieceColor] = useState<BoardOrientation>('white');
  const [turn, setTurn] = useState(game.turn());
  const [gameOver, setGameOver] = useState<GameOver | undefined>();
  const [resign, setResign] = useState<string | undefined>(undefined);
  const [captures, setCaptures] = useState({
    w: initialCaptures,
    b: initialCaptures,
  });
  const [CP, setCP] = useState(0);
  const [mate, setMate] = useState<number | undefined>(undefined);

  // square highlight states
  const [optionSquares, setOptionSquares] = useState<OptionSquare>({});
  const [moveSquares, setMoveSquares] = useState<OptionSquare>({});
  const [checkedSquare, setCheckedSquare] = useState<OptionSquare>({});

  // hint arrow
  const [hintArrow, setHintArrow] = useState<Square[][]>([]);

  // dialog state
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);

  function makeMove(sourceSquare: Square, targetSquare: Square) {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());

    const result = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    setGame(gameCopy);
    setTurn(gameCopy.turn());

    // return false if move is invalid
    if (result === null) return false;

    // update move square
    setMoveSquares({
      [sourceSquare]: { background: MOVE_COLOR },
      [targetSquare]: { background: MOVE_COLOR },
    });

    // check if the king move
    if (result.piece === 'k') {
      result.color === 'w'
        ? setKingPosition({ ...kingPosition, w: result.to })
        : setKingPosition({ ...kingPosition, b: result.to });
    }

    // add captured piece
    if (result.captured) {
      result.color === 'w'
        ? setCaptures({
            ...captures,
            w: {
              ...captures['w'],
              [result.captured]: captures['w'][result.captured] + 1,
            },
          })
        : setCaptures({
            ...captures,
            b: {
              ...captures['b'],
              [result.captured]: captures['b'][result.captured] + 1,
            },
          });
    }

    // play audio
    if (result.captured) captureAudio.play();
    else moveAudio.play();

    return true;
  }

  // handle drop event
  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    // check if gameover
    if (gameOver) return false;

    const result = makeMove(sourceSquare, targetSquare);

    // send move to server using socket
    socket?.emit('move', {
      from: sourceSquare,
      to: targetSquare,
      id,
    });
    return result;
  }

  function onMouseOverSquare(square: Square) {
    if (gameOver) return;

    // get available moves
    const newSquares = showAvailableMoves(game, square);
    if (!newSquares) {
      setOptionSquares({});
      return;
    }
    setOptionSquares(newSquares);
  }

  function handleHint() {
    socket?.emit('getHint', {
      fen: game.fen(),
    });
  }

  function handleResign() {
    setResign(game.turn());
  }

  const handleUpdateBoard = (data: SocketMove) => {
    try {
      makeMove(data.from, data.to);
    } catch (err) {} // eslint-disable-line
    setCP(turn === 'w' ? -data.CP : data.CP);
  };

  const handleUpdateCP = (CP: number) => {
    console.log(CP);
    setCP(turn === 'w' ? -CP : CP);
  };

  const handleUpdateMate = (mate: number) => {
    console.log(mate);
    setMate(turn === 'w' ? -mate : mate);
  };

  const handleUpdateHint = (data: SocketMove) => {
    setHintArrow([[data.from, data.to]]);
  };

  const handleUpdatePiece = (piece: BoardOrientation) => {
    setPieceColor(piece);
  };

  useEffect(() => {
    // check if game is over
    if (game.isGameOver() || resign) {
      setGameOver(gameOverType(game, resign));
      setIsGameOverOpen(true);
      setOptionSquares({});
    }

    // check if king of the current player is in check
    if (game.isCheck()) {
      const kingSquare = turn === 'w' ? kingPosition.w : kingPosition.b;
      setCheckedSquare({ [kingSquare]: { background: CHECK_COLOR } });

      // play notify audio
      NotifyAudio.play();
    } else {
      setCheckedSquare({});
    }
  }, [turn, resign]);

  useEffect(() => {
    // connect to room
    const newSocket = io('http://localhost:8000', {
      query: {
        piece: state?.piece ?? 'white',
        roomId: id,
        user: v4(),
        type:
          searchParams.get('multiplayer') !== null ? 'multiplayer' : 'computer',
        depth,
      },
    });
    setSocket(newSocket);
  }, [state?.piece]);

  // socket event listeners
  useEffect(() => {
    socket?.on('updateBoard', handleUpdateBoard);
    socket?.on('updateBoardComputer', handleUpdateBoard);
    socket?.on('updateCP', handleUpdateCP);
    socket?.on('updateMate', handleUpdateMate);
    socket?.on('updateHint', handleUpdateHint);
    socket?.on('updatePiece', handleUpdatePiece);

    return () => {
      socket?.off('updateBoard', handleUpdateBoard);
      socket?.off('updateBoardComputer', handleUpdateBoard);
      socket?.off('updateCP', handleUpdateCP);
      socket?.off('updateMate', handleUpdateMate);
      socket?.off('updateHint', handleUpdateHint);
      socket?.off('updatePiece', handleUpdatePiece);
    };
  }, [
    socket,
    handleUpdateBoard,
    handleUpdateCP,
    handleUpdateMate,
    handleUpdateHint,
  ]);

  const oppPieceColor = pieceColor === 'white' ? 'black' : 'white';
  const name = pieceColor === 'white' ? 'White' : 'Black';
  const oppName = pieceColor === 'white' ? 'Black' : 'White';

  return (
    <div className="text-white container mx-auto py-1 space-y-2">
      <div className="flex justify-center gap-0 sm:gap-2">
        {/* left */}
        <Left
          gameOver={gameOver}
          turn={turn}
          CP={CP}
          mate={mate}
          pieceColor={pieceColor}
        />

        {/* middle */}
        <div className="space-y-2">
          {/* top user screen user */}
          <User
            color={oppPieceColor}
            name={depth ? `${oppName} (Depth: ${depth})` : oppName}
            captures={captures[oppPieceColor === 'white' ? 'w' : 'b']}
            oppCaptures={captures[pieceColor === 'white' ? 'w' : 'b']}
          />

          <Chessboard
            id="chess-board"
            position={game.fen()}
            onMouseOverSquare={onMouseOverSquare}
            onPieceDrop={onDrop}
            boardWidth={480}
            boardOrientation={pieceColor}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            customBoardStyle={{
              borderRadius: '4px',
            }}
            customPieces={CustomPieces()}
            customArrows={hintArrow}
            customSquareStyles={{
              ...checkedSquare,
              ...moveSquares,
              ...optionSquares,
            }}
          />

          {/* bottom user screen user */}
          <User
            color={pieceColor}
            name={name}
            captures={captures[pieceColor === 'white' ? 'w' : 'b']}
            oppCaptures={captures[oppPieceColor === 'white' ? 'w' : 'b']}
          />
        </div>

        {/* right side components */}
        <Right
          game={game}
          handleHint={handleHint}
          handleResign={handleResign}
          gameOver={gameOver}
        />
      </div>

      <div className="sm:mx-0 mx-2">
        <div className="bg-dark-300 p-2 rounded-md max-w-[816px] mx-auto flex gap-1 sm:justify-center justify-start">
          <div className="font-bold">FEN:</div>
          <div>
            {game.fen()}
            <button
              onClick={() => navigator.clipboard.writeText(game.fen())}
              className="inline-flex gap-1 items-center ml-1"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* game over dialog */}
      <GameOverDialog
        user={pieceColor}
        gameOver={gameOver}
        isOpen={isGameOverOpen}
        setIsOpen={setIsGameOverOpen}
      />
    </div>
  );
}
