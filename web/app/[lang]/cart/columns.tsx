import { Trash2Icon } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";
import { LogoCell } from "@/components/ui/table/cells/logo-cell";

import { Button } from "@/shadcn/components/ui/button";

import { CartProductEntity } from "@/shared/types/cart.type";
import { PublicCategoryTree } from "@/shared/types/category.type";

import { Locale, localizePath } from "@/lib/i18n";

import { formatPrice } from "@/utils/format";
import { createProductSlug } from "@/utils/string-utils";

import { DictionaryKeys } from "@/types/i18n.type";

export type CartItem = CartProductEntity & {
	imgUrl: string;
	quantity: number;
	total: number;
};

export const getCartColumns = ({
	categoryTree,
	locale,
	t,
	onQuantityChange,
	deleteAction,
}: {
	categoryTree: PublicCategoryTree[] | undefined;
	t: (key: DictionaryKeys, fallback?: string) => string;
	locale: Locale;
	onQuantityChange: (value: number, row: CartItem) => void;
	deleteAction: (row: CartItem) => void;
}): ColumnDef<CartItem>[] => [
	{
		header: t("cartPage.table.product"),
		accessorKey: "name",
		cell: ({ row }) => {
			const subcategory = categoryTree
				?.flatMap((cat) => [...cat.children, cat])
				.find((cat) => cat.id === row.original.category);

			return (
				<LogoCell
					href={localizePath(
						`/products/${createProductSlug(row.original.name.en, row.original._id)}`,
						locale,
					)}
					label={row.original.name[locale]}
					imgUrl={row.original.imgUrl}
					subcategory={subcategory}
				/>
			);
		},
	},
	{
		header: t("cartPage.table.price"),
		accessorKey: "price",
		cell: ({ row }) => (
			<div>{formatPrice(row.original.price / 100, locale)}</div>
		),
	},
	{
		header: t("cartPage.table.quantity"),
		accessorKey: "quantity",
		cell: ({ row }) => (
			<InputWithPlusMinusButtons
				min={1}
				className="w-28"
				size="icon-lg"
				value={row.original.quantity}
				onChange={(value) => onQuantityChange(value, row.original)}
			/>
		),
	},
	{
		header: t("cartPage.table.total"),
		accessorKey: "total",
		cell: ({ row }) => (
			<div>{formatPrice(row.original.total / 100, locale)}</div>
		),
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => (
			<Button
				variant="ghost"
				size="icon"
				className="rounded-full"
				aria-label={t("cartPage.table.removeProduct")}
				onClick={() => deleteAction(row.original)}
			>
				<Trash2Icon />
			</Button>
		),
	},
];
