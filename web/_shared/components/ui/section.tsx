import { cn } from "@lib/utils";

export type SectionProps = {
	className?: string;
	children?: React.ReactNode;
};

export function Section({ className, children }: SectionProps) {
	return (
		<section className={cn("py-4 lg:py-8", className)}>{children}</section>
	);
}
