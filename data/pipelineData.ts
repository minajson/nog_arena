export type PipelinePieceType =
  | "straight-pipe"
  | "elbow-pipe"
  | "valve"
  | "pump"
  | "storage-tank";

export const PIPELINE_PIECE_LABELS: Record<PipelinePieceType, string> = {
  "straight-pipe": "Straight Pipe",
  "elbow-pipe": "Elbow Pipe",
  valve: "Valve",
  pump: "Pump",
  "storage-tank": "Storage Tank",
};

/** The route between Oil Well and Processing Facility, in order. */
export const defaultPipelineSequence: PipelinePieceType[] = [
  "straight-pipe",
  "valve",
  "elbow-pipe",
  "pump",
  "straight-pipe",
  "storage-tank",
];

export const PIPELINE_SCORING = {
  correctPiece: 10,
  wrongPiece: -5,
  completionBonus: 30,
  timeBonusPerSecond: 1,
};
