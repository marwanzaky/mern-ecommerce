"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

import { localizePath } from "@/lib/i18n";

import { ProductBase } from "../product-base";
import { useSell } from "../use-sell";

export default function Page() {
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const { locale, t } = useI18n();
	const {
		initialConfig,
		form,
		onDescriptionChange,
		options,
		description,
		updateProduct,
		loading,
	} = useSell();

	const { products } = useAppSelector((state) => state.userProductsReducer);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const product = products.find((p) => p._id === params.id);

		if (product) {
			form.reset({
				name: product.name.en,
				description: product.description.en,
				priceRangeUsd: {
					min: product.price / 100,
					max: product.priceCompare / 100,
				},
				tags: product.tags,
				images: product.imgUrls.map((el) => ({ url: el })),
				category: product.category ?? undefined,
			});
		}
	}, [products, params.id, form]);

	return (
		<ProductBase
			initialConfig={initialConfig}
			form={form}
			options={options}
			onDescriptionChange={onDescriptionChange}
			description={description}
			onSubmit={form.handleSubmit((data) =>
				updateProduct({ id: params.id, data }),
			)}
			submitButtonText={t("buttons.update")}
			cancelButtonAction={() =>
				router.push(localizePath("/store/products", locale))
			}
			injectLoadDescriptionPlugin
			loading={loading}
		/>
	);
}
