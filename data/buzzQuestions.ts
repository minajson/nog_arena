export interface BuzzQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  enabled: boolean;
}

export const defaultBuzzQuestions: BuzzQuestion[] = [
  {
    id: "q1",
    question: "What does 'NOG' stand for in this conference's context?",
    options: [
      "Nigeria Oil and Gas",
      "National Oil Guild",
      "Natural Oil Group",
      "Northern Oil Grid",
    ],
    correctIndex: 0,
    enabled: true,
  },
  {
    id: "q2",
    question: "Which process separates crude oil into fractions like petrol and diesel?",
    options: ["Cracking", "Distillation", "Reforming", "Alkylation"],
    correctIndex: 1,
    enabled: true,
  },
  {
    id: "q3",
    question: "What is the primary component of natural gas?",
    options: ["Ethane", "Propane", "Methane", "Butane"],
    correctIndex: 2,
    enabled: true,
  },
  {
    id: "q4",
    question: "What does 'LNG' stand for?",
    options: [
      "Liquefied Natural Gas",
      "Low Nitrogen Gasoline",
      "Light Natural Gasoline",
      "Liquid Nitrogen Generator",
    ],
    correctIndex: 0,
    enabled: true,
  },
  {
    id: "q5",
    question: "Which equipment prevents blowouts at a drilling wellhead?",
    options: ["Drill bit", "Blowout preventer (BOP)", "Mud pump", "Derrick"],
    correctIndex: 1,
    enabled: true,
  },
  {
    id: "q6",
    question: "What unit is standard for measuring crude oil volume?",
    options: ["Liter", "Gallon", "Barrel", "Cubic meter"],
    correctIndex: 2,
    enabled: true,
  },
  {
    id: "q7",
    question: "What does 'FPSO' stand for in offshore production?",
    options: [
      "Floating Production Storage and Offloading",
      "Fixed Pipeline Supply Operation",
      "Field Pressure Safety Override",
      "Full Production Site Operations",
    ],
    correctIndex: 0,
    enabled: true,
  },
  {
    id: "q8",
    question: "Which gas is flared off at oil production sites as a byproduct?",
    options: ["Oxygen", "Associated gas", "Hydrogen", "Helium"],
    correctIndex: 1,
    enabled: true,
  },
  {
    id: "q9",
    question: "What does 'HSE' stand for on an oil & gas site?",
    options: [
      "Health, Safety and Environment",
      "Heavy Site Equipment",
      "High Sulfur Extraction",
      "Hydraulic Systems Engineering",
    ],
    correctIndex: 0,
    enabled: true,
  },
  {
    id: "q10",
    question: "What is the term for drilling multiple wells from one location?",
    options: ["Fracking", "Directional drilling", "Slant drilling", "Cluster/multi-well drilling"],
    correctIndex: 3,
    enabled: true,
  },
  {
    id: "q11",
    question: "Which organization regulates Nigeria's upstream petroleum sector?",
    options: ["NNPC", "NUPRC", "DPR (legacy)", "Both NUPRC and legacy DPR"],
    correctIndex: 3,
    enabled: true,
  },
  {
    id: "q12",
    question: "What does 'PPE' stand for on a rig site?",
    options: [
      "Personal Protective Equipment",
      "Pipeline Pressure Estimate",
      "Production Planning Engine",
      "Petroleum Processing Equipment",
    ],
    correctIndex: 0,
    enabled: true,
  },
];
