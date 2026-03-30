"use client";

import { useAdminMessages } from "@hooks/use-admin-message";

import { Table } from "@shared/components/ui/table";
import { Section } from "@shared/components/ui/section";
import { TypographyH4 } from "@shadcn/components/ui/typography";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";

export default function Page() {
	const { columns, isLoading, data, ViewMessageDialog } = useAdminMessages();

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Messages
			</TypographyH4>

			{!isLoading && data && data.length > 0 ? (
				<Table className="mb-8" columns={columns} data={data} />
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							You have no messages
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			{ViewMessageDialog}
		</Section>
	);
}
