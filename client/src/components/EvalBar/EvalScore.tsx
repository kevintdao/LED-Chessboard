import { classNames, CPClassName } from '../../lib/utils';

interface Props {
  CP: number;
  winner?: string;
  draw?: boolean;
  bot: string;
}

export default function EvalScore({ CP, bot }: Props) {
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
