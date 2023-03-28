import { createContext, ReactNode, useContext, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  children: ReactNode;
}

interface Context {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

export const GameContext = createContext({} as Context);

export function useGame() {
  return useContext(GameContext);
}

export default function GameProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket>();

  const value = {
    socket,
    setSocket,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
