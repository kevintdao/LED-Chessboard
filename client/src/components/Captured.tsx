import { PIECES_VALUE } from '../constant';
import { classNames } from '../lib/utils';

interface Props {
  captures: Captures;
  oppCaptures: Captures;
  color: string;
}

const whitePieces = ['wP', 'wB', 'wN', 'wR', 'wQ'];
const blackPieces = ['bP', 'bB', 'bN', 'bR', 'bQ'];

function calculateCapturesValue(curCaptures: Captures, oppCaptures: Captures) {
  let diff = 0;

  Object.entries(curCaptures).forEach(([key, value]) => {
    diff =
      diff + value * PIECES_VALUE[key] - oppCaptures[key] * PIECES_VALUE[key];
  });
  return diff;
}

const sumValues = (obj: { [key: string]: number }) =>
  Object.values(obj).reduce((a: number, b: number) => a + b, 0);

export default function Captured({ captures, oppCaptures, color }: Props) {
  const pieces = color === 'white' ? blackPieces : whitePieces;
  const capturesValue = calculateCapturesValue(captures, oppCaptures);

  return (
    <div
      className={classNames(
        'bg-light flex w-fit text-xs rounded items-center text-neutral-400',
        sumValues(captures) !== 0 ? 'h-5 gap-1' : ''
      )}
    >
      <div className="flex space-x-[-1px]">
        {Object.entries(captures).map(([piece, value], i) => (
          <div key={piece} className="flex space-x-[-12px]">
            {Array.from({ length: value }, (_, j) => (
              <div
                key={`${piece}-${j}`}
                className="h-5 w-5"
                style={{
                  backgroundImage: `url(/${pieces[i]}.png)`,
                  backgroundSize: '100%',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="ml-1 text-white font-medium">
        {capturesValue > 0 ? `+${capturesValue}` : ''}
      </div>
    </div>
  );
}
