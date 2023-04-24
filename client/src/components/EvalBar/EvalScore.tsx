import { classNames, CPClassName } from '../../lib/utils';

interface Props {
  CP: number;
  mate?: number;
  winner?: string;
  draw?: boolean;
  bot: string;
}

export default function EvalScore({ CP, mate, bot }: Props) {
  if (mate) {
    return (
      <div
        className={classNames(
          'text-[0.5rem] absolute w-full font-semibold py-1',
          CPClassName(bot, CP)
        )}
      >
        {mate < 0 ? 'Mate in ' + -mate : 'Mate in ' + mate}
      </div>
    );
  }

  return CP !== 0 ? (
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
