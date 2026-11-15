import ShotScorePanel from "./shot_score_panel";
import { calculateTotal, getMisses, getRunningTotal, getXHits, type Score } from "../utils/scores";

export default function PreviousRounds({
  rounds,
  totalShots,
  canSave,
  onSave,
}: {
  rounds: Map<number, Score[]>;
  totalShots: number;
  canSave: boolean;
  onSave: () => void;
}) {
  const previousRounds = Array.from(rounds.entries()).reverse();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 pb-4">
        <h2 className="scorecard-heading text-3xl text-white">Rounds so far</h2>
        <span className="pb-1 text-sm tabular-nums text-slate-400">
          {previousRounds.length} completed
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="space-y-1 w-full">
          <span className="section-label">Score</span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Current total: {getRunningTotal(rounds)}
              </h2>
              <p className="text-sm text-slate-400">Total arrows shot: {totalShots}</p>
            </div>
            <button className="btn-primary" onClick={onSave} disabled={!canSave}>End & Save session</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {previousRounds.map(([round, scores]) => (
          <div key={round} className="card space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Round {round}</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Completed</span>
            </div>
            <ShotScorePanel scores={scores} />
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Round total</span>
              <span className="text-xl font-bold tabular-nums text-white">{calculateTotal(scores)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">X hits</span>
              <span className="text-xl font-bold tabular-nums text-white">{getXHits(scores)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Misses</span>
              <span className="text-xl font-bold tabular-nums text-white">{getMisses(scores)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}