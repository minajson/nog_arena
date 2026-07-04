export type ScenarioBank = "player1" | "player2";

export interface Scenario {
  id: string;
  bank: ScenarioBank;
  prompt: string;
  correctResponse: string;
  wrongOptions: [string, string, string];
  enabled: boolean;
}

export const defaultScenarios: Scenario[] = [
  // Player 1 bank
  {
    id: "sc1",
    bank: "player1",
    prompt: "Gas leak alarm sounds near a compressor area.",
    correctResponse: "Stop work, move away, raise alarm, follow emergency procedure.",
    wrongOptions: ["Continue working", "Use phone near leak", "Ignore alarm"],
    enabled: true,
  },
  {
    id: "sc2",
    bank: "player1",
    prompt: "Worker collapses near a confined space entry point.",
    correctResponse: "Raise alarm and do not enter without rescue authorization.",
    wrongOptions: ["Rush in immediately", "Wait quietly", "Send untrained worker inside"],
    enabled: true,
  },
  {
    id: "sc3",
    bank: "player1",
    prompt: "Oil spill appears on a walkway.",
    correctResponse: "Barricade, report and start approved spill response.",
    wrongOptions: ["Walk around it", "Cover it with paper", "Leave it for cleaners"],
    enabled: true,
  },
  {
    id: "sc4",
    bank: "player1",
    prompt: "Fire starts near stored flammable material.",
    correctResponse: "Raise alarm, evacuate if unsafe, use extinguisher only if trained.",
    wrongOptions: ["Take photos", "Pour water without checking", "Hide the material"],
    enabled: true,
  },
  {
    id: "sc5",
    bank: "player1",
    prompt: "Low oxygen alarm activates.",
    correctResponse: "Leave the area immediately and report.",
    wrongOptions: ["Remove detector", "Continue task quickly", "Ask someone to check later"],
    enabled: true,
  },
  {
    id: "sc6",
    bank: "player1",
    prompt: "Chemical splashes on a worker's hand.",
    correctResponse: "Use emergency wash station and report for medical support.",
    wrongOptions: ["Wipe with rag", "Continue work", "Cover with glove"],
    enabled: true,
  },
  {
    id: "sc7",
    bank: "player1",
    prompt: "Reversing vehicle has no banksman.",
    correctResponse: "Stop movement and assign a banksman.",
    wrongOptions: ["Wave from blind spot", "Ignore", "Run behind vehicle"],
    enabled: true,
  },
  {
    id: "sc8",
    bank: "player1",
    prompt: "Contractor starts without permit.",
    correctResponse: "Stop work and verify permit.",
    wrongOptions: ["Allow them finish quickly", "Sign later", "Ignore"],
    enabled: true,
  },

  // Player 2 bank
  {
    id: "sc9",
    bank: "player2",
    prompt: "Strong hydrocarbon smell is noticed near a manifold.",
    correctResponse: "Stop work, move upwind, raise alarm and report.",
    wrongOptions: ["Keep working nearby", "Investigate the smell alone", "Ignore it"],
    enabled: true,
  },
  {
    id: "sc10",
    bank: "player2",
    prompt: "Worker becomes dizzy during tank cleaning preparation.",
    correctResponse: "Stop the task, move worker to safe area and escalate.",
    wrongOptions: ["Let them push through", "Wait and see", "Send them back in alone"],
    enabled: true,
  },
  {
    id: "sc11",
    bank: "player2",
    prompt: "Diesel leak is seen near a generator.",
    correctResponse: "Isolate area, report and use spill response procedure.",
    wrongOptions: ["Step over it", "Wipe with a rag and continue", "Leave it till later"],
    enabled: true,
  },
  {
    id: "sc12",
    bank: "player2",
    prompt: "Smoke is noticed from an electrical panel.",
    correctResponse: "Raise alarm, isolate if safe, keep people away.",
    wrongOptions: ["Open the panel to look", "Spray water on it", "Ignore and continue work"],
    enabled: true,
  },
  {
    id: "sc13",
    bank: "player2",
    prompt: "Gas monitor shows unsafe reading.",
    correctResponse: "Leave area and inform supervisor/emergency team.",
    wrongOptions: ["Silence the alarm", "Keep working a bit longer", "Assume it's a false alarm"],
    enabled: true,
  },
  {
    id: "sc14",
    bank: "player2",
    prompt: "Cleaning chemical enters worker's eye.",
    correctResponse: "Use eyewash immediately and seek medical help.",
    wrongOptions: ["Rub the eye", "Wait to see if it clears", "Wash with cleaning fluid"],
    enabled: true,
  },
  {
    id: "sc15",
    bank: "player2",
    prompt: "Forklift operator cannot see behind load.",
    correctResponse: "Stop operation and use a spotter/banksman.",
    wrongOptions: ["Reverse slowly anyway", "Guess and proceed", "Ask a bystander to shout if needed"],
    enabled: true,
  },
  {
    id: "sc16",
    bank: "player2",
    prompt: "Hot work begins near combustible material.",
    correctResponse: "Stop work and verify hot work permit and controls.",
    wrongOptions: ["Continue since it's quick", "Move material after starting", "Assume someone checked"],
    enabled: true,
  },
];
