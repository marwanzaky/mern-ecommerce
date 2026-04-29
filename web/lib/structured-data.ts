import { Product, WithContext } from "schema-dts";

import { ProductWithReviewsEntity } from "@/shared/types/product.types";

import config from "./config";
import { Locale } from "./i18n";

export function generateProductStructuredData(
	product: ProductWithReviewsEntity,
	locale: Locale,
): WithContext<Product> {
	const productUrl = `${config.clientUrl}/products/${product._id}`;
	const offerId = `${productUrl}#offer`;

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		"@id": productUrl,
		name: product.name[locale],
		description: product.description[locale],
		image: product.imgUrls,
		category: product.category ?? undefined,
		offers: {
			"@type": "Offer",
			"@id": offerId,
			price: product.price,
			priceCurrency: "USD",
			availability:
				product.stock > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			seller: {
				"@type": "Organization",
				name: product.user.name,
				url: config.clientUrl,
			},
			inventoryLevel: {
				"@type": "QuantitativeValue",
				value: product.stock,
			},
		},
		aggregateRating:
			product.reviews.length > 0
				? {
						"@type": "AggregateRating",
						ratingValue: product.avgRatings,
						reviewCount: product.reviews.length,
					}
				: undefined,
		review: product.reviews.map((review) => ({
			"@type": "Review",
			reviewRating: {
				"@type": "Rating",
				ratingValue: review.rating,
			},
			author: {
				"@type": "Person",
				name: review.user.name,
			},
			reviewBody: review.description?.[locale],
			datePublished: review.createdAt,
		})),
	};
}
