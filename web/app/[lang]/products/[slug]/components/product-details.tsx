"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Heart, ShoppingCart } from "lucide-react";

import { sendGTMEvent } from "@next/third-parties/google";

import { AppDispatch } from "@/redux/store";
import { postCartItemAsync } from "@/redux/thunks/cart-thunks";

import { useI18n } from "@/components/layout/i18n-provider";
import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";
import { renderLexicalJSONToHTML } from "@/components/ui/lexical/render-lexical-json-to-html";
import Stars from "@/components/ui/stars";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shadcn/components/ui/accordion";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { ProductWithReviewsEntity } from "@/shared/types/product.types";

import { localizePath } from "@/lib/i18n";

import { formatPrice } from "@/utils/format";
import { initials, stringToDate } from "@/utils/string-utils";

import { useToggleFavorite } from "@/hooks/use-toggle-favorite";

import ProductBreadcrumb from "./product-breadcrumb";

export default function ProductDetails({
	product,
}: {
	product: ProductWithReviewsEntity;
}) {
	const router = useRouter();
	const { locale, t } = useI18n();

	const dispatch = useDispatch<AppDispatch>();

	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(product);

	const [quantity, setQuantity] = useState(1);

	const descriptionHtml = useMemo(() => {
		const parsed = JSON.parse(product.description[locale]);
		return renderLexicalJSONToHTML(parsed.root.children);
	}, [product.description, locale]);

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
				<ProductBreadcrumb product={product} />

				<div className="space-y-1 lg:space-y-2">
					<h1 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
						{product.name[locale]}
					</h1>

					<div className="flex items-center gap-3 overflow-hidden">
						<div className="text-4xl">
							{formatPrice(product.price / 100, locale)}
						</div>
						{product.priceCompare > product.price && (
							<div className="text-muted-foreground line-through text-2xl">
								{formatPrice(product.priceCompare / 100, locale)}
							</div>
						)}

						{product.discount !== "0%" && (
							<Badge className="border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5">
								{product.discount} {t("product.discountOff")}
							</Badge>
						)}
					</div>

					<Stars value={product.avgRatings} total={product.numReviews} />
				</div>
			</div>

			<Separator />

			<div className="space-y-2 flex flex-col">
				<div className="flex gap-2">
					<InputWithPlusMinusButtons
						className="w-30"
						min={1}
						max={10}
						value={quantity}
						onChange={setQuantity}
					/>
					<Button
						size="xl"
						className="flex-1"
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
						<ShoppingCart />
						{t("product.actions.addToCart")}
					</Button>

					{isFavorite ? (
						<Button
							size="xl"
							variant="outline"
							aria-label={t("product.actions.removeFromFavorites")}
							onClick={removeFromFavorites}
						>
							<Heart fill="currentColor" className="text-primary" />
						</Button>
					) : (
						<Button
							size="xl"
							variant="outline"
							aria-label={t("product.actions.addToFavorites")}
							onClick={addToFavorites}
						>
							<Heart />
						</Button>
					)}
				</div>

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

						router.push(localizePath("/cart", locale));
					}}
				>
					{t("product.actions.buyNow")}
				</Button>
			</div>

			<Accordion
				defaultValue="item-1"
				type="single"
				collapsible
				className="w-full"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>
						{t("product.accordion.description")}
					</AccordionTrigger>
					<AccordionContent asChild>
						<div
							className="prose prose-slate text-sm [&_img]:rounded-lg"
							dangerouslySetInnerHTML={{
								__html: descriptionHtml,
							}}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>
						{t("product.accordion.shippingRefundPolicy")}
					</AccordionTrigger>
					<AccordionContent className="prose prose-slate text-sm">
						<h4>Refund Policy</h4>
						<p>
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
						</p>

						<h4>Shipping Policy</h4>
						<p>
							All orders are processed within 1 to 3 business days (excluding
							weekends and holidays) after receiving your order confirmation
							email. You will receive another notification when your order has
							shipped.
							<br />
							<br />
						</p>

						<h4>International Shipping</h4>
						<p>
							We offer international shipping to the following countries: United
							States, United Kingdom, Australia, Canada, Germany, France, Spain,
							United Arab Emirates, Indonesia.
							<br />
							<br />
							Your order may be subject to import duties and taxes (including
							VAT), which are incurred once a shipment reaches your destination
							country.
						</p>
					</AccordionContent>
				</AccordionItem>

				{product.user && (
					<AccordionItem value="item-3">
						<AccordionTrigger>
							{t("product.accordion.sellerInformation")}
						</AccordionTrigger>
						<AccordionContent>
							<div className="flex items-center gap-2">
								<Avatar className="h-10 w-10">
									<AvatarImage
										role="button"
										src={product.user.photoUrl}
										alt={t("photoOf").replace("{{name}}", product.user.name)}
										onClick={() =>
											router.push(
												localizePath(`/user/${product.user?._id}`, locale),
											)
										}
										loading="lazy"
									/>
									<AvatarFallback>{initials(product.user.name)}</AvatarFallback>
								</Avatar>

								<div>
									<Link
										href={localizePath(`/user/${product.user._id}`, locale)}
										className="no-underline! hover:underline!"
									>
										{product.user.name}
									</Link>
									{/* <Link href="#">test</Link> */}

									<TypographyMuted>
										{t("product.accordion.sellingSince")}{" "}
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
