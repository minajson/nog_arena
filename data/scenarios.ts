export interface Scenario {
  id: string;
  prompt: string;
  correctResponse: string;
  wrongOptions: [string, string, string];
  enabled: boolean;
}

export const defaultScenarios: Scenario[] = [
  {
    id: "sc1",
    prompt: "Gas leak alarm sounds near a work area.",
    correctResponse: "Stop work, move away, raise alarm and follow emergency procedure.",
    wrongOptions: ["Continue working", "Use phone near leak", "Ignore alarm"],
    enabled: true,
  },
  {
    id: "sc2",
    prompt: "Worker collapses in a confined space.",
    correctResponse: "Raise alarm and do not enter without rescue authorization and equipment.",
    wrongOptions: ["Rush in immediately", "Wait quietly", "Send untrained worker inside"],
    enabled: true,
  },
  {
    id: "sc3",
    prompt: "Oil spill is noticed on a walkway.",
    correctResponse: "Barricade area, report spill and begin approved spill response.",
    wrongOptions: ["Walk around it", "Cover it with paper", "Leave it for cleaners"],
    enabled: true,
  },
  {
    id: "sc4",
    prompt: "Fire starts near flammable material.",
    correctResponse: "Raise alarm, evacuate if unsafe and use extinguisher only if trained.",
    wrongOptions: ["Take photos", "Pour water without checking", "Hide the material"],
    enabled: true,
  },
  {
    id: "sc5",
    prompt: "Low oxygen alarm activates.",
    correctResponse: "Leave the area immediately and report.",
    wrongOptions: ["Remove detector", "Continue task quickly", "Ask someone to check later"],
    enabled: true,
  },
  {
    id: "sc6",
    prompt: "Chemical splashes on worker's hand.",
    correctResponse: "Use emergency wash station and report for medical support.",
    wrongOptions: ["Wipe with rag", "Continue work", "Cover with glove"],
    enabled: true,
  },
  {
    id: "sc7",
    prompt: "Vehicle reverses without banksman.",
    correctResponse: "Stop the movement and use a banksman.",
    wrongOptions: ["Wave from blind spot", "Ignore", "Run behind vehicle"],
    enabled: true,
  },
  {
    id: "sc8",
    prompt: "Contractor starts work without permit.",
    correctResponse: "Stop work and verify permit before continuing.",
    wrongOptions: ["Allow them finish quickly", "Sign later", "Ignore"],
    enabled: true,
  },
];
