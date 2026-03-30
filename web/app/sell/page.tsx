"use client";

import { Table } from "@shared/components/ui/table";

import { useSell } from "@hooks/use-sell";

import { Section } from "@shared/components/ui/section";
import { TypographyH4 } from "@shadcn/components/ui/typography";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";
import { Button } from "@shadcn/components/ui/button";

export default function Page() {
	const {
		columns,
		tableData,
		resetForm,
		setDisplayDialog,
		AddProductDialog,
		EditProductDialog,
	} = useSell();

	return (
		<Section className="space-y-2 lg:space-y-4">
			<TypographyH4 className="text-center">Your Products</TypographyH4>

			{tableData.length > 0 ? (
				<div className="flex flex-col gap-4">
					<Table columns={columns} data={tableData}></Table>

					<div className="flex justify-end">
						<Button
							className="mr-0!"
							onClick={() => {
								resetForm();
								setDisplayDialog(true);
							}}
						>
							Add product
						</Button>
					</div>
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Get started by creating your first product.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							variant="outline"
							onClick={() => {
								resetForm();
								setDisplayDialog(true);
							}}
						>
							Add product
						</Button>
					</EmptyContent>
				</Empty>
			)}

			{AddProductDialog}
			{EditProductDialog}
		</Section>
	);
}
