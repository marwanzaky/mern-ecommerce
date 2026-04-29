"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowUpDown, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { ColumnDef, Row } from "@tanstack/react-table";

import { useI18n } from "@/components/layout/i18n-provider";
import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shadcn/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "@/shadcn/components/ui/avatar";
import { Button } from "@/shadcn/components/ui/button";
import { Checkbox } from "@/shadcn/components/ui/checkbox";

import { PublicCategoryTree } from "@/shared/types/category.type";
import { ProductEntity } from "@/shared/types/product.types";

import { Locale, localizePath } from "@/lib/i18n";

import { formatPrice } from "@/utils/format";
import { createProductSlug } from "@/utils/string-utils";

import { DictionaryKeys } from "@/types/i18n.type";

export type SellProduct = ProductEntity & { imgUrl: string };

export const getSellColumns = ({
	categoryTree,
	onDelete,
	onStockChange,
	locale,
	t,
}: {
	categoryTree: PublicCategoryTree[] | undefined;
	onDelete: (id: string) => void;
	onStockChange: (id: string, value: number) => void;
	locale: Locale;
	t: (key: DictionaryKeys, fallback?: string) => string;
}): ColumnDef<SellProduct>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label={t("storeProductsPage.table.selectAll")}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label={t("storeProductsPage.table.selectRow")}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: t("storeProductsPage.table.product"),
		cell: ({ row }) => {
			const href = localizePath(`store/products/${row.original._id}`, locale);
			const subcategory = categoryTree
				?.flatMap((cat) => [...cat.children, cat])
				.find((cat) => cat.id === row.original.category);

			return (
				<div className="flex gap-3 items-center">
					<Link href={href}>
						<Avatar className="h-8 w-8 rounded-sm overflow-hidden">
							<AvatarImage
								className="rounded-none"
								src={row.original.imgUrl}
								alt={`${t("photoOf").replace("{{name}}", row.original.name[locale])}`}
							/>
						</Avatar>
					</Link>

					<div>
						<div className="font-medium hover:text-primary transition-colors max-w-60 truncate">
							<Link href={href}>{row.original.name[locale]}</Link>
						</div>
						<span className="text-muted-foreground text-xs">
							{subcategory?.name}
						</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{t("storeProductsPage.table.category")}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const productCategoryTree = categoryTree?.find((rootCat) =>
				rootCat.children.some(
					(childCat) => childCat.id === row.original.category,
				),
			);

			return <div>{productCategoryTree?.name}</div>;
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{t("storeProductsPage.table.price")}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div>{formatPrice(row.original.price / 100, locale)}</div>
		),
	},
	{
		accessorKey: "priceCompare",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{t("storeProductsPage.table.compare")}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div>{formatPrice(row.original.priceCompare / 100, locale)}</div>
		),
	},
	{
		accessorKey: "stock",
		header: t("storeProductsPage.table.stock"),
		cell: ({ row }) => (
			<InputWithPlusMinusButtons
				min={0}
				className="w-28"
				size="icon-lg"
				value={row.original.stock}
				onChange={(value) => onStockChange(row.original._id, value)}
			/>
		),
	},
	{
		id: "actions",
		header: t("storeProductsPage.table.actions"),
		cell: ({ row }) => {
			return <ActionsCell row={row} onDelete={onDelete} />;
		},
	},
];

const ActionsCell = ({
	row,
	onDelete,
}: {
	row: Row<SellProduct>;
	onDelete: (id: string) => void;
}) => {
	const router = useRouter();
	const { locale, t } = useI18n();
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const product = row.original;

	return (
		<>
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product._id}-remove`}
					onClick={() => {
						router.push(
							localizePath(
								`/products/${createProductSlug(row.original.name.en, row.original._id)}`,
								locale,
							),
						);
					}}
				>
					<EyeIcon />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product._id}-edit`}
					onClick={() => {
						router.push(
							localizePath(`/store/products/${row.original._id}`, locale),
						);
					}}
				>
					<PencilIcon />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product._id}-remove`}
					onClick={() => setShowDeleteAlert(true)}
				>
					<Trash2Icon />
				</Button>
			</div>

			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("storeProductsPage.table.deleteConfirmTitle")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("storeProductsPage.table.deleteConfirmDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDelete(product._id)}>
							{t("buttons.continue")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
