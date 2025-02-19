
export interface Player {
  id: string;
  name: string;
  rating: number;
  matches: number;
}

export interface Match {
  id: string;
  date: string;
  whiteId: string;
  blackId: string;
  result: "white" | "black" | "draw";
}

const K_FACTOR = 32;

export const calculateNewRatings = (
  playerRating: number,
  opponentRating: number,
  result: "win" | "loss" | "draw"
): number => {
  const expectedScore =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  
  const actualScore = result === "win" ? 1 : result === "draw" ? 0.5 : 0;
  
  return Math.round(playerRating + K_FACTOR * (actualScore - expectedScore));
};

export const processMatch = (
  white: Player,
  black: Player,
  result: "white" | "black" | "draw"
): [Player, Player] => {
  const whiteResult = result === "white" ? "win" : result === "black" ? "loss" : "draw";
  const blackResult = result === "black" ? "win" : result === "white" ? "loss" : "draw";

  const newWhiteRating = calculateNewRatings(white.rating, black.rating, whiteResult);
  const newBlackRating = calculateNewRatings(black.rating, white.rating, blackResult);

  return [
    { ...white, rating: newWhiteRating, matches: white.matches + 1 },
    { ...black, rating: newBlackRating, matches: black.matches + 1 },
  ];
};
