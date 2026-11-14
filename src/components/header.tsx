export default function Header() {
	return <header className="mb-12 flex flex-col gap-3 border-b border-slate-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
		<div className="space-y-2">
			<span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
				Training session
			</span>
			<h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
				Archery Scorecard
			</h1>
			<p className="text-sm text-slate-500">
				Track your shots. Monitor your progress.
			</p>
		</div>

		<div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-surface px-4 py-3">
			<span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
			<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
				Session in progress
			</span>
		</div>


	</header>
}