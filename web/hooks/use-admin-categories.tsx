"use client";

import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { useAppSelector } from "@redux/store";
import { adminCategoriesService } from "@redux/services/admin-categories-service";
import { categoriesService } from "@redux/services/categories-service";

import { Column } from "@shared/components/ui/table";
import { LogoCell } from "@shared/components/ui/table/cells/logo-cell";
import { Category } from "@shared/types/category.type";

import { Checkbox } from "@shadcn/components/ui/checkbox";

export function useAdminCategories() {
	const { token } = useAppSelector((state) => state.authReducer);

	const { register, handleSubmit, formState, control, reset } = useForm<{
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

	const [open, setOpen] = useState(false);
	const [editDialog, setEditDialog] = useState(false);

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

	const columns: Column<Category>[] = [
		{
			header: "Active",
			field: "isActive",
			type: "custom",
			className: "text-center! w-0",
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

	return {
		columns,
		data,
		isLoading,

		open,
		setOpen,
		openDialog: () => {
			setOpen(true);
			resetForm();
		},
		editDialog,
		setEditDialog,

		control,
		register,
		formState,
		options,

		categorySubmit: handleSubmit(async (data) => {
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
		}),
		editCategorySubmit: handleSubmit(async (formData) => {
			const id = data?.find((cat) => cat.slug === formData.slug)?.id || "";

			await adminCategoriesService.updateCategory(id, token, {
				name: formData.name,
				parent: formData.parent,
				sortOrder: formData.sortOrder * 1,
				imgFile: formData.image.file,
			});
			setEditDialog(false);
			refetch();
		}),
	};
}
