export type SpinChallengeType = "question" | "task" | "blank";

export interface SpinChallenge {
  id: string;
  type: SpinChallengeType;
  text: string;
  enabled: boolean;
}

export const defaultSpinChallenges: SpinChallenge[] = [
  { id: "s1", type: "task", text: "Sing the first stanza of the Nigerian National Anthem.", enabled: true },
  { id: "s2", type: "question", text: "Mention 3 safety rules on an oil and gas site.", enabled: true },
  { id: "s3", type: "task", text: "Dance for 10 seconds.", enabled: true },
  { id: "s4", type: "task", text: "Spell “Renaissance” correctly.", enabled: true },
  { id: "s5", type: "question", text: "Mention 2 PPE items.", enabled: true },
  { id: "s6", type: "question", text: "Say one reason teamwork matters at NOG.", enabled: true },
  { id: "s7", type: "task", text: "Sing the Renaissance song with the board/team.", enabled: true },
  { id: "s8", type: "question", text: "Mention one thing Nigeria is known for.", enabled: true },
  { id: "s9", type: "task", text: "Do your best “conference hype” introduction.", enabled: true },
  { id: "s10", type: "blank", text: "Oh oh… try again.", enabled: true },
  { id: "s11", type: "task", text: "Ask the audience to clap for your team.", enabled: true },
  { id: "s12", type: "question", text: "Mention one energy transition opportunity.", enabled: true },
  { id: "s13", type: "task", text: "Say “Buzz and Drill” three times very fast.", enabled: true },
  { id: "s14", type: "question", text: "Name one oil-producing state in Nigeria.", enabled: true },
  { id: "s15", type: "blank", text: "Nothing here today!", enabled: true },
];
