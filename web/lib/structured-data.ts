import { IProduct } from "@shared/interfaces";

export function generateProductStructuredData(product: IProduct) {
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		"@id": `https://${process.env.NEXT_PUBLIC_WEBSITE!}/products/${product._id}`,
		name: product.name,
		description: product.description,
		image: product.imgUrls,
		offers: {
			"@type": "Offer",
			"@id": `https://${process.env.NEXT_PUBLIC_WEBSITE!}/products/${product._id}#offer`,
			price: product.price,
			priceCurrency: "USD",
			availability:
				product.stock > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			seller: {
				"@type": "Organization",
				name: "YourStore",
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
				name: review.user,
			},
			reviewBody: review.description,
			datePublished: review.createdAt,
		})),
	};
}
