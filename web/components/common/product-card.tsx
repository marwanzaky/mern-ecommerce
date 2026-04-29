"use client";

import { useDispatch } from "react-redux";

import Image from "next/image";
import Link from "next/link";

import { AppDispatch } from "@/redux/store";
import { postCartItemAsync } from "@/redux/thunks/cart-thunks";

import { useI18n } from "@/components/layout/i18n-provider";
import { ButtonIcon } from "@/components/ui/button-icon";
import Stars from "@/components/ui/stars";

import { useIsMobile } from "@/shadcn/hooks/use-mobile";

import { ProductEntity } from "@/shared/types/product.types";

import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { formatPrice } from "@/utils/format";
import { createProductSlug } from "@/utils/string-utils";

import { useToggleFavorite } from "@/hooks/use-toggle-favorite";

type ProductCardProps = {
	data: ProductEntity;
};

export default function ProductCard({ data }: ProductCardProps) {
	const dispatch = useDispatch<AppDispatch>();
	const { locale, t } = useI18n();

	const isMobile = useIsMobile({});
	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(data);

	return (
		<div
			className={cn(
				"relative flex flex-col overflow-hidden",
				"border-2 rounded-lg hover:shadow-lg transition-shadow",
			)}
		>
			<div className="absolute top-1 inset-e-1">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						styleClass="filter-(--filter-primary)"
						icon="favorite_fill"
						aria-label={t("product.actions.removeFromFavorites")}
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						icon="favorite"
						aria-label={t("product.actions.addToFavorites")}
						onClick={addToFavorites}
					/>
				)}
			</div>

			<Link
				href={localizePath(
					`/products/${createProductSlug(data.name.en, data._id)}`,
					locale,
				)}
			>
				<Image
					className="aspect-square object-cover w-full h-full"
					src={data.imgUrls[0]}
					alt={data.name[locale]}
					width={512}
					height={512}
					loading="lazy"
				/>
			</Link>

			<div className="relative p-2 md:p-4">
				<h3 className="truncate leading-none! mb-1 text-base md:text-lg">
					{data.name[locale]}
				</h3>

				<Stars
					className="mb-2"
					size={isMobile ? 16 : 18}
					value={data.avgRatings}
					total={data.numReviews}
				/>

				<div className="flex items-center gap-x-2">
					<div className="leading-none! text-base md:text-2xl">
						{formatPrice(data.price / 100, locale)}
					</div>
					{data.priceCompare > data.price && (
						<div className="text-gray-500 line-through leading-none! text-sm md:text-lg">
							{formatPrice(data.priceCompare / 100, locale)}
						</div>
					)}
				</div>

				<ButtonIcon
					className="absolute bottom-1 inset-e-1 sm:bottom-4 sm:inset-e-4"
					icon="shopping_cart"
					aria-label={t("product.actions.addToCart")}
					variant="primary"
					onClick={() => {
						dispatch(postCartItemAsync({ product: data }));
					}}
				/>
			</div>
		</div>
	);
}
