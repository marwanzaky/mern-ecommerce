import Icon from "@shared/ui/icon";

import { cva } from "class-variance-authority";

import { cn } from "@lib/utils";

export const textareaVariants = cva(
	[
		"flex w-full h-52 max-h-96 min-h-[62px] px-[25px] py-5 leading-6",
		"rounded-xl bg-custom-background-foreground placeholder:text-[#97A5A8]",
		"outline-hidden shadow-[0_0_0_1pt_#ecf0f1] focus:shadow-[0_0_0_2pt_cornflowerblue] transition-shadow",
	],
	{
		variants: {
			hasError: {
				true: "",
				false: "",
			},
		},
		defaultVariants: {
			hasError: false,
		},
	},
);

type TextareaProps = Omit<React.ComponentProps<"textarea">, "size"> & {
	styleClass?: string;
	icon?: string;
	message?: string;
	hasError?: boolean;
};

export function Textarea({
	className,
	styleClass,
	icon,
	message,
	hasError,
	...inputProps
}: TextareaProps) {
	return (
		<div className={className}>
			<div className="relative">
				<textarea
					className={cn(textareaVariants({ hasError }), styleClass)}
					{...inputProps}
				/>

				{icon && (
					<div className="absolute top-[calc(31px-12px)] right-[25px]">
						<Icon
							className="filter-custom-placeholder"
							src={`icons/${icon}.svg`}
						/>
					</div>
				)}
			</div>

			{message && <span className="text-red-600 text-xs">{message}</span>}
		</div>
	);
}
