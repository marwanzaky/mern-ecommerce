"use client";

import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import { useI18n } from "@/components/layout/i18n-provider";
import { renderLexicalJSONToHTML } from "@/components/ui/lexical/render-lexical-json-to-html";

import { Button } from "@/shadcn/components/ui/button";
import { Heading } from "@/shadcn/components/ui/typography";

import { ProductEntity } from "@/shared/types/product.types";

import { localizePath } from "@/lib/i18n";

import { createProductSlug } from "@/utils/string-utils";

export default function Header({
	heroProduct,
}: {
	heroProduct: ProductEntity;
}) {
	const { locale, t } = useI18n();

	const shortDescriptionHtml = useMemo(() => {
		if (!heroProduct.shortDescription) {
			return "";
		}

		const parsed = JSON.parse(heroProduct.shortDescription[locale] || "");

		return renderLexicalJSONToHTML(parsed.root.children);
	}, [heroProduct.shortDescription, locale]);

	return (
		<header className="full-bleed relative px-4 py-16 md:py-16">
			<Image
				fill
				priority
				className="object-center object-cover pointer-events-none z-[-1]"
				src="/img/background.jpg"
				alt="background"
				fetchPriority="high"
			/>

			<div className="space-y-4">
				<div className="space-y-6">
					<Heading
						as="h1"
						className="text-center text-white text-4xl md:text-5xl"
					>
						{heroProduct.name[locale]}.
					</Heading>
					<div
						className="mx-auto max-w-sm text-white text-center"
						dangerouslySetInnerHTML={{
							__html: shortDescriptionHtml,
						}}
					/>
				</div>

				<div className="flex justify-center gap-2">
					<Link
						href={localizePath(
							`/products/${createProductSlug(heroProduct.name.en, heroProduct._id)}`,
							locale,
						)}
					>
						<Button size="lg">{t("home.shopNow")}</Button>
					</Link>
					<Link href={localizePath("/products", locale)}>
						<Button size="lg" variant="ghost" className="text-white">
							{t("home.explore")}
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}
