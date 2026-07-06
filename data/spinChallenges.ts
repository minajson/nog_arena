export type SpinChallengeType = "question" | "task" | "blank";

export interface SpinChallenge {
  id: string;
  type: SpinChallengeType;
  text: string;
  enabled: boolean;
}

/** 50 pure-entertainment challenges (plus two mystery blanks). No academics,
 * no maths, no oil & gas — just laughs. Each challenge is used at most once
 * per event: landed challenges leave the pool until a facilitator reset. */
export const defaultSpinChallenges: SpinChallenge[] = [
  { id: "f1", type: "task", text: "Dance like a robot for 10 seconds.", enabled: true },
  { id: "f2", type: "task", text: "Deliver breaking news like a TV news reporter: \"Jollof rice has gone missing!\"", enabled: true },
  { id: "f3", type: "task", text: "Name 5 fruits in 10 seconds.", enabled: true },
  { id: "f4", type: "task", text: "Spell \"Renaissance\" backwards.", enabled: true },
  { id: "f5", type: "task", text: "Pretend to answer a phone call from the President.", enabled: true },
  { id: "f6", type: "task", text: "Act like a chicken until the audience laughs.", enabled: true },
  { id: "f7", type: "task", text: "Laugh out loud without smiling.", enabled: true },
  { id: "f8", type: "task", text: "Do your best evil villain laugh.", enabled: true },
  { id: "f9", type: "task", text: "Sing \"Happy Birthday\" in opera style.", enabled: true },
  { id: "f10", type: "task", text: "Balance on one foot for 20 seconds.", enabled: true },
  { id: "f11", type: "task", text: "Name 5 Nigerian foods in 10 seconds.", enabled: true },
  { id: "f12", type: "task", text: "Say the alphabet backwards starting from M.", enabled: true },
  { id: "f13", type: "task", text: "Name 10 countries in 15 seconds.", enabled: true },
  { id: "f14", type: "question", text: "Guess the flag: red background, one big yellow star. Which country?", enabled: true },
  { id: "f15", type: "question", text: "Guess the emoji: 🌧️ ➕ 🏹 = ?", enabled: true },
  { id: "f16", type: "question", text: "Fix this upside-down word: ɐuɐuɐq", enabled: true },
  { id: "f17", type: "question", text: "Read this mirrored word out loud: DLROW", enabled: true },
  { id: "f18", type: "task", text: "Tongue twister: say \"She sells seashells by the seashore\" three times fast.", enabled: true },
  { id: "f19", type: "task", text: "Speak in a British accent for 15 seconds.", enabled: true },
  { id: "f20", type: "task", text: "Commentate the audience like a football commentator for 15 seconds.", enabled: true },
  { id: "f21", type: "task", text: "Say one thing that makes everyone laugh. No pressure.", enabled: true },
  { id: "f22", type: "task", text: "Describe an elephant without saying \"elephant\", \"big\" or \"trunk\".", enabled: true },
  { id: "f23", type: "question", text: "Guess the logo: golden arches. Which company?", enabled: true },
  { id: "f24", type: "question", text: "Guess the landmark: a giant green statue holding a torch. Where is it?", enabled: true },
  { id: "f25", type: "question", text: "Guess the movie: 🚢 ➕ 🧊 ➕ 💔", enabled: true },
  { id: "f26", type: "question", text: "Guess the cartoon: a cat who never catches the mouse.", enabled: true },
  { id: "f27", type: "question", text: "Guess the football club nicknamed \"The Red Devils\".", enabled: true },
  { id: "f28", type: "question", text: "Guess the superhero known as the \"Man of Steel\".", enabled: true },
  { id: "f29", type: "question", text: "Guess the country from the food: croissants and baguettes.", enabled: true },
  { id: "f30", type: "task", text: "Make an animal sound and let the audience guess the animal.", enabled: true },
  { id: "f31", type: "task", text: "Say three words that begin with the letter Q. 10 seconds.", enabled: true },
  { id: "f32", type: "question", text: "Finish this famous quote: \"To be or not to be...\"", enabled: true },
  { id: "f33", type: "task", text: "Continue the song: \"We will, we will...\" — and perform it!", enabled: true },
  { id: "f34", type: "task", text: "Tell a joke. If nobody laughs, tell another one.", enabled: true },
  { id: "f35", type: "task", text: "Get the whole audience to clap in rhythm within 10 seconds.", enabled: true },
  { id: "f36", type: "task", text: "Do a runway model walk across the booth.", enabled: true },
  { id: "f37", type: "task", text: "Pretend you're flying a helicopter — sound effects included.", enabled: true },
  { id: "f38", type: "task", text: "Pretend you're directing traffic in Lagos rush hour.", enabled: true },
  { id: "f39", type: "task", text: "Pretend you're lifting a very heavy pipe. Make it dramatic.", enabled: true },
  { id: "f40", type: "task", text: "Pretend you're swimming — freestyle, then backstroke.", enabled: true },
  { id: "f41", type: "task", text: "Pretend you're a referee: give someone in the audience a red card.", enabled: true },
  { id: "f42", type: "task", text: "Pretend you're a DJ hyping the crowd for 10 seconds.", enabled: true },
  { id: "f43", type: "task", text: "Rock-paper-scissors: beat an audience member, best of three.", enabled: true },
  { id: "f44", type: "task", text: "Fold a paper airplane and make it fly past the facilitator.", enabled: true },
  { id: "f45", type: "task", text: "Whistle a song and let the audience guess it.", enabled: true },
  { id: "f46", type: "task", text: "Make a shadow puppet animal with your hands.", enabled: true },
  { id: "f47", type: "task", text: "One-minute mime: act out your morning routine, no words.", enabled: true },
  { id: "f48", type: "task", text: "Do a celebrity impression and let everyone guess who it is.", enabled: true },
  { id: "f49", type: "task", text: "Draw something in the air and let the audience guess it.", enabled: true },
  { id: "f50", type: "task", text: "Show us your victory celebration — trophy lift included.", enabled: true },
  { id: "x1", type: "blank", text: "Oh oh… empty slot. Spin again!", enabled: true },
  { id: "x2", type: "blank", text: "Nothing here today — one more spin!", enabled: true },
];
