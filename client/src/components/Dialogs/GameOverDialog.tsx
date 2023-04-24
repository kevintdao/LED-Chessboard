import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';
import BlackUser from './../../assets/images/black-user.png';
import WhiteUser from './../../assets/images/white-user.png';

interface Props {
  user: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameOver?: GameOver;
}

export default function GameOverDialog({
  user,
  isOpen,
  setIsOpen,
  gameOver,
}: Props) {
  const winner = gameOver?.winner;
  const draw = gameOver?.draw;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4 text-white">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="w-full max-w-sm rounded bg-dark-300 px-2 pb-4 pt-2 space-y-1">
          <div className="relative">
            <button
              className="absolute right-0"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Dialog.Title className="text-3xl text-center font-semibold">
            Game Over
          </Dialog.Title>
          <hr />

          <Dialog.Description className="text-lg text-center">
            {winner
              ? `${winner[0].toUpperCase() + winner.slice(1)} wins by `
              : ''}
            {gameOver?.condition}
          </Dialog.Description>

          {/* user profile picture */}
          <div className="flex justify-between items-center mx-8 p-2">
            <img
              src={user === 'white' ? WhiteUser : BlackUser}
              alt="profile"
              width="100px"
              className="rounded"
            />

            {/* score */}
            <div>{draw ? '0.5 - 0.5' : winner === user ? '1-0' : '0-1'}</div>

            {/* opponent profile picture */}
            <img
              src={user === 'white' ? BlackUser : WhiteUser}
              alt="profile"
              width="100px"
              className="rounded"
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
