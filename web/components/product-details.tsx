"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Feedback from "@components/feedback";

import Link from "next/link";

import Stars from "@shared/components/ui/stars";
import { IProduct } from "@shared/interfaces";
import ProductCard from "@shared/components/ui/product-card";
import { ButtonIcon } from "@shared/components/ui/button-icon";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@shadcn/components/ui/breadcrumb";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@shadcn/components/ui/accordion";
import { Section } from "@shared/components/ui/section";
import { TypographyH4 } from "@shadcn/components/ui/typography";
import {
	TypographyH3,
	TypographyMuted,
} from "@shadcn/components/ui/typography";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@shadcn/components/ui/tooltip";
import { PublicCategoryTree } from "@shared/types/category.type";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@shadcn/components/ui/avatar";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { postCartItemAsync } from "@redux/thunks/cart-thunks";
import { useToggleFavorite } from "@hooks/use-toggle-favorite";
import { useQuery } from "@tanstack/react-query";
import {
	GetAllProductsOptions,
	productsService,
} from "@redux/services/products-service";
import { cn } from "@lib/utils";

import { formatPrice } from "@utils/format-price";
import { categoriesService } from "@redux/services/categories-service";

import { sendGTMEvent } from "@next/third-parties/google";
import { initials, stringToDate } from "@utils/string-utils";
import { Button } from "@shadcn/components/ui/button";
import { TypographyP } from "@shadcn/components/ui/typography";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";

function Preview({ product }: { product: IProduct }) {
	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(product);

	const [imgIndex, setImgIndex] = useState(0);

	return (
		<div className="group/container relative md:sticky md:top-20 md:h-fit">
			<div className="opacity-0 group-hover/container:opacity-100 z-10 absolute top-1 right-1 transition-all">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-all"
						styleClass="filter-(--filter-primary)"
						icon="favorite_fill"
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-all"
						icon="favorite"
						onClick={addToFavorites}
					/>
				)}
			</div>

			<div className="relative">
				<Image
					className="w-full mb-2 md:mb-4 rounded-lg shadow aspect-square object-cover"
					src={product.imgUrls[imgIndex]}
					alt={product.name}
					width={512}
					height={512}
				/>

				<ButtonIcon
					className="absolute shadow-md top-[calc(50%-19px)] right-[9.5px]"
					icon="arrow_forward"
					onClick={() => {
						setImgIndex((prev) => (prev + 1) % product.imgUrls.length);
					}}
				/>

				<ButtonIcon
					className="absolute shadow-md top-[calc(50%-19px)] left-[9.5px]"
					icon="arrow_back"
					onClick={() => {
						setImgIndex((prev) =>
							prev === 0 ? product.imgUrls.length - 1 : prev - 1,
						);
					}}
				/>
			</div>

			<div className="grid grid-cols-4 gap-2 md:gap-4">
				{product.imgUrls.map((img, i) => (
					<Image
						role="button"
						className={cn(
							"w-full rounded-lg opacity-100 hover:opacity-50 shadow aspect-square object-cover border border-transparent hover:border-black",
							i === imgIndex && "border-primary",
						)}
						key={`${product.name} ${i + 1}`}
						src={img}
						alt={`${product.name} ${i + 1}`}
						onClick={() => setImgIndex(i)}
						width={128}
						height={128}
					/>
				))}
			</div>
		</div>
	);
}

