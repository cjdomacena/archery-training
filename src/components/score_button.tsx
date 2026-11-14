import { getScoreColor } from "../utils/get_score_color";

type ScoreButtonProps = {
	handleClick: () => void;
	value: string | number;
	label: string | number;
};

export default function ScoreButton({
	handleClick,
	value,
	label,
}: ScoreButtonProps) {
	return (
		<button
			className={`px-12 py-12 rounded-4xl text-4xl font-bold ${getScoreColor(value)}`}
			onClick={handleClick}>
			{label}
		</button>
	);
}
