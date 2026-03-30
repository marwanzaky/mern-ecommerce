import { MetadataRoute } from "next";

import { productsService } from "@redux/services/products-service";
import { createProductSlug } from "@utils/string-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = `https://${process.env.NEXT_PUBLIC_WEBSITE!}`;

	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		},
	];

	const products = await productsService.getAllProducts();
	const productPages: MetadataRoute.Sitemap = products.map((product) => ({
		url: `${baseUrl}/products/${createProductSlug(product.name, product._id)}`,
		lastModified: product.updatedAt,
		changeFrequency: "weekly" as const,
		priority: 0.9,
	}));

	return [...staticPages, ...productPages];
}
