export type PipelinePieceType =
  | "straight-pipe"
  | "elbow-pipe"
  | "valve"
  | "pump"
  | "storage-tank"
  | "pressure-gauge"
  | "compressor"
  | "final-connector";

export const PIPELINE_PIECE_LABELS: Record<PipelinePieceType, string> = {
  "straight-pipe": "Straight Pipe",
  "elbow-pipe": "Elbow Pipe",
  valve: "Valve",
  pump: "Pump",
  "storage-tank": "Storage Tank",
  "pressure-gauge": "Pressure Gauge",
  compressor: "Compressor",
  "final-connector": "Final Connector",
};

/** The 15-slot snake route between Oil Well and Processing Facility, in order. */
export const defaultPipelineSequence: PipelinePieceType[] = [
  "straight-pipe",
  "valve",
  "elbow-pipe",
  "straight-pipe",
  "pump",
  "elbow-pipe",
  "straight-pipe",
  "pressure-gauge",
  "valve",
  "straight-pipe",
  "compressor",
  "elbow-pipe",
  "straight-pipe",
  "storage-tank",
  "final-connector",
];

export const PIPELINE_SCORING = {
  correctPiece: 10,
  wrongPiece: -5,
  completionBonus: 30,
  timeBonusPerSecond: 1,
};
