import BlackUser from './../assets/images/black-user.png';
import WhiteUser from './../assets/images/white-user.png';
import Captured from './Captured';

interface Props {
  name?: string;
  color: string;
  captures: Captures;
  oppCaptures: Captures;
}

export default function User({ name, color, captures, oppCaptures }: Props) {
  return (
    <div className="bg-dark-300 p-2 rounded-md flex justify-between">
      {/* left */}
      <div className="flex gap-2">
        {/* user profile image */}
        <img
          src={color === 'w' ? WhiteUser : BlackUser}
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
      <div className="flex gap-2 items-center">
        {/* login/logout button */}
        {/* <button
          className={classNames(
            'p-1 rounded-lg font-semibold cursor-pointer',
            color === 'white'
              ? 'bg-white-piece text-black-piece'
              : 'bg-black-piece text-white-piece'
          )}
        >
          Login
        </button> */}
      </div>
    </div>
  );
}
