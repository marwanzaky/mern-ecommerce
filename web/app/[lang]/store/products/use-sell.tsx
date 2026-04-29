import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";

import { LineBreakNode, ParagraphNode } from "lexical";
import { useDebouncedCallback } from "use-debounce";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import { categoriesService } from "@/redux/services/categories-service";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
	postUserProductAsync,
	removeUserProductAsync,
	updateUserProductAsync,
} from "@/redux/thunks/user-products-thunks";

import { useI18n } from "@/components/layout/i18n-provider";
import { ImageNode } from "@/components/ui/lexical/nodes/image-node";
import { YouTubeNode } from "@/components/ui/lexical/nodes/youtube-node";

import { CreateProduct, UpdateProduct } from "@/shared/types/product.types";

import { localizePath } from "@/lib/i18n";

import { getSellColumns, SellProduct } from "./columns";

function createProductSchema(t: ReturnType<typeof useI18n>["t"]) {
	const requiredPositiveNumber = z
		.number({ error: t("validation.required") })
		.positive(t("validation.mustBePositive"));

	const optionalPositiveNumber = z
		.number({ error: t("validation.invalidNumber") })
		.positive(t("validation.mustBePositive"))
		.optional();

	return z.object({
		name: z
			.string()
			.nonempty(t("validation.required"))
			.min(2, t("validation.nameShort"))
			.max(120, t("validation.nameLong")),
		description: z.string().nonempty(t("validation.required")),
		category: z.string().nonempty(t("validation.required")),
		priceRangeUsd: z
			.object({
				min: requiredPositiveNumber,
				max: optionalPositiveNumber,
			})
			.refine((data) => !data.max || data.max >= data.min, {
				message: t("validation.maxPriceGteMinPrice"),
				path: ["max"],
			}),
		tags: z.array(z.string()).min(1, t("validation.required")),
		images: z
			.array(
				z
					.object({
						url: z.string().optional(),
						file: z.instanceof(File).optional(),
					})
					.optional(),
			)
			.optional(),
	});
}

export type ProductForm = z.infer<ReturnType<typeof createProductSchema>>;

export function useSell() {
	const router = useRouter();

	const dispatch = useDispatch<AppDispatch>();

	const { locale, t } = useI18n();
	const productSchema = createProductSchema(t);

	const { products, loading } = useAppSelector(
		(state) => state.userProductsReducer,
	);

	const initialConfig: InitialConfigType = {
		namespace: "MyEditor",
		nodes: [
			ImageNode,
			YouTubeNode,
			ParagraphNode,
			LineBreakNode,
			ListNode,
			ListItemNode,
			CodeNode,
			CodeHighlightNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			AutoLinkNode,
			LinkNode,
		],
		onError: console.error,
	};

	const form = useForm<ProductForm>({
		resolver: zodResolver(productSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			description: "",
			priceRangeUsd: {
				min: undefined,
				max: undefined,
			},
			tags: [],
			images: [],
			category: "",
		},
	});

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const tableData: SellProduct[] = products.map((item) => ({
		...item,
		imgUrl: item.imgUrls[0],
	}));

	return {
		columns: getSellColumns({
			categoryTree,
			onDelete: (id) => {
				dispatch(removeUserProductAsync({ id }));
			},
			onStockChange: (id, value) => {
				const product = products.find((p) => p._id === id);

				dispatch(
					updateUserProductAsync({
						id,
						data: {
							stock: value,
							keptImgs: product
								?.imgUrls!.map((imgUrl, index) =>
									imgUrl ? { url: imgUrl, index } : null,
								)
								.filter((el) => el !== null),
						},
					}),
				);
			},
			locale,
			t,
		}),
		tableData,
		loading,

		initialConfig,
		form,

		options: useMemo(
			() => categoryTree?.flatMap((item) => [...item.children, item]) || [],
			[categoryTree],
		),

		addProduct: form.handleSubmit(async (data) => {
			const { priceRangeUsd, name, description, tags, category, images } = data;
			const compare = priceRangeUsd.max ?? priceRangeUsd.min;

			const createProduct: CreateProduct = {
				name,
				description,
				price: priceRangeUsd.min * 100,
				priceCompare: compare * 100,
				imgFiles:
					images &&
					images
						.filter(Boolean)
						.map((img) => img!.file)
						.filter((img) => img !== undefined),
				tags,
				category,
				stock: 1,
			};

			await dispatch(
				postUserProductAsync({
					data: createProduct,
				}),
			);

			form.reset();

			router.push(localizePath("/store/products", locale));
		}),
		updateProduct: ({ id, data }: { id: string; data: ProductForm }) => {
			const { priceRangeUsd, name, description, tags, category, images } = data;
			const compare = priceRangeUsd.max ?? priceRangeUsd.min;

			const newImgs = images!
				.map((img, index) => (img?.file ? { file: img.file, index } : null))
				.filter((el) => el !== null);

			const keptImgs = images!
				.map((img, index) => (img?.url ? { url: img.url, index } : null))
				.filter((el) => el !== null);

			const updatedProduct: UpdateProduct = {
				name,
				description,
				price: priceRangeUsd.min * 100,
				priceCompare: compare * 100,
				newImgs,
				keptImgs,
				tags,
				category,
			};

			dispatch(updateUserProductAsync({ id, data: updatedProduct }));
		},
		onDescriptionChange: useDebouncedCallback(
			(editorState: string, isEmpty: boolean) => {
				form.setValue("description", isEmpty ? "" : editorState, {
					shouldValidate: true,
					shouldDirty: true,
				});
			},
			300,
		),

		description: useWatch({
			control: form.control,
			name: "description",
		}),
	};
}
