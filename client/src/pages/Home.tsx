import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Computer from '../assets/images/computer.png';
import OnlinePlayer from '../assets/images/online-player.png';
import Button from '../components/Button';
import PlayComputerDialog from '../components/Dialogs/PlayComputerDialog';
import PlayOnlineDialog from '../components/Dialogs/PlayOnlineDialog';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '../components/Loading';

export default function Home() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  // dialog states
  const [playComputerOpen, setPlayComputerOpen] = useState<boolean>(false);
  const [playOnlineOpen, setPlayOnlineOpen] = useState<boolean>(false);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto">
      {user ? (
        <div className="flex items-center flex-col gap-2">
          <div className="bg-dark-300 p-4 rounded-md w-[480px] space-y-4">
            <div className="text-white text-2xl text-center font-bold">
              Play
            </div>

            <div className="flex gap-4">
              {/* against online player */}
              <button
                onClick={() => setPlayOnlineOpen(true)}
                className="text-white bg-dark-400 rounded-md p-2 flex flex-col items-center flex-1 hover:bg-dark-200"
              >
                <img
                  src={OnlinePlayer}
                  alt="online-player"
                  className="w-16 h-16"
                />
                <span>Play Online</span>
              </button>

              {/* against computer */}
              {/* <button
                onClick={() => setPlayComputerOpen(true)}
                className="text-white bg-dark-400 rounded-md p-2 flex flex-col items-center flex-1 hover:bg-dark-200"
              >
                <img src={Computer} alt="computer" className="w-16 h-16" />
                <span>Play Computer</span>
              </button> */}
            </div>
          </div>

          {/* <div className="bg-dark-300 p-4 rounded-md w-[480px] space-y-4">
          <div className="text-white text-2xl text-center font-bold">
            Join Room
          </div>
          <div className="text-white space-x-2 flex items-center">
            <span>Room ID:</span>
            <input
              name="room-id"
              className="rounded-md px-2 py-1 bg-dark-400 flex-1 border focus:outline-none"
            />
            <Button>
              <span>Join</span>
              <ArrowRightIcon className="w-4" />
            </Button>
          </div>
        </div> */}
        </div>
      ) : (
        <div>
          <h1 className="text-white text-2xl text-center font-bold">
            Welcome! Please login to continue
          </h1>
        </div>
      )}

      {/* play online dialog */}
      <PlayOnlineDialog isOpen={playOnlineOpen} setIsOpen={setPlayOnlineOpen} />

      {/* play computer dialog */}
      <PlayComputerDialog
        isOpen={playComputerOpen}
        setIsOpen={setPlayComputerOpen}
      />
    </div>
  );
}
