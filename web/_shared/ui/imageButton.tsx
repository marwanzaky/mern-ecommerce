import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";
import Image from "next/image";

const imageButtonVariants = cva(
	[
		"inline-flex items-center justify-center whitespace-nowrap",
		"bg-white w-9.5 h-9.5 rounded-full",
		"hover:bg-gray-200",
		"transition-colors",
	],
	{
		variants: {},
		defaultVariants: {},
	},
);

export interface ImageIconProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof imageButtonVariants> {
	asChild?: boolean;
	styleClass?: string;
	imgUrl: string;
}

const ImageButton = React.forwardRef<HTMLButtonElement, ImageIconProps>(
	({ className, styleClass, imgUrl, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(imageButtonVariants({}), className)}
				ref={ref}
				{...props}
			>
				<Image
					className="rounded-full filter-none!"
					src={imgUrl}
					width={24}
					height={24}
					alt="Icon"
				/>
			</Comp>
		);
	},
);
ImageButton.displayName = "ImageButton";

export { ImageButton, imageButtonVariants };
