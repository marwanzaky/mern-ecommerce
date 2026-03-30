"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { createProductSlug } from "@utils/string-utils";
import { TypographyP } from "@shadcn/components/ui/typography";
import { Button } from "@shadcn/components/ui/button";
import { TypographyH1 } from "@shadcn/components/ui/typography";

export default function Header() {
	const router = useRouter();
	const productId = process.env.NEXT_PUBLIC_HEADER_PRODUCT_ID!;
	const productName = process.env.NEXT_PUBLIC_HEADER_PRODUCT_NAME!;
	const productDescription =
		process.env.NEXT_PUBLIC_HEADER_PRODUCT_DESCRIPTION!;

	return (
		<header className="full-bleed relative px-4 py-16 md:py-16">
			<Image
				fill
				priority
				className="object-center object-cover pointer-events-none z-[-1]"
				src="/img/background.jpg"
				alt="background"
			/>

			<div className="space-y-4">
				<div>
					<TypographyH1 className="text-center text-white text-4xl md:text-5xl">
						{productName}
					</TypographyH1>
					<TypographyP className="text-center text-muted max-w-xs mx-auto">
						{productDescription}
					</TypographyP>
				</div>

				<div className="flex justify-center gap-2">
					<Button
						size="lg"
						onClick={() =>
							router.push(
								`/products/${createProductSlug(productName, productId)}`,
							)
						}
					>
						Shop now
					</Button>
					<Button
						size="lg"
						variant="ghost"
						className="text-white"
						onClick={() => router.push("/products")}
					>
						Explore
					</Button>
				</div>
			</div>
		</header>
	);
}
