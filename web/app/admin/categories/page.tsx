"use client";

import { Column, Table } from "@shared/components/ui/table";
import { Section } from "@shared/components/ui/section";
import { TypographyH4 } from "@shadcn/components/ui/typography";
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
import { Controller, useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shadcn/components/ui/select";
import { adminCategoriesService } from "@redux/services/admin-categories-service";
import { categoriesService } from "@redux/services/categories-service";
import ImageInput from "@shared/components/ui/image-input";
import { LogoCell } from "@shared/components/ui/table/cells/logo-cell";
import { Checkbox } from "@shadcn/components/ui/checkbox";
import { Category } from "@shared/types/category.type";
import { toast } from "sonner";
import { Button } from "@shadcn/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";

export default function Page() {
	const columns: Column<Category>[] = [
		{
			header: "Active",
			field: "isActive",
			type: "custom",
			className: "first:text-center! w-0",
			render: (value: boolean, row) => {
				return (
					<div className="flex justify-center">
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
					</div>
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
						<FieldGroup>
							<Field>
								<FieldLabel>Category Image</FieldLabel>
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
							</Field>
							<Field>
								<FieldLabel htmlFor="name">Category Name</FieldLabel>
								<Input
									id="name"
									type="text"
									placeholder="e.g. Shoes, Electronics, Home Decor"
									{...register("name", {
										required: "This field is required.",
										minLength: { value: 2, message: "Name is too short." },
										maxLength: { value: 64, message: "Name is too long." },
									})}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="slug">Category Slug</FieldLabel>
								<Input
									type="text"
									id="slug"
									placeholder="e.g. shoes, electronics, home-decor"
									{...register("slug", {
										required: "This field is required.",
									})}
								/>
							</Field>

							<Field>
								<FieldLabel>Category Parent</FieldLabel>
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
							</Field>
						</FieldGroup>

						<Field>
							<FieldLabel id="sort-order">Category Sort Order</FieldLabel>
							<Input
								id="sort-order"
								type="number"
								min={1}
								{...register("sortOrder", {
									required: "This field is required.",
								})}
							/>
						</Field>

						<DialogFooter className="gap-2">
							<Button
								variant="outline"
								onClick={() => {
									setOpen(false);
								}}
							>
								Cancel
							</Button>
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
						<FieldGroup>
							<Field>
								<FieldLabel>Category Image</FieldLabel>
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
							</Field>
							<Field>
								<FieldLabel htmlFor="name">Category Name</FieldLabel>
								<Input
									id="name"
									placeholder="e.g. Shoes, Electronics, Home Decor"
									{...register("name", {
										required: "This field is required.",
										minLength: { value: 2, message: "Name is too short." },
										maxLength: { value: 64, message: "Name is too long." },
									})}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="slug">Category Slug</FieldLabel>
								<Input
									id="slug"
									placeholder="e.g. shoes, electronics, home-decor"
									{...register("slug", {
										required: "This field is required.",
									})}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="parent">Category Parent</FieldLabel>
								<Input id="parent" {...register("parent")} />
							</Field>

							<Field>
								<FieldLabel htmlFor="sort-order">
									Category Sort Order
								</FieldLabel>
								<Input
									id="sort-order"
									placeholder="Category Sort Order"
									type="number"
									{...register("sortOrder", {
										required: "This field is required.",
									})}
								/>
							</Field>
						</FieldGroup>

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