function Details({ product }: { product: IProduct }) {
	const router = useRouter();

	const dispatch = useDispatch<AppDispatch>();

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const [quantity, setQuantity] = useState(1);

	const productSubcategoryTree = useMemo(() => {
		return categoryTree
			?.flatMap((cat) => [...cat.children, cat])
			.find((cat) => cat.id === product.category);
	}, [categoryTree]);

	const productCategoryTree = useMemo<PublicCategoryTree | undefined>(() => {
		if (!categoryTree) {
			return undefined;
		}

		return categoryTree.find((rootCat) =>
			rootCat.children.some((childCat) => childCat.id === product.category),
		);
	}, [categoryTree, product.category]);

	useEffect(() => {
		sendGTMEvent({
			event: "view_item",
			value: {
				currency: "USD",
				value: product.price,
				items: [
					{
						item_id: product._id,
						item_name: product.name,
						price: product.price,
						quantity: 1,
					},
				],
			},
		});
	}, [product]);

	return (
		<div className="space-y-4 lg:space-y-8">
			<div className="space-y-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={`/products?category=${productCategoryTree?.slug}`}>
									{productCategoryTree?.name}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href={`/products?category=${productSubcategoryTree?.slug}`}
								>
									{productSubcategoryTree?.name}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem className="min-w-0 flex-1">
							<Tooltip>
								<TooltipTrigger asChild>
									<BreadcrumbPage className="truncate">
										{product?.name}
									</BreadcrumbPage>
								</TooltipTrigger>
								<TooltipContent>{product?.name}</TooltipContent>
							</Tooltip>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="space-y-1 lg:space-y-2">
					<h1 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
						{product.name}
					</h1>

					<div className="flex items-center gap-2">
						<div className="text-4xl">{formatPrice(product.price)}</div>
						{product.priceCompare > product.price && (
							<div className="text-muted-foreground line-through text-2xl">
								{formatPrice(product.priceCompare)}
							</div>
						)}
					</div>

					{process.env.NEXT_PUBLIC_REVIEWS === "true" && (
						<Stars value={product.avgRatings} total={product.numReviews} />
					)}
				</div>
			</div>

			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="quantity">Quantity</FieldLabel>
					<div>
						<Input
							className="w-24 h-10"
							id="quantity"
							type="number"
							min={1}
							max={100}
							value={quantity}
							onChange={(e) => setQuantity(parseInt(e.target.value))}
						/>
					</div>
				</Field>
			</FieldGroup>

			<div className="space-y-2 flex flex-col">
				<Button
					size="xl"
					onClick={() => {
						dispatch(postCartItemAsync({ product, quantity }));
						sendGTMEvent({
							event: "add_to_cart",
							value: {
								currency: "USD",
								value: product.price,
								items: [
									{
										item_id: product._id,
										item_name: product.name,
										price: product.price,
										quantity: 1,
									},
								],
							},
						});
					}}
				>
					Add to cart
				</Button>

				<Button
					size="xl"
					variant="secondary"
					onClick={() => {
						dispatch(postCartItemAsync({ product, quantity }));

						sendGTMEvent({
							event: "add_to_cart",
							value: {
								currency: "USD",
								value: product.price,
								items: [
									{
										item_id: product._id,
										item_name: product.name,
										price: product.price,
										quantity: 1,
									},
								],
							},
						});

						router.push("/cart");
					}}
				>
					Buy it now
				</Button>
			</div>

			<Accordion
				defaultValue="item-1"
				type="single"
				collapsible
				className="w-full"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>Description</AccordionTrigger>
					<AccordionContent asChild>
						<div
							className="[&_img]:rounded-lg"
							dangerouslySetInnerHTML={{ __html: product.description }}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Shipping and Refund Policy</AccordionTrigger>
					<AccordionContent>
						<TypographyH4 className="text-sm">Refund Policy</TypographyH4>
						<TypographyP className="leading-5">
							We have a 30-day return policy, which means you have 30 days after
							receiving your item to request a return.
							<br />
							<br />
							To be eligible for a return, your item must be in the same
							condition that you received it, unworn or unused, with tags, and
							in its original packaging. You&apos;ll also need the receipt or
							proof of purchase.
							<br />
							<br />
							To start a return, you can contact us at{" "}
							{process.env.NEXT_PUBLIC_CONTACT}. If your return is accepted,
							we&apos;ll send you a return shipping label, as well as
							instructions on how and where to send your package. Items sent
							back to us without first requesting a return will not be accepted.
							<br />
							<br />
							You can always contact us for any return question at{" "}
							{process.env.NEXT_PUBLIC_CONTACT}.
							<br />
							<br />
						</TypographyP>

						<TypographyH4 className="text-sm">Shipping Policy</TypographyH4>
						<TypographyP className="leading-5">
							All orders are processed within 1 to 3 business days (excluding
							weekends and holidays) after receiving your order confirmation
							email. You will receive another notification when your order has
							shipped.
							<br />
							<br />
						</TypographyP>

						<TypographyH4 className="text-sm">
							International Shipping
						</TypographyH4>
						<TypographyP className="leading-5">
							We offer international shipping to the following countries: United
							States, United Kingdom, Australia, Canada, Germany, France, Spain,
							United Arab Emirates, Indonesia.
							<br />
							<br />
							Your order may be subject to import duties and taxes (including
							VAT), which are incurred once a shipment reaches your destination
							country.
						</TypographyP>
					</AccordionContent>
				</AccordionItem>

				{product.user && (
					<AccordionItem value="item-3">
						<AccordionTrigger>Seller Information</AccordionTrigger>
						<AccordionContent>
							<div className="flex items-center gap-2">
								<Avatar className="h-10 w-10">
									<AvatarImage
										role="button"
										src={product.user.photoUrl}
										alt={`Photo of ${product.user.name}`}
										onClick={() => router.push(`/user/${product.user?._id}`)}
										loading="lazy"
									/>
									<AvatarFallback>{initials(product.user.name)}</AvatarFallback>
								</Avatar>

								<div>
									<Link href={`/user/${product.user._id}`}>
										{product.user.name}
									</Link>

									<TypographyMuted>
										Selling since{" "}
										{stringToDate(
											product.user.createdAt || product.user.updatedAt,
										)}
									</TypographyMuted>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
		</div>
	);
}

export default function ProductDetails({ product }: { product: IProduct }) {
	const options: GetAllProductsOptions = {
		query: {
			excludeIds: [product._id],
			category: product.category,
			limit: 4,
		},
	};

	const { data: similarProducts } = useQuery({
		queryKey: ["similar-products", options],
		queryFn: () => productsService.getAllProducts(options),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<>
			<Section>
				<div
					className={cn(
						"md:relative",
						"grid grid-cols-1 md:grid-cols-2",
						"gap-x-10 gap-y-5",
						process.env.NEXT_PUBLIC_REVIEWS === "true" && "mb-8",
					)}
				>
					<Preview product={product} />
					<Details product={product} />
				</div>

				{process.env.NEXT_PUBLIC_REVIEWS === "true" && (
					<Feedback product={product} />
				)}
			</Section>

			{similarProducts && similarProducts.length > 0 && (
				<Section className="pt-0! space-y-2 lg:space-y-4">
					<TypographyH3 className="text-center">Similar Products</TypographyH3>

					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
						{similarProducts.map((item) => (
							<ProductCard key={item._id} data={item} />
						))}
					</div>
				</Section>
			)}
		</>
	);
}
