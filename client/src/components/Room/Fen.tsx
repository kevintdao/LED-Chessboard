import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

export default function Fen({ fen }: { fen: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="sm:mx-0 mx-2">
      <div className="bg-dark-300 p-2 rounded-md max-w-[816px] mx-auto flex gap-1 sm:justify-center justify-start">
        <div className="font-bold">FEN:</div>
        <div>
          {fen}
          <button
            onClick={handleCopy}
            className="inline-flex gap-1 items-center ml-1"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
