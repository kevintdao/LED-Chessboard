interface GameOver {
  winner?: string;
  draw?: boolean;
  condition?: string;
}

interface Captures {
  [p: string]: number;
  [n: string]: number;
  [b: string]: number;
  [r: string]: number;
  [q: string]: number;
}

interface OptionSquare {
  [key: string]: {
    background: string;
    borderRadius?: string;
  };
}

interface KingPosition {
  w: Square;
  b: Square;
}

interface SocketMove {
  from: Square;
  to: Square;
  id: string;
  CP: number;
}
