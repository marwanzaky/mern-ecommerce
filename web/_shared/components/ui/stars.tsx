import { cn } from "@lib/utils";
import Icon from "./icon";

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
		stars.push(<Icon src="icons/star.svg" key={`Star ${i}`} size={size} />);

	if (value % 1 !== 0)
		stars.push(
			<Icon src="icons/star_half.svg" key={"Star half"} size={size} />,
		);

	for (let i = 0; i < 5 - Math.ceil(value); i++)
		stars.push(
			<Icon src="icons/star_border.svg" key={`Star border ${i}`} size={size} />,
		);

	return (
		<div className={cn("flex items-center gap-x-0.5", className)}>
			<div className="flex filter-(--filter-primary)">{stars}</div>
			<div
				className="leading-none text-primary font-medium"
				style={{ fontSize: size }}
			>
				{displayTotal ? `(${total})` : ""}
			</div>
		</div>
	);
}
