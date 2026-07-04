"use client";

import { useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  RotateCcw,
  Download,
  Upload,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import { SETTINGS_FIELDS, type SettingField } from "@/data/gameSettings";
import { PIPELINE_PIECE_LABELS, type PipelinePieceType } from "@/data/pipelineData";
import type { BuzzQuestion } from "@/data/buzzQuestions";
import type { SpinChallenge } from "@/data/spinChallenges";
import type { Hazard } from "@/data/hazards";
import type { Scenario } from "@/data/scenarios";
import type { LeaderboardEntry } from "@/lib/storage";
import {
  useSettings,
  updateSettings,
  resetSettingsToDefaults,
  useBuzzQuestions,
  setBuzzQuestions,
  resetBuzzQuestions,
  useSpinChallenges,
  setSpinChallenges,
  resetSpinChallenges,
  usePipelineSequence,
  setPipelineSequence,
  resetPipelineSequence,
  useHazards,
  setHazards,
  resetHazards,
  useScenarios,
  setScenarios,
  resetScenarios,
  useLeaderboard,
  clearLeaderboard,
  exportAllData,
  importAllData,
} from "@/lib/store";

const TABS = [
  { id: "settings", label: "Settings" },
  { id: "buzz", label: "Buzz and Drill" },
  { id: "spin", label: "Spin & Spark" },
  { id: "pipeline", label: "Pipeline Puzzle" },
  { id: "hazard", label: "Hazard Hunt" },
  { id: "pressure", label: "Pressure Point" },
  { id: "data", label: "Data & Leaderboard" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const [tab, setTab] = useState<TabId>("settings");

  return (
    <main className="min-h-screen bg-white px-6 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <GameTopBar title="Admin Settings" />

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-xl px-4 py-3 text-base font-bold cursor-pointer transition-colors ${
                tab === t.id
                  ? "bg-nog-green-700 text-white shadow-md"
                  : "border-2 border-nog-black/10 text-nog-black/60 hover:border-nog-green-600 hover:text-nog-green-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "settings" && <SettingsSection />}
        {tab === "buzz" && <BuzzSection />}
        {tab === "spin" && <SpinSection />}
        {tab === "pipeline" && <PipelineSection />}
        {tab === "hazard" && <HazardSection />}
        {tab === "pressure" && <ScenarioSection />}
        {tab === "data" && <DataSection />}
      </div>
    </main>
  );
}

/* ---------------------------- Shared controls ---------------------------- */

function Stepper({ field, value, onChange }: { field: SettingField; value: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-2xl border-2 border-nog-black/10 p-5">
      <p className="mb-3 text-base font-bold text-nog-black/70">{field.label}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onChange(Math.max(field.min, value - field.step))}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-nog-black/5 text-2xl font-black hover:bg-nog-black/10 cursor-pointer"
        >
          −
        </button>
        <span className="text-2xl font-black tabular-nums">
          {value} <span className="text-base font-semibold text-nog-black/50">{field.unit}</span>
        </span>
        <button
          onClick={() => onChange(Math.min(field.max, value + field.step))}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-nog-black/5 text-2xl font-black hover:bg-nog-black/10 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex flex-1 items-center justify-between rounded-2xl border-2 border-nog-black/10 px-5 py-4 cursor-pointer"
    >
      <span className="text-base font-bold text-nog-black/70">{label}</span>
      <span
        className={`flex h-7 w-12 items-center rounded-full px-1 transition-colors ${
          checked ? "justify-end bg-nog-green-600" : "justify-start bg-nog-black/20"
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow" />
      </span>
    </button>
  );
}

function SectionCard({
  title,
  count,
  onReset,
  resetLabel = "Reset Defaults",
  onAdd,
  children,
}: {
  title: string;
  count?: number;
  onReset?: () => void;
  resetLabel?: string;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border-2 border-nog-black/10 p-8 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-nog-black">
          {title} {count !== undefined ? `(${count})` : ""}
        </h2>
        <div className="flex items-center gap-4">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-sm font-bold text-nog-black/50 hover:text-red-600 cursor-pointer"
            >
              <RotateCcw size={16} /> {resetLabel}
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 rounded-xl bg-nog-green-700 px-4 py-2 text-base font-bold text-white hover:bg-nog-green-800 cursor-pointer"
            >
              <Plus size={18} /> Add
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------- Settings -------------------------------- */

function SettingsSection() {
  const settings = useSettings();
  const grouped = new Map<string, SettingField[]>();
  for (const field of SETTINGS_FIELDS) {
    if (!grouped.has(field.game)) grouped.set(field.game, []);
    grouped.get(field.game)!.push(field);
  }

  return (
    <SectionCard
      title="Game Settings"
      onReset={() => {
        if (confirm("Reset all game settings to defaults?")) resetSettingsToDefaults();
      }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <ToggleRow
          label="Sound effects"
          checked={settings.soundEnabled}
          onChange={(v) => updateSettings({ soundEnabled: v })}
        />
        <ToggleRow
          label="Background video loop"
          checked={settings.backgroundVideoEnabled}
          onChange={(v) => updateSettings({ backgroundVideoEnabled: v })}
        />
      </div>

      <div className="flex flex-col gap-6">
        {[...grouped.entries()].map(([game, fields]) => (
          <div key={game}>
            <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-nog-black/50">{game}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <Stepper
                  key={field.key}
                  field={field}
                  value={settings[field.key]}
                  onChange={(v) => updateSettings({ [field.key]: v })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ---------------------------- Buzz and Drill ------------------------------ */

const emptyBuzzDraft = (): Omit<BuzzQuestion, "id"> => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  enabled: true,
});

function BuzzSection() {
  const questions = useBuzzQuestions();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<BuzzQuestion, "id">>(emptyBuzzDraft());

  function startEdit(q: BuzzQuestion) {
    setEditingId(q.id);
    setDraft({ question: q.question, options: [...q.options] as BuzzQuestion["options"], correctIndex: q.correctIndex, enabled: q.enabled });
  }
  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyBuzzDraft());
  }
  function saveDraft() {
    if (!draft.question.trim() || draft.options.some((o) => !o.trim())) return;
    if (editingId === "new") {
      setBuzzQuestions([...questions, { ...draft, id: `q-${Date.now()}` }]);
    } else {
      setBuzzQuestions(questions.map((q) => (q.id === editingId ? { ...draft, id: q.id } : q)));
    }
    cancelEdit();
  }
  function deleteItem(id: string) {
    setBuzzQuestions(questions.filter((q) => q.id !== id));
    if (editingId === id) cancelEdit();
  }
  function toggleEnabled(q: BuzzQuestion) {
    setBuzzQuestions(questions.map((item) => (item.id === q.id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <SectionCard
      title="Buzz and Drill Questions"
      count={questions.length}
      onAdd={() => {
        setEditingId("new");
        setDraft(emptyBuzzDraft());
      }}
      onReset={() => {
        if (confirm("Reset all Buzz and Drill questions to defaults?")) resetBuzzQuestions();
      }}
    >
      {editingId === "new" && <BuzzForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />}
      <ul className="flex flex-col gap-4">
        {questions.map((q) =>
          editingId === q.id ? (
            <BuzzForm key={q.id} draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />
          ) : (
            <li key={q.id} className={`rounded-2xl border-2 p-5 ${q.enabled ? "border-nog-black/10" : "border-nog-black/5 opacity-50"}`}>
              <div className="flex items-start justify-between gap-4">
                <p className="text-lg font-bold text-nog-black">{q.question}</p>
                <div className="flex shrink-0 gap-2">
                  <IconButton onClick={() => toggleEnabled(q)} active={q.enabled} label={q.enabled ? "Disable" : "Enable"}>
                    <Check size={16} />
                  </IconButton>
                  <IconButton onClick={() => startEdit(q)} label="Edit question">
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton onClick={() => deleteItem(q.id)} danger label="Delete question">
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold">
                {q.options.map((opt, i) => (
                  <span key={i} className={`rounded-lg px-3 py-2 ${i === q.correctIndex ? "bg-nog-green-600/15 text-nog-green-800" : "bg-nog-black/5 text-nog-black/60"}`}>
                    {opt}
                  </span>
                ))}
              </div>
            </li>
          )
        )}
      </ul>
    </SectionCard>
  );
}

function BuzzForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Omit<BuzzQuestion, "id">;
  setDraft: React.Dispatch<React.SetStateAction<Omit<BuzzQuestion, "id">>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  function updateOption(i: number, value: string) {
    setDraft((prev) => {
      const options = [...prev.options] as BuzzQuestion["options"];
      options[i] = value;
      return { ...prev, options };
    });
  }
  return (
    <div className="mb-4 rounded-2xl border-2 border-nog-green-600 bg-nog-green-600/5 p-5">
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Question</label>
      <input
        value={draft.question}
        onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
        placeholder="Enter question text"
        className="mb-4 w-full rounded-xl border-2 border-nog-black/15 px-4 py-3 text-lg font-semibold outline-none focus:border-nog-green-600"
      />
      <label className="mb-1 block text-sm font-bold text-nog-black/60">
        Options (click the circle to mark the correct answer)
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {draft.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setDraft((prev) => ({ ...prev, correctIndex: i as BuzzQuestion["correctIndex"] }))}
              aria-label={`Mark option ${i + 1} correct`}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 cursor-pointer ${
                draft.correctIndex === i ? "border-nog-green-600 bg-nog-green-600 text-white" : "border-nog-black/20 text-transparent"
              }`}
            >
              <Check size={16} />
            </button>
            <input
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 rounded-xl border-2 border-nog-black/15 px-3 py-2 font-semibold outline-none focus:border-nog-green-600"
            />
          </div>
        ))}
      </div>
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

/* ------------------------------- Spin & Spark ----------------------------- */

const emptySpinDraft = (): Omit<SpinChallenge, "id"> => ({ type: "task", text: "", enabled: true });

function SpinSection() {
  const challenges = useSpinChallenges();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<SpinChallenge, "id">>(emptySpinDraft());

  function startEdit(c: SpinChallenge) {
    setEditingId(c.id);
    setDraft({ type: c.type, text: c.text, enabled: c.enabled });
  }
  function cancelEdit() {
    setEditingId(null);
    setDraft(emptySpinDraft());
  }
  function saveDraft() {
    if (!draft.text.trim()) return;
    if (editingId === "new") {
      setSpinChallenges([...challenges, { ...draft, id: `s-${Date.now()}` }]);
    } else {
      setSpinChallenges(challenges.map((c) => (c.id === editingId ? { ...draft, id: c.id } : c)));
    }
    cancelEdit();
  }
  function deleteItem(id: string) {
    setSpinChallenges(challenges.filter((c) => c.id !== id));
    if (editingId === id) cancelEdit();
  }
  function toggleEnabled(c: SpinChallenge) {
    setSpinChallenges(challenges.map((item) => (item.id === c.id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <SectionCard
      title="Spin & Spark Wheel"
      count={challenges.length}
      onAdd={() => {
        setEditingId("new");
        setDraft(emptySpinDraft());
      }}
      onReset={() => {
        if (confirm("Reset wheel segments to defaults?")) resetSpinChallenges();
      }}
    >
      {editingId === "new" && <SpinForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />}
      <ul className="flex flex-col gap-3">
        {challenges.map((c) =>
          editingId === c.id ? (
            <SpinForm key={c.id} draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />
          ) : (
            <li key={c.id} className={`flex items-center justify-between gap-4 rounded-2xl border-2 p-4 ${c.enabled ? "border-nog-black/10" : "border-nog-black/5 opacity-50"}`}>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-nog-gold-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-nog-gold-700">
                  {c.type}
                </span>
                <p className="font-semibold text-nog-black">{c.text}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <IconButton onClick={() => toggleEnabled(c)} active={c.enabled} label={c.enabled ? "Disable" : "Enable"}>
                  <Check size={16} />
                </IconButton>
                <IconButton onClick={() => startEdit(c)} label="Edit">
                  <Pencil size={16} />
                </IconButton>
                <IconButton onClick={() => deleteItem(c.id)} danger label="Delete">
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </li>
          )
        )}
      </ul>
    </SectionCard>
  );
}

function SpinForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Omit<SpinChallenge, "id">;
  setDraft: React.Dispatch<React.SetStateAction<Omit<SpinChallenge, "id">>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mb-4 rounded-2xl border-2 border-nog-green-600 bg-nog-green-600/5 p-5">
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Type</label>
      <div className="mb-4 flex gap-2">
        {(["question", "task", "blank"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setDraft((prev) => ({ ...prev, type: t }))}
            className={`rounded-xl px-4 py-2 text-sm font-bold capitalize cursor-pointer ${
              draft.type === t ? "bg-nog-green-700 text-white" : "border-2 border-nog-black/15 text-nog-black/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Text</label>
      <input
        value={draft.text}
        onChange={(e) => setDraft((prev) => ({ ...prev, text: e.target.value }))}
        placeholder="Enter challenge text"
        className="w-full rounded-xl border-2 border-nog-black/15 px-4 py-3 text-lg font-semibold outline-none focus:border-nog-green-600"
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

/* ------------------------------ Pipeline Puzzle ---------------------------- */

const PIECE_TYPES: PipelinePieceType[] = [
  "straight-pipe",
  "elbow-pipe",
  "valve",
  "pump",
  "storage-tank",
  "pressure-gauge",
  "compressor",
  "final-connector",
];

function PipelineSection() {
  const sequence = usePipelineSequence();

  function updateStep(i: number, type: PipelinePieceType) {
    setPipelineSequence(sequence.map((s, idx) => (idx === i ? type : s)));
  }
  function removeStep(i: number) {
    if (sequence.length <= 2) return;
    setPipelineSequence(sequence.filter((_, idx) => idx !== i));
  }
  function addStep() {
    setPipelineSequence([...sequence, "straight-pipe"]);
  }
  function moveStep(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sequence.length) return;
    const next = [...sequence];
    [next[i], next[j]] = [next[j], next[i]];
    setPipelineSequence(next);
  }

  return (
    <SectionCard
      title="Pipeline Route (Oil Well → Processing Facility)"
      onAdd={addStep}
      onReset={() => {
        if (confirm("Reset the pipeline route to the default sequence?")) resetPipelineSequence();
      }}
    >
      <ul className="flex flex-col gap-3">
        {sequence.map((type, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl border-2 border-nog-black/10 p-4">
            <span className="w-8 text-center text-lg font-black text-nog-black/40">{i + 1}</span>
            <select
              value={type}
              onChange={(e) => updateStep(i, e.target.value as PipelinePieceType)}
              className="flex-1 rounded-xl border-2 border-nog-black/15 px-4 py-3 text-lg font-semibold outline-none focus:border-nog-green-600"
            >
              {PIECE_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {PIPELINE_PIECE_LABELS[pt]}
                </option>
              ))}
            </select>
            <IconButton onClick={() => moveStep(i, -1)} label="Move up">
              <ArrowUp size={16} />
            </IconButton>
            <IconButton onClick={() => moveStep(i, 1)} label="Move down">
              <ArrowDown size={16} />
            </IconButton>
            <IconButton onClick={() => removeStep(i)} danger label="Remove step">
              <Trash2 size={16} />
            </IconButton>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

/* -------------------------------- Hazard Hunt ------------------------------ */

const emptyHazardDraft = (): Omit<Hazard, "id"> => ({ label: "", explanation: "", x: 50, y: 50, enabled: true });

function HazardSection() {
  const hazards = useHazards();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<Hazard, "id">>(emptyHazardDraft());

  function startEdit(h: Hazard) {
    setEditingId(h.id);
    setDraft({ label: h.label, explanation: h.explanation, x: h.x, y: h.y, enabled: h.enabled });
  }
  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyHazardDraft());
  }
  function saveDraft() {
    if (!draft.label.trim() || !draft.explanation.trim()) return;
    if (editingId === "new") {
      setHazards([...hazards, { ...draft, id: `h-${Date.now()}` }]);
    } else {
      setHazards(hazards.map((h) => (h.id === editingId ? { ...draft, id: h.id } : h)));
    }
    cancelEdit();
  }
  function deleteItem(id: string) {
    setHazards(hazards.filter((h) => h.id !== id));
    if (editingId === id) cancelEdit();
  }
  function toggleEnabled(h: Hazard) {
    setHazards(hazards.map((item) => (item.id === h.id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <SectionCard
      title="Hazard Hunt Hazards"
      count={hazards.length}
      onAdd={() => {
        setEditingId("new");
        setDraft(emptyHazardDraft());
      }}
      onReset={() => {
        if (confirm("Reset hazards to defaults?")) resetHazards();
      }}
    >
      <p className="mb-4 text-sm font-semibold text-nog-black/50">
        New hazards appear centered on the worksite scene by default.
      </p>
      {editingId === "new" && <HazardForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />}
      <ul className="flex flex-col gap-3">
        {hazards.map((h) =>
          editingId === h.id ? (
            <HazardForm key={h.id} draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />
          ) : (
            <li key={h.id} className={`flex items-start justify-between gap-4 rounded-2xl border-2 p-4 ${h.enabled ? "border-nog-black/10" : "border-nog-black/5 opacity-50"}`}>
              <div>
                <p className="font-bold text-nog-black">{h.label}</p>
                <p className="mt-1 text-sm font-medium text-nog-black/50">{h.explanation}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <IconButton onClick={() => toggleEnabled(h)} active={h.enabled} label={h.enabled ? "Disable" : "Enable"}>
                  <Check size={16} />
                </IconButton>
                <IconButton onClick={() => startEdit(h)} label="Edit">
                  <Pencil size={16} />
                </IconButton>
                <IconButton onClick={() => deleteItem(h.id)} danger label="Delete">
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </li>
          )
        )}
      </ul>
    </SectionCard>
  );
}

function HazardForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Omit<Hazard, "id">;
  setDraft: React.Dispatch<React.SetStateAction<Omit<Hazard, "id">>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mb-4 rounded-2xl border-2 border-nog-green-600 bg-nog-green-600/5 p-5">
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Hazard label</label>
      <input
        value={draft.label}
        onChange={(e) => setDraft((prev) => ({ ...prev, label: e.target.value }))}
        placeholder="e.g. Worker without helmet"
        className="mb-4 w-full rounded-xl border-2 border-nog-black/15 px-4 py-3 text-lg font-semibold outline-none focus:border-nog-green-600"
      />
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Explanation</label>
      <input
        value={draft.explanation}
        onChange={(e) => setDraft((prev) => ({ ...prev, explanation: e.target.value }))}
        placeholder="Why this is a hazard"
        className="w-full rounded-xl border-2 border-nog-black/15 px-4 py-3 font-semibold outline-none focus:border-nog-green-600"
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

/* ------------------------------ Pressure Point ------------------------------ */

const emptyScenarioDraft = (): Omit<Scenario, "id"> => ({
  bank: "player1",
  prompt: "",
  correctResponse: "",
  wrongOptions: ["", "", ""],
  enabled: true,
});

function ScenarioSection() {
  const scenarios = useScenarios();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<Scenario, "id">>(emptyScenarioDraft());

  function startEdit(s: Scenario) {
    setEditingId(s.id);
    setDraft({
      bank: s.bank,
      prompt: s.prompt,
      correctResponse: s.correctResponse,
      wrongOptions: [...s.wrongOptions] as Scenario["wrongOptions"],
      enabled: s.enabled,
    });
  }
  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyScenarioDraft());
  }
  function saveDraft() {
    if (!draft.prompt.trim() || !draft.correctResponse.trim() || draft.wrongOptions.some((o) => !o.trim())) return;
    if (editingId === "new") {
      setScenarios([...scenarios, { ...draft, id: `sc-${Date.now()}` }]);
    } else {
      setScenarios(scenarios.map((s) => (s.id === editingId ? { ...draft, id: s.id } : s)));
    }
    cancelEdit();
  }
  function deleteItem(id: string) {
    setScenarios(scenarios.filter((s) => s.id !== id));
    if (editingId === id) cancelEdit();
  }
  function toggleEnabled(s: Scenario) {
    setScenarios(scenarios.map((item) => (item.id === s.id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <SectionCard
      title="Pressure Point Scenarios (Player 1 / Player 2 sets)"
      count={scenarios.length}
      onAdd={() => {
        setEditingId("new");
        setDraft(emptyScenarioDraft());
      }}
      onReset={() => {
        if (confirm("Reset scenarios to defaults?")) resetScenarios();
      }}
    >
      {editingId === "new" && <ScenarioForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />}
      <ul className="flex flex-col gap-4">
        {scenarios.map((s) =>
          editingId === s.id ? (
            <ScenarioForm key={s.id} draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancelEdit} />
          ) : (
            <li key={s.id} className={`rounded-2xl border-2 p-5 ${s.enabled ? "border-nog-black/10" : "border-nog-black/5 opacity-50"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="mb-1 inline-block rounded-full bg-nog-black/5 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-nog-black/50">
                    {s.bank === "player1" ? "Player 1 set" : "Player 2 set"}
                  </span>
                  <p className="text-lg font-bold text-nog-black">{s.prompt}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <IconButton onClick={() => toggleEnabled(s)} active={s.enabled} label={s.enabled ? "Disable" : "Enable"}>
                    <Check size={16} />
                  </IconButton>
                  <IconButton onClick={() => startEdit(s)} label="Edit">
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton onClick={() => deleteItem(s.id)} danger label="Delete">
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
              <p className="mt-2 rounded-lg bg-nog-green-600/15 px-3 py-2 text-sm font-semibold text-nog-green-800">
                Best response: {s.correctResponse}
              </p>
            </li>
          )
        )}
      </ul>
    </SectionCard>
  );
}

function ScenarioForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Omit<Scenario, "id">;
  setDraft: React.Dispatch<React.SetStateAction<Omit<Scenario, "id">>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  function updateWrong(i: number, value: string) {
    setDraft((prev) => {
      const wrongOptions = [...prev.wrongOptions] as Scenario["wrongOptions"];
      wrongOptions[i] = value;
      return { ...prev, wrongOptions };
    });
  }
  return (
    <div className="mb-4 rounded-2xl border-2 border-nog-green-600 bg-nog-green-600/5 p-5">
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Question set</label>
      <div className="mb-4 flex gap-2">
        {(["player1", "player2"] as const).map((bank) => (
          <button
            key={bank}
            onClick={() => setDraft((prev) => ({ ...prev, bank }))}
            className={`rounded-xl px-4 py-2 text-sm font-bold cursor-pointer ${
              draft.bank === bank ? "bg-nog-green-700 text-white" : "border-2 border-nog-black/15 text-nog-black/60"
            }`}
          >
            {bank === "player1" ? "Player 1" : "Player 2"}
          </button>
        ))}
      </div>
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Scenario prompt</label>
      <input
        value={draft.prompt}
        onChange={(e) => setDraft((prev) => ({ ...prev, prompt: e.target.value }))}
        placeholder="Describe the emergency"
        className="mb-4 w-full rounded-xl border-2 border-nog-black/15 px-4 py-3 text-lg font-semibold outline-none focus:border-nog-green-600"
      />
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Correct response</label>
      <input
        value={draft.correctResponse}
        onChange={(e) => setDraft((prev) => ({ ...prev, correctResponse: e.target.value }))}
        placeholder="The best first response"
        className="mb-4 w-full rounded-xl border-2 border-nog-black/15 px-4 py-3 font-semibold outline-none focus:border-nog-green-600"
      />
      <label className="mb-1 block text-sm font-bold text-nog-black/60">Wrong options</label>
      <div className="grid gap-2 sm:grid-cols-3">
        {draft.wrongOptions.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => updateWrong(i, e.target.value)}
            placeholder={`Wrong option ${i + 1}`}
            className="rounded-xl border-2 border-nog-black/15 px-3 py-2 font-semibold outline-none focus:border-nog-green-600"
          />
        ))}
      </div>
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

/* --------------------------- Data & Leaderboard ----------------------------- */

function DataSection() {
  const leaderboard = useLeaderboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  function handleExport() {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nog-arena-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        importAllData(parsed);
        setImportMessage("Data imported successfully.");
      } catch {
        setImportMessage("Import failed — file was not valid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionCard title="Export / Import Data">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-2xl bg-nog-green-700 px-6 py-4 text-lg font-black text-white hover:bg-nog-green-800 cursor-pointer"
          >
            <Download size={20} /> Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-2xl border-2 border-nog-black/15 px-6 py-4 text-lg font-black text-nog-black/70 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer"
          >
            <Upload size={20} /> Import JSON
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
        </div>
        {importMessage && <p className="mt-4 text-base font-semibold text-nog-black/60">{importMessage}</p>}
      </SectionCard>

      <SectionCard
        title="Leaderboard"
        count={leaderboard.length}
        resetLabel="Clear Leaderboard"
        onReset={() => {
          if (confirm("Clear the leaderboard? This cannot be undone.")) clearLeaderboard();
        }}
      >
        {leaderboard.length === 0 ? (
          <p className="text-lg font-semibold text-nog-black/40">No games recorded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {leaderboard.map((entry: LeaderboardEntry) => (
              <li key={entry.id} className="flex items-center justify-between rounded-xl bg-nog-black/5 px-4 py-3">
                <span className="font-bold text-nog-black">
                  {entry.tie ? "Tie" : entry.winner} <span className="font-medium text-nog-black/50">— {entry.game}</span>
                </span>
                <span className="font-black text-nog-green-700">{entry.score} pts</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

/* --------------------------------- Shared UI --------------------------------- */

function FormActions({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="mt-4 flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 rounded-xl border-2 border-nog-black/10 px-4 py-2 font-bold text-nog-black/60 hover:border-red-500 hover:text-red-600 cursor-pointer"
      >
        <X size={18} /> Cancel
      </button>
      <button
        onClick={onSave}
        className="flex items-center gap-2 rounded-xl bg-nog-green-700 px-5 py-2 font-bold text-white hover:bg-nog-green-800 cursor-pointer"
      >
        <Check size={18} /> Save
      </button>
    </div>
  );
}

function IconButton({
  onClick,
  children,
  label,
  danger,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 cursor-pointer ${
        danger
          ? "border-nog-black/10 text-nog-black/60 hover:border-red-500 hover:text-red-600"
          : active === false
            ? "border-nog-black/10 text-nog-black/30 hover:border-nog-green-600 hover:text-nog-green-700"
            : active === true
              ? "border-nog-green-600 bg-nog-green-600/10 text-nog-green-700"
              : "border-nog-black/10 text-nog-black/60 hover:border-nog-green-600 hover:text-nog-green-700"
      }`}
    >
      {children}
    </button>
  );
}
