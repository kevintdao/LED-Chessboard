import { PIECES } from '../constant';

export default function CustomPieces() {
  const returnPieces = {} as {
    [p: string]: ({ squareWidth }: { squareWidth: number }) => JSX.Element;
  };
  PIECES.map((p) => {
    returnPieces[p] = ({ squareWidth }: { squareWidth: number }) => (
      <div
        style={{
          width: squareWidth,
          height: squareWidth,
          backgroundImage: `url(/${p}.png)`,
          backgroundSize: '100%',
        }}
      />
    );
    return null;
  });
  return returnPieces;
}
