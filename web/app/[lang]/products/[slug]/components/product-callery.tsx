"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useI18n } from "@/components/layout/i18n-provider";
import { ButtonIcon } from "@/components/ui/button-icon";

import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	useCarousel,
} from "@/shadcn/components/ui/carousel";

import { ProductWithReviewsEntity } from "@/shared/types/product.types";

import { cn } from "@/lib/utils";

import { useToggleFavorite } from "@/hooks/use-toggle-favorite";

export default function ProductCallery({
	product,
}: {
	product: ProductWithReviewsEntity;
}) {
	const { dir, t, locale } = useI18n();
	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(product);

	const [imgIndex, setImgIndex] = useState(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;
		api.on("select", () => {
			setImgIndex(api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<div className="group/container relative md:sticky md:top-20 md:h-fit">
			<div className="opacity-0 group-hover/container:opacity-100 z-10 absolute top-1 inset-e-1 transition-all">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-all"
						styleClass="filter-(--filter-primary)"
						icon="favorite_fill"
						aria-label={t("product.actions.removeFromFavorites")}
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-all"
						icon="favorite"
						aria-label={t("product.actions.addToFavorites")}
						onClick={addToFavorites}
					/>
				)}
			</div>

			<Carousel
				setApi={setApi}
				className="mb-2 md:mb-4"
				opts={{ direction: dir }}
			>
				<CarouselContent>
					{product.imgUrls.map((src, i) => (
						<CarouselItem key={`carousel-item-${i}`}>
							<Image
								className="w-full rounded-lg"
								src={src}
								alt={product.name[locale]}
								width={512}
								height={512}
								priority={i === 0}
							/>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselScrollButtons />
			</Carousel>

			<div className="grid grid-cols-4 gap-2 md:gap-4">
				{product.imgUrls.map((imgUrl, i) => (
					<Image
						key={`${product.name} ${i + 1}`}
						role="button"
						className={cn(
							"cursor-pointer rounded-lg opacity-100 hover:opacity-50 aspect-square object-cover border border-transparent hover:border-black transition-colors",
							i === imgIndex && "border-primary",
						)}
						src={imgUrl}
						alt={`${product.name} ${i + 1}`}
						onClick={() => api?.scrollTo(i)}
						width={128}
						height={128}
						loading="lazy"
					/>
				))}
			</div>
		</div>
	);
}

function CarouselScrollButtons() {
	const { dir, t } = useI18n();

	const { scrollPrev, canScrollPrev, scrollNext, canScrollNext } =
		useCarousel();
	return (
		<>
			<ButtonIcon
				className="absolute shadow-md top-[calc(50%-19px)] inset-s-[9.5px] rtl:rotate-180"
				icon="arrow_back"
				aria-label={t("product.actions.previousImage")}
				onClick={scrollPrev}
				disabled={!canScrollPrev}
			/>

			<ButtonIcon
				className="absolute shadow-md top-[calc(50%-19px)] inset-e-[9.5px] rtl:rotate-180"
				icon="arrow_forward"
				aria-label={t("product.actions.nextImage")}
				onClick={scrollNext}
				disabled={!canScrollNext}
			/>
		</>
	);
}
