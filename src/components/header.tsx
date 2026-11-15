export default function Header() {
	return <header className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-slate-800/80 pb-8">
		<div className="space-y-3">
			<span className="block h-1 w-10 bg-amber-400" aria-hidden="true" />
			<h1 className="scorecard-heading text-4xl text-white sm:text-5xl">
				Archery Scorecard
			</h1>
		</div>

		<div className="flex items-center gap-2 pb-1">
			<span className="size-2 rounded-full bg-emerald-400" />
			<span className="text-sm text-slate-400">
				Session in progress
			</span>
		</div>


	</header>
}