import ProductDetails from "@components/product-details";
import { generateProductStructuredData } from "@lib/structured-data";
import { productsService } from "@redux/services/products-service";
import { createProductSlug } from "@utils/string-utils";
import { IProduct } from "@shared/interfaces";

interface Props {
	params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
	const { slug } = await params;
	const id = slug.split("-").pop()!;

	const product = await getProduct(id);

	const structuredData = generateProductStructuredData(product);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<main>
				<ProductDetails product={product} />
			</main>
		</>
	);
}

async function getProduct(id: string): Promise<IProduct> {
	"use cache";
	return await productsService.getProduct(id);
}

export async function generateStaticParams() {
	const data = await productsService.getAllProducts();

	return data.map((product) => ({
		slug: createProductSlug(product.name, product._id),
	}));
}

export async function generateMetadata({ params }: Props) {
	"use cache";

	const { slug } = await params;
	const id = slug.split("-").pop()!;

	const product = await productsService.getProduct(id);

	if (!product) {
		return {
			title: "Product Not Found",
			description: "This product does not exist",
		};
	}

	return {
		title: `${product.name} - Best Price & Reviews | ${process.env.NEXT_PUBLIC_NAME}`,
		description: `${product.description.slice(0, 155)}...`,
		keywords: product.tags.join(", "),
		openGraph: {
			title: product.name,
			description: product.description,
			images: [
				{
					url: product.imgUrls[0],
					width: 1200,
					height: 630,
					alt: product.name,
				},
			],
			type: "website",
			siteName: process.env.NEXT_PUBLIC_NAME,
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description: product.description,
			images: [product.imgUrls[0]],
		},
		alternates: {
			canonical: `https://${process.env.NEXT_PUBLIC_WEBSITE!}/products/${id}`,
		},
	};
}
