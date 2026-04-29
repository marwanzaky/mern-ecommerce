"use cache";
import { Metadata } from "next";
import { cacheLife } from "next/cache";

import { productsService } from "@/redux/services/products-service";

import config from "@/lib/config";
import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { Locale, localizePath } from "@/lib/i18n";
import { generateProductStructuredData } from "@/lib/structured-data";

import { createProductSlug } from "@/utils/string-utils";

import ProductPage from "./components/product-page";

interface Props {
	params: Promise<{ slug: string; lang: Locale }>;
}

export default async function Page({ params }: Props) {
	cacheLife("minutes");

	const { slug, lang } = await params;
	const id = slug.split("-").pop()!;

	const product = await getProduct(id);

	const structuredData = generateProductStructuredData(product, lang);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<main>
				<ProductPage product={product} />
			</main>
		</>
	);
}

async function getProduct(id: string) {
	return await productsService.getProduct(id);
}

export async function generateStaticParams() {
	const data = await productsService.getAllProducts();

	return data.map((product) => ({
		slug: createProductSlug(product.name.en, product._id),
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug, lang } = await params;
	const id = slug.split("-").pop()!;

	const product = await productsService.getProduct(id);

	if (!product) {
		return {
			title: "Product Not Found",
			description: "This product does not exist",
			robots: "noindex, follow",
		};
	}

	const path = `/products/${createProductSlug(product.name.en, product._id)}`;

	return {
		title: `${product.name.en} - Best Price & Reviews | ${config.websiteName}`,
		description: `${product.description.en.slice(0, 155)}...`,
		keywords: [
			product.name.en,
			...(product.tags || []),
			"shop",
			"buy online",
			config.websiteName,
		].filter(Boolean),
		authors: [{ name: config.websiteName }],
		openGraph: generateOgMetadata({
			title: product.name.en,
			description: product.description.en,
			path: localizePath(path, lang),
			image: product.imgUrls[0],
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title: product.name.en,
			description: product.description.en,
			image: product.imgUrls[0],
		}),
		alternates: generateLocaleAlternates(path, lang),
	};
}
