
import { useCallback, useEffect, useState } from "react";
import ScoreButton from "./components/score_button";
import Header from "./components/header";
import ShotScorePanel from "./components/shot_score_panel";
import useLocalStorage from "./hooks/use_local_storage";

const SCORES = Array.from({ length: 10 }).map(
  (_, i) => 10 - i,
);

function calculateTotal(values: (string | number)[]) {
  let total = 0;
  values.forEach((score) => {
    if (score === 'X')
    {
      total += 10;
    }
    if (!Number.isNaN(Number(score)))
    {
      total += Number(score)
    }
  })
  return total;
}

function getXHits(values: string[]) {
  return values.reduce((c, v) => {
    if (v === 'X')
    {
      c += 1;
    }
    return c;
  }, 0)
}

function getMisses(values: string[]) {
  return values.reduce((c, v) => {
    if (v === 'M')
    {
      c += 1;
    }
    return c;
  }, 0)
}

function getRunningTotal(scoreList: Map<number, (string | number)[]>) {
  let runningTotal = 0;
  scoreList.forEach((val) => {
    runningTotal += calculateTotal(val)
  });
  return runningTotal;
}

function App() {
  // Session states
  const [arrowCount, setArrowCount] = useState(6);

  // Active round states
  const [activeShotCount, setActiveShotCount] = useState(0);
  const [activeRound, setActiveRound] = useState(1);
  const [activeRoundScores, setActiveRoundScores] =
    useState<(string | number)[]>(
      Array.from({ length: arrowCount }, () => 0),
    );
  const [activeRunningScoreList, setActiveRunningScoreList] = useState(new Map());

  function endRound() {
    setActiveRunningScoreList((prev) => {
      const mapCopy = new Map(prev);
      mapCopy.set(activeRound, activeRoundScores);
      return mapCopy;
    })
  }

  function resetToNewRound() {
    endRound();
    setActiveRound(prev => prev + 1);
    setActiveRoundScores(Array.from({ length: arrowCount }, () => 0));
    setActiveShotCount(0);
  }

  const handleAddShotScoreToRound = useCallback((value: string | number) => {
    setActiveRoundScores(prev => {
      const updatedCount = [...prev];
      updatedCount[activeShotCount] = value;
      return updatedCount;
    });
    setActiveShotCount(prev => prev + 1);
  }, [activeShotCount])

  useEffect(() => {
    if (activeShotCount === arrowCount)
    {
      resetToNewRound()
    }
  }, [activeShotCount]);

  const previousRounds = Array.from(activeRunningScoreList.keys()).reverse();

  const { set, get } = useLocalStorage({ key: 'archery-session' });
  console.log(get())

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8 lg:py-14">

      {/* Header */}
      <Header />
      <details className="mb-12">
        <summary className="cursor-pointer text-sm font-medium text-slate-300">
          Session settings
        </summary>

        <section className="card mt-4 mb-12 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Session settings
            </h2>
            <p className="text-sm text-slate-500">
              Configure your shooting session
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Arrows per round
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-[#0d111b] p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xl">
                🎯
              </div>

              <div className="min-w-0 flex-1">
                <input
                  type="number"
                  min="1"
                  value={arrowCount}
                  className="w-full border-0 bg-transparent p-0 text-xl font-bold text-white focus:ring-0"
                  onChange={(e) => {
                    const newCount = Number(e.currentTarget.value);
                    setArrowCount(newCount);
                    setActiveRoundScores(
                      Array.from({ length: newCount }, () => 0)
                    );
                  }}
                />
                <p className="text-xs text-slate-500">
                  Shots in each round
                </p>
              </div>
            </div>
          </div>
        </section>
      </details>

      <div className="flex flex-col gap-12">
        {/* Active Round */}
        <section className="card space-y-8">
          {/* Round Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="section-label">
                Current session
              </span>
              <h2 className="text-2xl font-bold text-white">
                Active round
              </h2>
            </div>

            <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2">
              <span className="text-sm font-semibold text-indigo-300">
                Round {activeRunningScoreList.size + 1}
              </span>
            </div>
          </div>

          {/* Shot Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="section-label">
                Shot progress
              </span>
              <span className="text-sm font-semibold tabular-nums text-slate-300">
                {activeShotCount} / {arrowCount}
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${(activeShotCount / arrowCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Shot Scores */}
          <div className="space-y-4">
            <span className="section-label">
              Individual arrow scores
            </span>
            <ShotScorePanel scores={activeRoundScores as number[]} activeRound={activeShotCount} />
          </div>

          {/* Round Total */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0b101a] px-5 py-4">
            <div className="space-y-1">
              <span className="section-label">
                Round total
              </span>
              <p className="text-xs text-slate-500">
                Combined score
              </p>
            </div>

            <span className="text-3xl font-bold tabular-nums tracking-tight text-white">
              {calculateTotal(activeRoundScores)}
            </span>
          </div>

        </section>

        {/* Scoring Controls */}
        <section className="space-y-5">
          <div className="space-y-1">
            <span className="section-label">
              Score input
            </span>
            <h2 className="text-xl font-semibold text-white">
              Record your shot
            </h2>
            <p className="text-sm text-slate-500">
              Select the score corresponding to your arrow.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
            <ScoreButton
              handleClick={() => handleAddShotScoreToRound("X")}
              label="X"
              value="X"
            />

            {SCORES.map((score) => (
              <ScoreButton
                handleClick={() => handleAddShotScoreToRound(score)}
                label={score}
                value={score}
              />
            ))}

            <ScoreButton
              handleClick={() => handleAddShotScoreToRound("M")}
              label="M"
              value="M"
            />
          </div>

        </section>



        {/* Previous Rounds */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="section-label">
                Session history
              </span>
              <h2 className="text-xl font-semibold text-white">
                Previous rounds
              </h2>
            </div>

            <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400">
              {previousRounds.length} completed
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1 w-full">
              <span className="section-label">
                Score
              </span>
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Current total: {getRunningTotal(activeRunningScoreList)}
                </h2>
                <button className="btn-primary" onClick={() => {
                  set({
                    date: new Date(),
                    data: Array.from(activeRunningScoreList.entries())
                  })
                }}>End & Save session</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {previousRounds.map((key) => (
              <div className="card space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">
                    Round {key}
                  </span>

                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Completed
                  </span>
                </div>

                <ShotScorePanel scores={activeRunningScoreList.get(key)} />

                {/* Round total */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Round total
                  </span>

                  <span className="text-xl font-bold tabular-nums text-white">
                    {calculateTotal(activeRunningScoreList.get(key))}
                  </span>

                </div>

                {/* Hit count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    X hits
                  </span>
                  <span className="text-xl font-bold tabular-nums text-white">
                    {getXHits(activeRunningScoreList.get(key))}
                  </span>

                </div>

                {/* Misses */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Misses
                  </span>
                  <span className="text-xl font-bold tabular-nums text-white">
                    {getMisses(activeRunningScoreList.get(key))}
                  </span>

                </div>
              </div>
            ))}
          </div>

        </section>

      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 pt-6 text-center">
        <p className="text-xs text-slate-600">
          Archery Scorecard · Training Session
        </p>
      </footer>

    </main>
  );
}

export default App;
