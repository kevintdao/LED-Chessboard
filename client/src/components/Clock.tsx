import { ArrowUpIcon } from '@heroicons/react/24/solid';
import {
  IconClockHour12,
  IconClockHour3,
  IconClockHour6,
  IconClockHour9,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const icons = [
  <IconClockHour3 key={0} className="h-6 w-6" />,
  <IconClockHour6 key={1} className="h-6 w-6" />,
  <IconClockHour9 key={2} className="h-6 w-6" />,
  <IconClockHour12 key={3} className="h-6 w-6" />,
];

export default function Clock({
  turn,
  color,
  gameOver,
}: {
  turn: string;
  color: string;
  gameOver?: GameOver;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % 4);
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="flex gap-2 items-center">
      <div className="bg-dark-400 h-full flex items-center p-2 rounded-lg flex-col">
        {turn !== color || gameOver ? (
          <IconClockHour3 className="h-6 w-6 text-gray-400" />
        ) : (
          <>
            {icons[count]}
            <ArrowUpIcon className="h-2 w-2" />
          </>
        )}
      </div>
    </div>
  );
}
