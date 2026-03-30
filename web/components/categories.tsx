"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Section } from "@shared/components/ui/section";
import { Container } from "@shared/components/ui/container";
import { PublicCategoryTree } from "@shared/types/category.type";

export default function Categories({
	categoryTree,
}: {
	categoryTree: PublicCategoryTree[];
}) {
	const router = useRouter();

	return (
		<Section className="full-bleed bg-custom-background pb-0! space-y-2 lg:space-y-4">
			<Container>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{categoryTree.map((item, i) => (
						<button
							key={`category-${item.slug}`}
							className="group relative bg-custom-background aspect-square flex items-center justify-center rounded-lg overflow-hidden"
							onClick={() => {
								const params = new URLSearchParams();
								params.set("category", item.slug);
								router.push(`/products?${params.toString()}`);
							}}
						>
							<Image
								className="w-full h-full absolute opacity-50 group-hover:scale-105 transition-transform"
								src={item.imgUrl || ""}
								width={512}
								height={512}
								alt={`Photo of ${item.name}`}
								loading="lazy"
							/>

							<div className="bg-white font-light text-lg h-12 w-32 flex items-center justify-center shadow-sm rounded z-10">
								{item.name}
							</div>
						</button>
					))}
				</div>
			</Container>
		</Section>
	);
}
