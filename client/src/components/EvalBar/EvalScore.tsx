import { classNames, CPClassName, gameOverClassName } from '../../lib/utils';

interface Props {
  CP: number;
  mate?: number;
  winner?: string;
  draw?: boolean;
  bot: string;
}

export default function EvalScore({ CP, winner, draw, mate, bot }: Props) {
  if (draw || winner) {
    return (
      <div
        className={classNames(
          'text-[0.5rem] absolute w-full font-semibold py-1 top',
          gameOverClassName(bot, draw, winner)
        )}
      >
        {draw ? 'Draw' : winner === bot ? '1-0' : '0-1'}
      </div>
    );
  }

  if (mate) {
    return (
      <div
        className={classNames(
          'text-[0.5rem] absolute w-full font-semibold py-1',
          CPClassName(bot, mate)
        )}
      >
        {mate < 0 ? 'Mate in ' + -mate : 'Mate in ' + mate}
      </div>
    );
  }

  return CP && CP !== 0 ? (
    <div
      className={classNames(
        'text-[0.5rem] absolute w-full font-semibold py-1',
        CPClassName(bot, CP)
      )}
    >
      {CP < 0 ? -CP : CP}
    </div>
  ) : null;
}
