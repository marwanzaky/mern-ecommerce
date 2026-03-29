"use client";

import { forwardRef, useEffect, useState } from "react";

import clsx from "clsx";
import { cva } from "class-variance-authority";

import { Chip } from "./chip";

const inputTagsVariants = cva(
	[
		"min-h-8 py-2 flex flex-wrap gap-2 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
	],
	{
		variants: {},
		defaultVariants: {},
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
				<div className={clsx(inputTagsVariants({}), className)}>
					{value.map((item) => (
						<Chip
							key={`input-tag-${item}`}
							onClick={() => {
								onChange(value.filter((i) => i !== item));
							}}
						>
							{item}
						</Chip>
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
