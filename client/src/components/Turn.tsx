import { classNames } from '../lib/utils';

interface Props {
  gameOver?: GameOver;
  turn: string;
}

export default function Turn({ gameOver, turn }: Props) {
  return (
    <div>
      <div className={classNames(gameOver ? '' : 'font-bold')}>
        {gameOver ? 'Game' : 'Turn'}
      </div>
      <div
        className={classNames(
          gameOver
            ? 'text-white'
            : turn === 'w'
            ? 'text-white-piece'
            : 'text-black-piece'
        )}
      >
        {gameOver ? 'Over' : turn === 'w' ? 'White' : 'Black'}
      </div>
    </div>
  );
}
