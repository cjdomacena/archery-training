import { useEffect, useRef } from "react";
import { calculateTotal, getRunningTotal, type Session } from "../utils/scores";

export default function SessionsSidebar({
  sessions,
  open,
  onClose,
}: {
  sessions: Session[];
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="sessions-title"
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-sm border-l border-slate-800 bg-surface-raised p-0 text-slate-100 shadow-xl backdrop:bg-black/70"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
          <h2 id="sessions-title" className="scorecard-heading text-2xl text-white">Previous sessions</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-400">No saved sessions yet.</p>
          ) : sessions.map((session, index) => (
            <details key={`${session.date}-${index}`} className="border-b border-slate-800 py-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-200">
                {new Date(session.date).toLocaleString()} <span className="text-slate-400">&middot; {getRunningTotal(new Map(session.data))} points</span>
              </summary>
              <div className="mt-3 space-y-2">
                {session.data.map(([round, scores]) => (
                  <div key={round} className="text-sm text-slate-400">
                    <span className="font-medium text-slate-200">Round {round}</span>: {scores.join(", ")} <span className="text-slate-500">({calculateTotal(scores)})</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </dialog>
  );
}