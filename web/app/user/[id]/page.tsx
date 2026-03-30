"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AvatarInitials } from "@components/feedback/reviews";

import { usersService } from "@redux/services/users-service";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";
import { Section } from "@shared/components/ui/section";
import { Avatar, AvatarImage } from "@shadcn/components/ui/avatar";
import { User } from "@shared/types/user.type";

export default function Page() {
	const params = useParams<{ id: string }>();

	const [user, setUser] = useState<User>();

	useEffect(() => {
		getPublicUser(params.id).then((value) => setUser(value));
	}, []);

	return (
		user && (
			<Section className="space-y-4">
				<div className="flex justify-between">
					<div className="flex items-center gap-4">
						{user.photoUrl ? (
							<Avatar className="h-10 w-10">
								<AvatarImage src={user.photoUrl} />
							</Avatar>
						) : (
							<AvatarInitials name={user.name} />
						)}

						{user.name}
					</div>

					{/* <Button variant="secondary">Follow</Button> */}
				</div>

				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Looks like &quot;{user.name}&quot; hasn&apos;t added any favorite
							items. Check back again later!
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</Section>
		)
	);
}

async function getPublicUser(id: string): Promise<User> {
	return await usersService.getPublicById(id);
}
