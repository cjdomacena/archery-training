import { getScoreColor } from "../utils/get_score_color";


export default function ShotScore({ score, isActive = false, size = "default" }: { score: string | number, isActive?: boolean, size?: "default" | "sm" }) {
	return <div
		className={` ${size === "default" ? "w-32 h-32 text-4xl" : "w-16 h-16 text-2xl"} border rounded-full grid place-items-center font-black ${isActive ? 'score-active' : getScoreColor(score)} `}
	>
		{score}
	</div>
}