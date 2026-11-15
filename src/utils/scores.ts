export type Score = string | number;
export type Session = { date: string; data: [number, Score[]][] };

export function calculateTotal(values: Score[]) {
	return values.reduce<number>((total, score) => {
		if (score === "X") return total + 10;
		const numericScore = Number(score);
		return total + (Number.isNaN(numericScore) ? 0 : numericScore);
	}, 0);
}

export function getXHits(values: Score[]) {
	return values.filter((score) => score === "X").length;
}

export function getMisses(values: Score[]) {
	return values.filter((score) => score === "M").length;
}

export function getRunningTotal(scoreList: Map<number, Score[]>) {
	return Array.from(scoreList.values()).reduce(
		(total, scores) => total + calculateTotal(scores),
		0,
	);
}