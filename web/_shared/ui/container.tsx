import { cn } from "@lib/utils";

export function Container({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"max-w-(--breakpoint-container) mx-auto px-4 w-full",
				className,
			)}
		>
			{children}
		</div>
	);
}
