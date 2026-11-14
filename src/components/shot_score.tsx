import { getScoreColor } from "../utils/get_score_color";


export default function ShotScore({ score, isActive = false }: { score: number, isActive?: boolean }) {
	return <div
		className={`w-32 h-32 border rounded-full grid place-items-center text-4xl font-black ${isActive ? 'score-active' : getScoreColor(score)}`}
	>
		{score}
	</div>
}