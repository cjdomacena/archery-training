import { useId } from "react";
import ShotScore from "./shot_score";

export default function ShotScorePanel({ scores, activeRound = undefined }: { scores: number[], activeRound?: number }) {
	const id = useId();
	return <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
		{scores.map((score, i) => (
			<ShotScore
				score={score as number}
				key={`${id}-${score}-${i}`}
				isActive={activeRound === i}
			/>
		))}
	</div>

}