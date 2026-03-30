"use client";

import { useMemo } from "react";
import { SellInputs } from "@hooks/use-sell";

import { InputCurrencyRange } from "@shared/components/ui/input-currency-range";
import { InputTags } from "@shared/components/ui/input-tags";
import { ImageToolbarButton } from "@shared/components/ui/lexical/image-tooltbar-button";
import { MyOnChangePlugin } from "@shared/components/ui/lexical/my-on-change-plugin";
import { LoadDescriptionPlugin } from "@shared/components/ui/lexical/load-description-plugin";
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

import ImageInput from "../../../_shared/components/ui/image-input";

import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@redux/services/categories-service";
import { Button } from "@shadcn/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";
import { textareaVariants } from "@shadcn/components/ui/textarea";

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
					<FieldGroup>
						<Field>
							<FieldLabel>Product Category</FieldLabel>
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
						</Field>
						<Field>
							<FieldLabel htmlFor="name">Product Name</FieldLabel>
							<Input
								id="name"
								type="text"
								{...register("name", {
									required: "This field is required.",
									minLength: { value: 2, message: "Name is too short." },
									maxLength: { value: 80, message: "Name is too long." },
								})}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="name">Product Description</FieldLabel>
							<div className="relative">
								<LexicalComposer initialConfig={initialConfig}>
									<RichTextPlugin
										contentEditable={
											<ContentEditable
												className={cn(
													textareaVariants({}),
													"block overflow-y-scroll min-h-8 max-h-32",
												)}
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
						</Field>

						<Field>
							<FieldLabel>Product Price</FieldLabel>
							<Controller
								name="priceRangeUsd"
								control={control}
								rules={{
									validate: ({ min, max }) =>
										min != null || max != null || "This field is required.",
								}}
								render={({ field }) => (
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
									/>
								)}
							/>
						</Field>
						<Field>
							<FieldLabel>Product Tags</FieldLabel>
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
						</Field>
						<Field>
							<div className="grid grid-cols-5 gap-4">
								{Array.from({ length: 10 }).map((_, index) => (
									<Controller
										key={index}
										name={`images.${index}`}
										control={control}
										render={({ field }) => (
											<ImageInput
												value={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
								))}
							</div>
						</Field>
					</FieldGroup>

					<DialogFooter>
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
