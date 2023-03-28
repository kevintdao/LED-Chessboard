import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlayOnlineDialog({ isOpen, setIsOpen }: Props) {
  const navigate = useNavigate();

  function handleStartGame(piece: string) {
    const id = v4();
    navigate(`/room/${id}`, { state: { piece } });
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-start justify-center p-4 text-white">
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

          <Dialog.Title className="text-2xl text-center font-semibold">
            Play against another player
          </Dialog.Title>
          <hr />

          <div className="text-center text-base font-semibold">Play as</div>

          <div className="flex gap-2 justify-center">
            <button
              className="border-solid border-white rounded bg-dark-200 hover:bg-dark-400"
              onClick={() => handleStartGame('black')}
            >
              <img src="/bK.png" alt="logo" className="w-20 h-20" />
            </button>

            <button
              className="border-solid border-white rounded bg-dark-200 hover:bg-dark-400"
              onClick={() => handleStartGame('white')}
            >
              <img src="/wK.png" alt="logo" className="w-20 h-20" />
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
