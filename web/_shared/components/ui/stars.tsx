import { cn } from "@lib/utils";
import { Star, StarHalf } from "lucide-react";

type StarsProps = {
	className?: string;
	total?: number;
	size?: number;
	value?: number;
	displayTotal?: boolean;
};

export default function Stars({
	className,
	total,
	size = 16,
	value = 5,
	displayTotal = true,
}: StarsProps) {
	const stars = [];

	for (let i = 0; i < Math.floor(value); i++)
		stars.push(<Star key={`star-${i}`} size={size} className="fill-primary" />);

	if (value % 1 !== 0)
		stars.push(
			<div key={`half-star`} className="relative">
				<Star size={size} />
				<StarHalf size={size} className="absolute top-0 fill-primary" />
			</div>,
		);

	for (let i = 0; i < 5 - Math.ceil(value); i++)
		stars.push(
			<Star key={`empty-star-${i}`} size={size} className="w-4 h-4" />,
		);

	return (
		<div className={cn("flex items-center gap-x-1", className)}>
			<div className="flex filter-(--filter-primary) gap-px">{stars}</div>
			<div
				className="leading-none text-primary font-medium"
				style={{ fontSize: size }}
			>
				{displayTotal ? `(${total})` : ""}
			</div>
		</div>
	);
}
