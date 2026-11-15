import { useId, type ReactNode } from "react";

// World Archery 10-ring face, outermost ring first.
const RINGS = [
	{ r: 1.0, fill: "#FFFFFF" },
	{ r: 0.9, fill: "#FFFFFF" },
	{ r: 0.8, fill: "#111827" },
	{ r: 0.7, fill: "#111827" },
	{ r: 0.6, fill: "#3B82F6" },
	{ r: 0.5, fill: "#3B82F6" },
	{ r: 0.4, fill: "#EF4444" },
	{ r: 0.3, fill: "#EF4444" },
	{ r: 0.2, fill: "#EAB308" },
	{ r: 0.1, fill: "#EAB308" },
	{ r: 0.05, fill: "#EAB308" }, // X ring
];

type TargetProps = {
	/** Arrow markers, rendered inside the merge filter group. */
	children?: ReactNode;
};

export default function Target({ children }: TargetProps) {
	// Unique per instance so multiple targets on one page don't share a filter id.
	const filterId = `arrow-merge-${useId().replace(/:/g, "")}`;

	return (
		<svg
			viewBox="-1.08 -1.08 2.16 2.16"
			className="pointer-events-none h-full w-full"
			style={{
				transform: "translate(0px, 0px) scale(1)",
				transformOrigin: "center center",
				transition: "transform 0.1s ease-out",
			}}
		>
			{RINGS.map(({ r, fill }) => (
				<circle
					key={r}
					cx={0}
					cy={0}
					r={r}
					fill={fill}
					stroke="#9CA3AF"
					strokeWidth={0.005}
				/>
			))}

			{/* Dashed X-ring outline */}
			<circle
				cx={0}
				cy={0}
				r={0.05}
				fill="none"
				stroke="#D1D5DB"
				strokeWidth={0.002}
				strokeDasharray="0.01 0.01"
			/>

			<defs>
				<filter
					id={filterId}
					x="-20%"
					y="-20%"
					width="140%"
					height="140%"
					colorInterpolationFilters="sRGB"
				>
					<feGaussianBlur in="SourceGraphic" stdDeviation={0.006} />
					<feColorMatrix
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12"
					/>
				</filter>
			</defs>

			<g filter={`url(#${filterId})`} shapeRendering="geometricPrecision">
				{children}
			</g>
		</svg>
	);
}