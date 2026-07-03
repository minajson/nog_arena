export interface PlayerResult {
  name: string;
  score: number;
  correct: number;
  total: number;
}

export function rankPlayers(players: PlayerResult[]): PlayerResult[] {
  return [...players].sort((a, b) => b.score - a.score);
}

export function decideWinner(players: PlayerResult[]): { winners: PlayerResult[]; tie: boolean } {
  const ranked = rankPlayers(players);
  if (ranked.length === 0) return { winners: [], tie: false };
  const topScore = ranked[0].score;
  const winners = ranked.filter((p) => p.score === topScore);
  return { winners, tie: winners.length > 1 };
}
