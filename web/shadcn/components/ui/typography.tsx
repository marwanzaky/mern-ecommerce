import { cn } from "@lib/utils";

type Typography = {
	className?: string;
	children: React.ReactNode;
};

export function TypographyH1({ className, children }: Typography) {
	return (
		<h1
			className={cn(
				"scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
				className,
			)}
		>
			{children}
		</h1>
	);
}

export function TypographyH3({ className, children }: Typography) {
	return (
		<h3
			className={cn(
				"scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
		>
			{children}
		</h3>
	);
}

export function TypographyH4({ className, children }: Typography) {
	return (
		<h4
			className={cn(
				"scroll-m-20 text-xl font-semibold tracking-tight",
				className,
			)}
		>
			{children}
		</h4>
	);
}

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
