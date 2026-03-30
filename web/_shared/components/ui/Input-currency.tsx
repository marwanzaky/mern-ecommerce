import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@shadcn/components/ui/input";

type InputCurrencyProps = {
	value?: number | undefined;
	onChange: (val: number | undefined) => void;
	onBlur?: (val: number | undefined) => void;
	placeholder?: string;
	required?: boolean;
};

export function InputCurrency({
	value,
	onChange,
	onBlur,
	placeholder,
	required,
}: InputCurrencyProps) {
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		setInputValue(value !== undefined ? value.toFixed(2) : "");
	}, [value]);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		const value = parseFloat(e.target.value);

		if (!isNaN(value)) {
			const newValue = Math.round(value * 100) / 100;
			onChange(newValue);
			onBlur?.(newValue);
		} else if (e.target.value === "") {
			onChange(undefined);
			onBlur?.(undefined);
		}
	};

	return (
		<div className="relative">
			<DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				className="pl-8"
				type="number"
				step="0.01"
				min={0}
				placeholder={placeholder}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onBlur={handleBlur}
				required={required}
			/>
		</div>
	);
}
