import { cn } from "@lib/utils";

type Typography = {
	className?: string;
	children: React.ReactNode;
};

export function TypographyP({ className, children }: Typography) {
	return (
		<p
			className={cn(
				"leading-7 [&:not(:first-child)]:mt-6 text-[0.9375rem]",
				className,
			)}
		>
			{children}
		</p>
	);
}

export function TypographyMuted({ className, children }: Typography) {
	return (
		// text-sm
		<p className={cn("text-muted-foreground text-[0.9375rem]", className)}>
			{children}
		</p>
	);
}
