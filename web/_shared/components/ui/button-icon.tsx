import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";
import Icon from "@shared/components/ui/icon";

const buttonIconVariants = cva(
	[
		"inline-flex items-center justify-center whitespace-nowrap",
		"rounded-full",
		"transition-colors",
	],
	{
		variants: {
			variant: {
				primary: "bg-gray-100 hover:bg-gray-200",
				secondary: "bg-white hover:bg-gray-200",
			},
			size: {
				md: "w-9.5 h-9.5",
				sm: "w-8 h-8",
			},
		},
		defaultVariants: {
			variant: "secondary",
			size: "md",
		},
	},
);

export interface ButtonIconProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonIconVariants> {
	asChild?: boolean;
	styleClass?: string;
	icon: string;
	children?: React.ReactNode;
}

const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
	(
		{
			className,
			styleClass,
			icon,
			children,
			variant,
			size,
			asChild = false,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(
					"group",
					buttonIconVariants({ variant, size }),
					className,
				)}
				ref={ref}
				{...props}
			>
				<Icon
					className={cn("group-hover:filter-(--filter-primary)", styleClass)}
					src={`icons/${icon}.svg`}
				/>

				{children}
			</Comp>
		);
	},
);
ButtonIcon.displayName = "ButtonIcon";

export { ButtonIcon, buttonIconVariants };
