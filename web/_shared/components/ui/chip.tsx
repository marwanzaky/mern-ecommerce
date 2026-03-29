import { Badge } from "@shadcn/components/ui/badge";
import { X } from "lucide-react";

export type ChipProps = {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

export function Chip({ children, onClick }: ChipProps) {
	return (
		<Badge
			role="button"
			variant="secondary"
			className="space-x-1 shrink-0 cursor-pointer"
			onClick={onClick}
		>
			{children}

			<X />
		</Badge>
	);
}
