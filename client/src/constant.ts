type Color = string;

export const MOVE_COLOR: Color = 'rgba(255, 255, 0, 0.4)';
export const HIGHLIGHT_COLOR: Color = 'rgba(0, 0, 255, 0.4)';
export const CHECK_COLOR: Color = 'rgba(235,97,80, 0.6)';
export const HINT_COLOR: Color = 'rgba(255,170,0,0.6)';

export const PIECES_VALUE: Captures = {
  p: 1,
  b: 3,
  n: 3,
  r: 5,
  q: 9,
};

export const PIECES = [
  'wP',
  'wN',
  'wB',
  'wR',
  'wQ',
  'wK',
  'bP',
  'bN',
  'bB',
  'bR',
  'bQ',
  'bK',
];
