import { cn } from "@lib/utils";

type Typography = {
	className?: string;
	children: React.ReactNode;
};

export function TypographyH1({ className, children }: Typography) {
	return <h1 className={cn("", className)}>{children}</h1>;
}

export function TypographyH2({ className, children }: Typography) {
	return <h1 className={cn("text-2xl mb-8", className)}>{children}</h1>;
}

export function TypographyH4({ className, children }: Typography) {
	return <h1 className={cn("font-bold mb-5", className)}>{children}</h1>;
}

// export function TypographyP({ className, children }: Typography) {
// 	return <p className={cn("text-custom-background", className)}>{children}</p>;
// }
