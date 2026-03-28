"use client";

import { useMemo } from "react";
import { SellInputs } from "@hooks/useSell";

import { InputCurrencyRange } from "@shared/components/InputCurrencyRange";
import { InputText } from "@shared/components/inputText";
import { textareaVariants } from "@shared/components/textarea";
import { InputTags } from "@shared/components/inputTags";
import { ImageToolbarButton } from "@shared/components/lexical/imageTooltbarButton";
import { MyOnChangePlugin } from "@shared/components/lexical/myOnChangePlugin";
import { LoadDescriptionPlugin } from "@shared/components/lexical/loadDescriptionPlugin";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shadcn/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shadcn/components/ui/select";
import {
	Control,
	Controller,
	FieldErrors,
	FormState,
	UseFormRegister,
} from "react-hook-form";

import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { cn } from "@lib/utils";

import ImageInput from "./imageInput";

import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@redux/services/categoriesService";
import { Button } from "@shadcn/components/ui/button";

type ProductDialogProps = {
	// React-form-hook
	initialConfig: InitialConfigType;
	control: Control<SellInputs, any, SellInputs>;
	errors: FieldErrors<SellInputs>;
	register: UseFormRegister<SellInputs>;
	formState: FormState<SellInputs>;
	description: string;
	PluginOnChange: (html: string, isEmpty: boolean) => void;

	// Dialog
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dialogHeader: string;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	submitButtonText: string;
	injectLoadDescriptionPlugin?: boolean;
	cancelButtonText?: string;
	cancelButtonAction?: () => void;
};

export function ProductDialog({
	// React-form-hook
	initialConfig,
	control,
	errors,
	register,
	formState,
	description,
	PluginOnChange,

	// Dialog
	open,
	onOpenChange,
	dialogHeader,
	onSubmit,
	injectLoadDescriptionPlugin,
	cancelButtonText,
	submitButtonText,
	cancelButtonAction,
}: ProductDialogProps) {
	const { data } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const options = useMemo(
		() => data?.flatMap((item) => [...item.children, item]),
		[data],
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{dialogHeader}</DialogTitle>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<Controller
						name="category"
						control={control}
						render={({ field }) => {
							return (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{options?.map((item) => (
												<SelectItem
													key={`select-item-${item.name}`}
													value={item.id}
												>
													{item.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							);
						}}
					/>

					<InputText
						type="text"
						id="name"
						placeholder="Product Name"
						icon="inventory_2"
						message={errors.name?.message}
						{...register("name", {
							required: "This field is required.",
							minLength: { value: 2, message: "Name is too short." },
							maxLength: { value: 80, message: "Name is too long." },
						})}
					/>

					<div className="relative">
						<LexicalComposer initialConfig={initialConfig}>
							<RichTextPlugin
								contentEditable={
									<ContentEditable
										className={cn(
											textareaVariants({}),
											"block overflow-y-scroll",
										)}
										aria-placeholder="Product Description"
										placeholder={
											<div className="absolute top-5 left-[25px] text-gray-400">
												Product Description
											</div>
										}
									/>
								}
								ErrorBoundary={LexicalErrorBoundary}
							/>
							<HistoryPlugin />
							<ImageToolbarButton />
							<MyOnChangePlugin onChange={PluginOnChange} />
							{injectLoadDescriptionPlugin && (
								<LoadDescriptionPlugin html={description} />
							)}

							<div className="mt-2 text-red-600 text-xs">
								{errors.description?.message}
							</div>

							<input
								type="hidden"
								{...register("description", {
									required: "This field is required.",
								})}
							/>
						</LexicalComposer>
					</div>

					<Controller
						name="priceRangeUsd"
						control={control}
						rules={{
							validate: ({ min, max }) =>
								min != null || max != null || "This field is required.",
						}}
						render={({ field, fieldState }) => (
							<InputCurrencyRange
								minPlaceholder="Price"
								maxPlaceholder="Compare Price"
								minValue={field.value.min}
								maxValue={field.value.max}
								onMinChange={(min) =>
									field.onChange({
										min,
										max:
											field.value.max == null
												? min
												: Math.max(min || 0, field.value.max),
									})
								}
								onMaxChange={(max) =>
									field.onChange({
										min:
											field.value.min == null
												? max
												: Math.min(field.value.min, max || 0),
										max,
									})
								}
								message={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						name="tags"
						control={control}
						rules={{
							validate: (value) =>
								value.length > 0 || "This field is required.",
						}}
						render={({ field, fieldState }) => (
							<InputTags
								{...field}
								placeholder="Enter Tags"
								message={fieldState.error?.message}
								value={field.value ?? []}
							/>
						)}
					/>
					<div className="grid grid-cols-5 gap-4">
						{Array.from({ length: 10 }).map((_, index) => (
							<Controller
								key={index}
								name={`images.${index}`}
								control={control}
								render={({ field }) => (
									<ImageInput value={field.value} onChange={field.onChange} />
								)}
							/>
						))}
					</div>

					<DialogFooter className="gap-2">
						{cancelButtonText && (
							<Button
								variant="outline"
								onClick={cancelButtonAction}
								type="button"
							>
								{cancelButtonText}
							</Button>
						)}

						<Button type="submit" disabled={!formState.isDirty}>
							{submitButtonText}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
