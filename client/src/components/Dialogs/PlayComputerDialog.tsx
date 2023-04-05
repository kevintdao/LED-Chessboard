import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NUM_DEPTHS = 20;
const DEPTHS = Array.from({ length: NUM_DEPTHS }, (_, i) => i + 1);

export default function PlayComputerDialog({ isOpen, setIsOpen }: Props) {
  const navigate = useNavigate();

  const [stockfishDepth, setStockfishDepth] = useState(6);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStockfishDepth(parseInt(e.target.value, 10));
  }

  function handleStartGame(piece: string) {
    const id = v4();
    navigate(`/room/${id}?computer&depth=${stockfishDepth}`, {
      state: { piece },
    });
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
            Play against the computer
          </Dialog.Title>

          <hr />

          <div className="text-center space-y-2">
            <div className="">
              <input
                id="default-range"
                type="range"
                min={1}
                max={NUM_DEPTHS}
                value={stockfishDepth}
                onChange={handleChange}
                className="w-full h-2 rounded-lg cursor-pointer accent-[#779952] bg-[#edeed1]"
              />
              <span>
                Stockfish Settings: Depth = {DEPTHS[stockfishDepth - 1]}
              </span>
            </div>

            <div className="flex gap-2 justify-center pt-2">
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
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
