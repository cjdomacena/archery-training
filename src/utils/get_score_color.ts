export const getScoreColor = (score: string | number) => {
	if (score === "X" || score === 10 || score === 9)
		return "score-gold";
	if (typeof score === "number" && score >= 7 && score <= 8) return "score-red";
	if (typeof score === "number" && score >= 5 && score <= 6) return "score-blue";
	if (typeof score === "number" && score >= 3 && score <= 4) return "score-black";
	if (typeof score === "number" && score >= 1 && score <= 2) return "score-white";
	if (score === "M") return "score-miss";

	return "score-cell";
};