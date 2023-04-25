import BlackUser from './../assets/images/black-user.png';
import WhiteUser from './../assets/images/white-user.png';
import Captured from './Captured';
import Clock from './Clock';

interface Props {
  name?: string;
  color: string;
  turn: string;
  captures: Captures;
  oppCaptures: Captures;
  gameOver?: GameOver;
}

export default function User({
  name,
  color,
  turn,
  captures,
  oppCaptures,
  gameOver,
}: Props) {
  return (
    <div className="bg-dark-300 p-2 rounded-md flex justify-between">
      {/* left */}
      <div className="flex gap-2">
        {/* user profile image */}
        <img
          src={color === 'white' ? WhiteUser : BlackUser}
          alt="profile"
          width="50px"
          className="rounded"
        />
        <div className="flex flex-col gap-1 justify-content">
          {/* name and captured pieces */}
          <div className="font-semibold">{name}</div>
          <Captured
            captures={captures}
            color={color}
            oppCaptures={oppCaptures}
          />
        </div>
      </div>

      {/* right */}
      <Clock
        turn={turn}
        color={color === 'white' ? 'w' : 'b'}
        gameOver={gameOver}
      />
    </div>
  );
}
