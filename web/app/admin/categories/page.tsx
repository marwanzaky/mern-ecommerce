"use client";

import { Column, Table } from "@shared/components/table";
import { Section } from "@shared/components/section";
import { TypographyH4, TypographyP } from "@shared/shadcn/typography";
import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "@redux/store";

import { useMemo, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shadcn/components/ui/dialog";
import { InputText } from "@shared/components/inputText";
import { Controller, useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shadcn/components/ui/select";
import { adminCategoriesService } from "@redux/services/adminCategoriesService";
import { categoriesService } from "@redux/services/categoriesService";
import ImageInput from "@app/sell/components/imageInput";
import { LogoCell } from "@shared/components/table/cells/logoCell";
import { Checkbox } from "@shared/shadcn/checkbox";
import { Category } from "@shared/types/category.type";
import { toast } from "sonner";
import { Button } from "@shadcn/components/ui/button";

export default function Page() {
	const columns: Column<Category>[] = [
		{
			header: "Active",
			field: "isActive",
			type: "custom",
			className: "first:text-center w-0",
			render: (value: boolean, row) => {
				return (
					<Checkbox
						id="category-checkbox"
						name="category-checkbox"
						checked={value}
						onClick={async () => {
							await adminCategoriesService.updateCategory(row.id, token, {
								isActive: !value,
							});

							toast("Category updated.", { position: "top-center" });

							refetch();
						}}
					/>
				);
			},
		},
		{
			header: "Name",
			field: "imgUrl",
			type: "custom",
			className: "w-[40%]",
			render: (value, row) => {
				const params = new URLSearchParams();
				params.set("category", row.slug);

				return (
					<LogoCell
						href={`/products?${params.toString()}`}
						label={row.name}
						imgUrl={value}
					/>
				);
			},
		},
		{
			header: "Parent",
			field: "parent",
			type: "custom",
			className: "w-[15%]",
			render(value) {
				const parentCat = data?.find((cat) => cat.id === value);
				return <div>{parentCat?.name}</div>;
			},
		},
		{
			header: "Slug",
			field: "slug",
			type: "text",
			className: "w-[15%]",
		},

		{
			header: "Sort",
			field: "sortOrder",
			type: "number-input",
			className: "w-[10%]",
			async onChange(value, row) {
				await adminCategoriesService.updateCategory(row.id, token, {
					sortOrder: value,
				});

				toast("Category updated.", { position: "top-center" });

				refetch();
			},
		},
		{
			header: "",
			field: "id",
			type: "action",
			className: "w-9.5",
			actionIcon: "edit",
			action: (row) => {
				reset({
					...row,
					image: {
						url: row.imgUrl,
					},
				});
				setEditDialog(true);
			},
		},
	];

	const { token } = useAppSelector((state) => state.authReducer);

	const [editDialog, setEditDialog] = useState(false);

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["categories"],
		queryFn: () => adminCategoriesService.getAllCategories(token),
		staleTime: 0,
	});

	const { refetch: categoryTreeRefetch } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		formState,
		control,
		reset,
	} = useForm<{
		name: string;
		slug: string;
		parent?: string | null;
		sortOrder: number;
		image: {
			url?: string;
			file?: File;
		};
	}>({
		mode: "onTouched",
	});

	const [open, setOpen] = useState(false);

	const options = useMemo(() => {
		if (!data) return [];

		return data.map((category) => ({
			label: category.name,
			value: category.id,
		}));
	}, [data]);

	const resetForm = () => {
		reset({
			name: undefined,
			parent: undefined,
			slug: undefined,
			sortOrder: undefined,
			image: {
				file: undefined,
				url: undefined,
			},
		});
	};

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Categories
			</TypographyH4>

			{!isLoading && data && data.length > 0 && (
				<Table className="mb-8" columns={columns} data={data} />
			)}

			<Button
				className="block ml-auto"
				onClick={() => {
					setOpen(true);
					resetForm();
				}}
			>
				Add category
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-104">
					<DialogHeader>
						<DialogTitle>Add category</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={handleSubmit(async (data) => {
							await adminCategoriesService.addCategory(token, {
								name: data.name,
								slug: data.slug,
								parent: data.parent,
								sortOrder: data.sortOrder * 1,
								imgFile: data.image.file,
							});
							setOpen(false);
							categoryTreeRefetch();
							refetch();
						})}
						className="space-y-4"
					>
						<Controller
							name="image"
							control={control}
							render={({ field }) => (
								<ImageInput
									className="h-32"
									styleClass="object-cover"
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>

						<InputText
							type="text"
							id="name"
							placeholder="Category Name"
							icon="inventory_2"
							message={errors.name?.message}
							{...register("name", {
								required: "This field is required.",
								minLength: { value: 2, message: "Name is too short." },
								maxLength: { value: 64, message: "Name is too long." },
							})}
						/>
						<InputText
							type="text"
							id="slug"
							placeholder="Category Slug"
							icon="inventory_2"
							message={errors.slug?.message}
							{...register("slug", {
								required: "This field is required.",
							})}
						/>

						<div className="flex items-center gap-2">
							<TypographyP className="hidden sm:block whitespace-nowrap">
								Parent:
							</TypographyP>

							<Controller
								name="parent"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value || ""}
										onValueChange={field.onChange}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{options.map((item) => (
													<SelectItem
														key={`select-item-${item.value}`}
														value={item.value}
													>
														{item.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						<InputText
							type="number"
							id="sortOrder"
							placeholder="Category Sort Order"
							icon="inventory_2"
							message={errors.sortOrder?.message}
							{...register("sortOrder", {
								required: "This field is required.",
							})}
						/>

						<DialogFooter className="gap-2">
							<Button type="submit" disabled={!formState.isDirty}>
								Submit
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={editDialog} onOpenChange={setEditDialog}>
				<DialogContent className="sm:max-w-104">
					<DialogHeader>
						<DialogTitle>Edit Category</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={handleSubmit(async (formData) => {
							const id =
								data?.find((cat) => cat.slug === formData.slug)?.id || "";

							await adminCategoriesService.updateCategory(id, token, {
								name: formData.name,
								parent: formData.parent,
								sortOrder: formData.sortOrder * 1,
								imgFile: formData.image.file,
							});
							setEditDialog(false);
							refetch();
						})}
						className="space-y-4"
					>
						<Controller
							name="image"
							control={control}
							render={({ field }) => (
								<ImageInput
									className="h-32"
									styleClass="object-cover"
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>

						<InputText
							size="sm"
							placeholder="Category Name"
							message={errors.name?.message}
							{...register("name", {
								required: "This field is required.",
								minLength: { value: 2, message: "Name is too short." },
								maxLength: { value: 64, message: "Name is too long." },
							})}
						/>
						<InputText
							size="sm"
							placeholder="Category Slug"
							message={errors.slug?.message}
							{...register("slug", {
								required: "This field is required.",
							})}
						/>
						<InputText
							size="sm"
							placeholder="Category Parent"
							message={errors.parent?.message}
							{...register("parent")}
						/>
						<InputText
							size="sm"
							placeholder="Category Sort Order"
							type="number"
							message={errors.sortOrder?.message}
							{...register("sortOrder", {
								required: "This field is required.",
							})}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>

							<Button type="submit" disabled={!formState.isDirty}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Section>
	);
}
