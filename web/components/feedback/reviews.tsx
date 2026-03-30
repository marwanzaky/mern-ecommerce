import { cn } from "@lib/utils";

import Stars from "@shared/components/ui/stars";
import { IProduct } from "@shared/interfaces";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@shadcn/components/ui/avatar";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";

import { initials, stringToDate } from "@utils/string-utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TypographyMuted } from "@shadcn/components/ui/typography";

type AvatarInitialsProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
};

export function AvatarInitials({
	className,
	name,
	...props
}: AvatarInitialsProps) {
	return (
		<div
			className={cn(
				// h-10 w-10
				"shrink-0 flex justify-center items-center w-8 h-8 rounded-full text-base",
				"text-primary bg-primary/20",
				className,
			)}
			{...props}
		>
			{initials(name)}
		</div>
	);
}

export default function Reviews({ product }: { product: IProduct }) {
	const router = useRouter();

	return (
		<div>
			{product.reviews?.length > 0 ? (
				product.reviews?.map((review, i) => (
					<div key={`review ${i}`} className="mb-8 last:mb-0 flex">
						<Avatar className="mr-2 h-8 w-8">
							<AvatarImage
								role="button"
								src={review.user.photoUrl}
								alt={`Photo of ${review.user.name}`}
								onClick={() => router.push(`/user/${review.user._id}`)}
								loading="lazy"
							/>
							<AvatarFallback>{initials(review.user.name)}</AvatarFallback>
						</Avatar>

						<div>
							<div className="leading-none mb-0.5 text-sm">
								<Link
									href={`/user/${review.user._id}`}
									className="hover:underline"
								>
									{review.user.name}
								</Link>
								&ensp;
								<span className="text-muted-foreground">
									{stringToDate(review.createdAt)}
								</span>
							</div>
							<Stars
								className="mb-1"
								size={14}
								value={review.rating}
								displayTotal={false}
							/>
							<TypographyMuted className="text-sm">
								{review.description}
							</TypographyMuted>
						</div>
					</div>
				))
			) : (
				<Empty className="border border-dashed h-full">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Customers who have purchased this product have not yet submitted
							any reviews.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</div>
	);
}
