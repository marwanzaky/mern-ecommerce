import Link from "next/link";
import { Avatar, AvatarImage } from "@shadcn/components/ui/avatar";

export type LogoCellProps = {
	label: string;
	imgUrl: string;
	href: string;
};

export function LogoCell({ label, imgUrl, href }: LogoCellProps) {
	return (
		<div className="flex gap-5 items-center">
			<Link href={href}>
				<Avatar className="border h-12 w-12 rounded-lg overflow-hidden">
					<AvatarImage
						className="rounded-none"
						src={imgUrl}
						alt={`Photo of "${label}"`}
					/>
				</Avatar>
			</Link>

			<Link
				className="hidden sm:block hover:text-primary transition-colors"
				href={href}
			>
				{label}
			</Link>
		</div>
	);
}
