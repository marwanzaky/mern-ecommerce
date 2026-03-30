"use client";

import Link from "next/link";
import Image from "next/image";

import { useDispatch } from "react-redux";
import { postCartItemAsync } from "@redux/thunks/cart-thunks";
import { AppDispatch } from "@redux/store";

import { useToggleFavorite } from "@hooks/use-toggle-favorite";

import { cn } from "@lib/utils";

import Stars from "@shared/components/ui/stars";
import { IProduct } from "@shared/interfaces";
import { ButtonIcon } from "@shared/components/ui/button-icon";

import { formatPrice } from "@utils/format-price";
import { createProductSlug } from "@utils/string-utils";
import { useIsMobile } from "@shadcn/hooks/use-mobile";

type ProductCardProps = {
	data: IProduct;
};

export default function ProductCard({ data }: ProductCardProps) {
	const dispatch = useDispatch<AppDispatch>();

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
			<div className="absolute top-1 right-1">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						styleClass="filter-(--filter-primary)"
						icon="favorite_fill"
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						icon="favorite"
						onClick={addToFavorites}
					/>
				)}
			</div>

			<Link href={`/products/${createProductSlug(data.name, data._id)}`}>
				<Image
					className="aspect-square object-cover w-full h-full"
					src={data.imgUrls[0]}
					alt={data.name}
					width={512}
					height={512}
					loading="lazy"
				/>
			</Link>

			<div className="relative p-2 md:p-4">
				<h3 className="truncate leading-none! mb-1 text-base md:text-lg">
					{data.name}
				</h3>

				{process.env.NEXT_PUBLIC_REVIEWS === "true" && (
					<Stars
						className="mb-2"
						size={isMobile ? 16 : 18}
						value={data.avgRatings}
						total={data.numReviews}
					/>
				)}

				<div className="flex items-center gap-x-2">
					<div className="leading-none! text-base md:text-2xl">
						{formatPrice(data.price)}
					</div>
					{data.priceCompare > data.price && (
						<div className="text-gray-500 line-through leading-none! text-sm md:text-lg">
							{formatPrice(data.priceCompare)}
						</div>
					)}
				</div>

				<ButtonIcon
					className="absolute bottom-1 right-1 sm:bottom-4 sm:right-4"
					icon="shopping_cart"
					variant="primary"
					onClick={() => {
						dispatch(postCartItemAsync({ product: data }));
					}}
				/>
			</div>
		</div>
	);
}
