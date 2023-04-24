import { FlagIcon } from '@heroicons/react/24/solid';
import { IconBulbFilled } from '@tabler/icons-react';
import type { Chess } from 'chess.js';
import Button from '../Button';
import History from '../History';

interface Props {
  game: Chess;
  handleHint: () => void;
  gameOver?: GameOver;
}

export default function Right({ game, handleHint, gameOver }: Props) {
  return (
    <div className="w-64 md:flex flex-col hidden gap-2">
      <History
        history={game.history({ verbose: true })}
        className="bg-dark-300 rounded-md overflow-auto flex-1 max-h-[570px]"
      />

      <div className="max-h-16 bg-dark-300 rounded-md p-2 flex justify-between">
        <Button onClick={() => handleHint()} disabled={!!gameOver}>
          <IconBulbFilled className="h-4 w-4" />
          <span>Show Hint</span>
        </Button>
        <Button disabled={!!gameOver}>
          <FlagIcon className="h-4 w-4" />
          <span>Resign</span>
        </Button>
      </div>
    </div>
  );
}
