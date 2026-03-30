"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@hooks/use-cart";

import { Table } from "@shared/components/ui/table";
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
	const router = useRouter();

	const { items, columns, tableData, cartTotalStr } = useCart();

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Cart
			</TypographyH4>

			{items.length > 0 ? (
				<div>
					<Table className="mb-8" columns={columns} data={tableData} />

					<div className="flex flex-col items-end mb-5">
						<div>Subtotal&emsp;{cartTotalStr}</div>

						<div className="text-xs text-muted-foreground">
							Taxes and shipping calculated at checkout
						</div>
					</div>

					<div className="flex justify-end items-end">
						<Button>Check out</Button>
					</div>
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Add items to your cart to see them here when you&apos;re ready to
							check out.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" onClick={() => router.push("/products")}>
							Continue shopping
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</Section>
	);
}
