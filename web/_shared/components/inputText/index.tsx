import Icon from "@shared/ui/icon";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const inputTextVariants = cva(
	[
		"w-full",
		"rounded-xl bg-custom-background-foreground",
		"outline-hidden shadow-[0_0_0_1pt_#ecf0f1] focus:shadow-[0_0_0_2pt_cornflowerblue] transition-shadow placeholder:text-[#97A5A8]",
	],
	{
		variants: {
			size: {
				sm: "px-[25px] h-[48px]",
				md: "px-[25px] h-[62px]",
			},
			hasError: {
				// true: "text-red-500 focus:shadow-[0_0_0_2pt_#ef4444]",
				true: "",
				false: "",
			},
		},
		defaultVariants: {
			size: "md",
			hasError: false,
		},
	},
);

type InputTextProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"size"
> & {
	styleClass?: string;
	icon?: string;
	size?: "md" | "sm";
	message?: string;
	hasError?: boolean;
};

export function InputText({
	className,
	styleClass,
	icon,
	size,
	message,
	hasError,
	...inputProps
}: InputTextProps) {
	return (
		<div className={className}>
			<div className="relative">
				<input
					className={clsx(inputTextVariants({ size, hasError }), styleClass)}
					{...inputProps}
				/>

				{icon && (
					<div className="absolute top-[calc(50%-12px)] right-[25px]">
						<Icon
							className="filter-custom-placeholder"
							src={`icons/${icon}.svg`}
						/>
					</div>
				)}
			</div>

			{message && (
				<div className="text-red-600 text-xs leading-none mt-2">{message}</div>
			)}
		</div>
	);
}
