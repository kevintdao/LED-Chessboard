import type { Move } from 'chess.js';
import pkg from 'lodash';
import { useEffect, useRef } from 'react';
import { classNames } from '../lib/utils';
const { chunk } = pkg;

interface Props {
  history: Move[];
  className: string;
}

const headers = [
  { name: '#', className: 'w-12 pl-2' },
  { name: 'White', className: '' },
  { name: 'Black', className: '' },
];

export default function History({ history, className }: Props) {
  const moves = chunk(history, 2);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className={className}>
      <table className="table-fixed w-full text-sm">
        <thead className="sticky top-0">
          <tr className="font-bold bg-dark-400">
            {headers.map((header) => (
              <td className={`p-1 ${header.className}`} key={header.name}>
                {header.name}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {moves.map((move, i) => (
            <tr
              key={`move-${i + 1}`}
              className={classNames('h-5', i % 2 == 1 ? 'bg-dark-200' : '')}
            >
              <td className="font-light text-neutral-400 p-2">{i + 1}.</td>
              {move.map((colorMove) => (
                <td
                  key={`${colorMove.color}-${colorMove.san}`}
                  className="font-medium p-1"
                >
                  {colorMove.san}
                </td>
              ))}
              {history.length % 2 == 1 && i === moves.length - 1 && <td></td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={bottomRef} />
    </div>
  );
}
