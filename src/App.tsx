
import { useCallback, useEffect, useState } from "react";
import ScoreButton from "./components/score_button";
import Header from "./components/header";
import PreviousRounds from "./components/previous_rounds";
import SessionsSidebar from "./components/sessions_sidebar";
import ShotScorePanel from "./components/shot_score_panel";
import useLocalStorage from "./hooks/use_local_storage";
import { calculateTotal, type Score, type Session } from "./utils/scores";

const SCORES = Array.from({ length: 10 }, (_, index) => 10 - index);

function App() {
  const { get, set } = useLocalStorage({ key: "archery-session" });
  const [sessions, setSessions] = useState<Session[]>(() => {
    try
    {
      const saved = get();
      if (Array.isArray(saved)) return saved as Session[];
      if (saved && typeof saved === "object" && "date" in saved && "data" in saved)
      {
        return [saved as Session];
      }
    } catch
    {
      return [];
    }
    return [];
  });
  const [sessionsOpen, setSessionsOpen] = useState(false);

  // Session states
  const [arrowCount, setArrowCount] = useState(6);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 0);

  // Active round states
  const [activeShotCount, setActiveShotCount] = useState(0);
  const [activeRound, setActiveRound] = useState(1);
  const [activeRoundScores, setActiveRoundScores] =
    useState<Score[]>(
      Array.from({ length: arrowCount }, () => 0),
    );
  const [activeRunningScoreList, setActiveRunningScoreList] = useState<Map<number, Score[]>>(new Map());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const totalShots = Array.from(activeRunningScoreList.values()).reduce(
    (total, scores) => total + scores.length,
    activeShotCount,
  );

  function saveSession() {
    const rounds = Array.from(activeRunningScoreList.entries());
    if (activeShotCount > 0)
    {
      rounds.push([activeRound, activeRoundScores.slice(0, activeShotCount)]);
    }
    if (rounds.length === 0) return;

    const updatedSessions = [{ date: new Date().toISOString(), data: rounds }, ...sessions];
    set(updatedSessions);
    setSessions(updatedSessions);
    setActiveRunningScoreList(new Map());
    setActiveRound(1);
    setActiveShotCount(0);
    setActiveRoundScores(Array.from({ length: arrowCount }, () => 0));
  }

  return (
    <>
      {isScrolled && <div className="fixed inset-x-0 top-0 z-50 space-y-4 bg-surface-raised p-6 md:hidden">
        <div className="flex justify-end">
          <button type="button" className="btn-secondary" onClick={() => setSessionsOpen(true)}>
            Sessions
          </button>
        </div>
        <div className="grow">
          <ShotScorePanel.Small scores={activeRoundScores} activeRound={activeShotCount} />

        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(activeShotCount / arrowCount) * 100}%` }}
          />
        </div>
      </div>}
      <nav aria-label="Main navigation" className="border-b border-slate-800 bg-surface-raised">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <span className="text-sm font-semibold text-white">Archery Scorecard</span>
          <button type="button" className="btn-secondary" onClick={() => setSessionsOpen(true)}>
            Sessions
          </button>
        </div>
      </nav>
      <SessionsSidebar sessions={sessions} open={sessionsOpen} onClose={() => setSessionsOpen(false)} />
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
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 pb-5">
              <h2 className="scorecard-heading text-3xl text-white">
                Round {activeRunningScoreList.size + 1}
              </h2>
              <span className="text-sm font-medium text-emerald-400">In progress</span>
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
              <ShotScorePanel scores={activeRoundScores} activeRound={activeShotCount} />
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
            <div className="border-b border-slate-800 pb-4">
              <h2 className="scorecard-heading text-3xl text-white">
                Mark your shot
              </h2>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
              <ScoreButton
                handleClick={() => handleAddShotScoreToRound("X")}
                label="X"
                value="X"
              />

              {SCORES.map((score) => (
                <ScoreButton
                  key={score}
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



          <PreviousRounds
            rounds={activeRunningScoreList}
            totalShots={totalShots}
            canSave={activeRunningScoreList.size > 0 || activeShotCount > 0}
            onSave={saveSession}
          />

        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800/80 pt-6 text-center">
          <p className="text-xs text-slate-600">
            Archery Scorecard · Training Session
          </p>
        </footer>

      </main>
    </>
  );
}

export default App;
