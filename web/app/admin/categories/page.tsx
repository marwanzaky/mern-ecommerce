"use client";

import { Controller } from "react-hook-form";

import { Table } from "@shared/components/ui/table";
import { Section } from "@shared/components/ui/section";
import ImageInput from "@shared/components/ui/image-input";

import {
	Dialog,
	DialogClose,
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
import { TypographyH4 } from "@shadcn/components/ui/typography";
import { Button } from "@shadcn/components/ui/button";
import { Input } from "@shadcn/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";

import { useAdminCategories } from "@hooks/use-admin-categories";

export default function Page() {
	const {
		columns,
		data,
		isLoading,

		open,
		setOpen,
		openDialog,
		editDialog,
		setEditDialog,

		control,
		register,
		formState,
		options,

		categorySubmit,
		editCategorySubmit,
	} = useAdminCategories();

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Categories
			</TypographyH4>

			{!isLoading && data && data.length > 0 && (
				<Table className="mb-8" columns={columns} data={data} />
			)}

			<Button className="block ml-auto" onClick={openDialog}>
				Add category
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-104">
					<DialogHeader>
						<DialogTitle>Add category</DialogTitle>
					</DialogHeader>

					<form onSubmit={categorySubmit} className="space-y-4">
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
						</FieldGroup>

						<DialogFooter className="gap-2">
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
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
						<DialogTitle>Edit category</DialogTitle>
					</DialogHeader>

					<form onSubmit={editCategorySubmit} className="space-y-4">
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
