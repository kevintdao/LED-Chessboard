import { classNames, evalBarClassName } from '../../lib/utils';
import EvalScore from './EvalScore';

interface Props {
  CP: number;
  boardOrientation: string;
}

export function normalizeCP(cp: number): number {
  const dem = 1 + 10 ** (cp / 4);
  return (1 / dem) * 100;
}

export default function EvalBar({ CP, boardOrientation }: Props) {
  const player = boardOrientation;
  const percent = normalizeCP(CP);

  return (
    <div
      className={classNames(
        'rounded-sm flex-1 w-6 text-black text-xs',
        player === 'white' ? 'bg-[#edeed1]' : 'bg-[#779952]'
      )}
    >
      <div className="relative h-full">
        <EvalScore CP={CP} bot={player} />

        <div
          className={classNames(
            'rounded-sm h-2.5',
            player === 'white' ? 'bg-[#779952]' : 'bg-[#edeed1]'
          )}
          style={{
            height: `${evalBarClassName(percent, player)}%`,
            transition: '1s ease',
          }}
        ></div>
      </div>
    </div>
  );
}
