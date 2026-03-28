"use client";

import { forwardRef, useEffect, useState } from "react";

import clsx from "clsx";
import { cva } from "class-variance-authority";

import Icon from "@shared/ui/icon";

import { Badge } from "./badge";

const inputTagsVariants = cva(
	[
		"w-full flex flex-wrap gap-2",
		"rounded-xl bg-custom-background-foreground",
		"outline-hidden shadow-[0_0_0_1pt_#ecf0f1] focus-within:shadow-[0_0_0_2pt_cornflowerblue] transition-shadow",
	],
	{
		variants: {
			size: {
				sm: "px-[25px] min-h-[48px]",
				md: "px-[25px] min-h-[62px] py-4",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type InputTagsProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"value" | "onChange"
> & {
	value: string[];
	onChange: React.Dispatch<React.SetStateAction<string[]>>;
	message?: string;
};

const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
	({ className, value, onChange, message, ...inputProps }, ref) => {
		const [pendingDataPoint, setPendingDataPoint] = useState("");

		useEffect(() => {
			if (pendingDataPoint.includes(",")) {
				const newDataPoints = new Set([
					...value,
					...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
				]);
				onChange(Array.from(newDataPoints));
				setPendingDataPoint("");
			}
		}, [pendingDataPoint, onChange, value]);

		const addPendingDataPoint = () => {
			if (pendingDataPoint) {
				const newDataPoints = new Set([...value, pendingDataPoint]);
				onChange(Array.from(newDataPoints));
				setPendingDataPoint("");
			}
		};

		return (
			<div>
				<div className={clsx(inputTagsVariants({ size: "md" }), className)}>
					{value.map((item) => (
						<Badge className="flex gap-1 hover:bg-gray-300" key={item}>
							{item}

							<Icon
								className="cursor-pointer"
								onClick={() => {
									onChange(value.filter((i) => i !== item));
								}}
								src="icons/close.svg"
								size={16}
							/>
						</Badge>
					))}

					<input
						ref={ref}
						className="flex-1 outline-hidden bg-transparent leading-none"
						value={pendingDataPoint}
						onChange={(e) => setPendingDataPoint(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === ",") {
								e.preventDefault();
								addPendingDataPoint();
							} else if (
								e.key === "Backspace" &&
								pendingDataPoint.length === 0 &&
								value.length > 0
							) {
								e.preventDefault();
								onChange(value.slice(0, -1));
							}
						}}
						{...inputProps}
					/>
				</div>
				{message && (
					<div className="text-red-600 text-xs leading-none mt-2">
						{message}
					</div>
				)}
			</div>
		);
	},
);

InputTags.displayName = "InputTags";

export { InputTags };
