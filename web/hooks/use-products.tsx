import { stringify } from "qs";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { categoriesService } from "@redux/services/categories-service";
import {
	GetAllProductsOptions,
	productsService,
} from "@redux/services/products-service";
import { IProduct } from "@shared/interfaces";

export type SortOption =
	| "relevancy"
	| "most-popular"
	| "low-price"
	| "high-price";

export type ProductsPageParams = {
	name: string | undefined;
	sort: SortOption;
	minPrice: string | undefined;
	maxPrice: string | undefined;
	rating: string | undefined;
	category: string | undefined;
};

export function useProducts() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialParams = Object.fromEntries(
		searchParams.entries(),
	) as ProductsPageParams;

	const [sort, setSort] = useState<SortOption>(
		initialParams.sort || "relevancy",
	);

	const [name, setName] = useState<string | undefined>(initialParams.name);

	const [category, setCategory] = useState<string | undefined>(
		initialParams.category,
	);

	const [minPrice, setMinPrice] = useState<number | undefined>(
		initialParams.minPrice ? parseInt(initialParams.minPrice) : undefined,
	);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(
		initialParams.maxPrice ? parseInt(initialParams.maxPrice) : undefined,
	);

	const [rating, setRating] = useState<number | undefined>(
		initialParams.rating ? parseInt(initialParams.rating) : undefined,
	);

	const [draftName, setDraftName] = useState<string | undefined>();

	const [draftCategory, setDraftCategory] = useState<string | undefined>();

	const [draftMinPrice, setDraftMinPrice] = useState<number | undefined>(
		undefined,
	);
	const [draftMaxPrice, setDraftMaxPrice] = useState<number | undefined>(
		undefined,
	);

	const [draftRating, setDraftRating] = useState<number | undefined>(undefined);

	const sortMap: Record<
		SortOption,
		{ property: keyof IProduct; order: "asc" | "desc" }
	> = {
		relevancy: { property: "createdAt", order: "asc" },
		"most-popular": { property: "numReviews", order: "desc" },
		"low-price": { property: "price", order: "asc" },
		"high-price": { property: "price", order: "desc" },
	};

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const categories = useMemo(() => {
		if (!categoryTree) return [];
		return categoryTree.flatMap((cat) => [...cat.children, cat]);
	}, [categoryTree]);

	const productsOptions: GetAllProductsOptions = {
		sort: sortMap[sort],
		query: {
			name,
			minPrice,
			maxPrice,
			avgRatings: rating,
			category: categories
				? categories.find((cat) => cat.slug === category)?.id
				: null,
		},
	};

	const { data, isLoading } = useQuery({
		queryKey: ["products", productsOptions],
		queryFn: () => productsService.getAllProducts(productsOptions),
		staleTime: 1000 * 60 * 5,
	});

	const options: { label: string; value: SortOption }[] = [
		{ label: "Relevancy", value: "relevancy" },
		{ label: "Most popular", value: "most-popular" },
		{ label: "Low price", value: "low-price" },
		{ label: "High price", value: "high-price" },
	];

	const [visible, setVisible] = useState(false);

	const updateParams = () => {
		const params: ProductsPageParams = {
			name,
			sort,
			category,
			minPrice: minPrice?.toString(),
			maxPrice: maxPrice?.toString(),
			rating: rating?.toString(),
		};

		router.push(`/products?${stringify(params, { skipNulls: true })}`);
	};

	const openFilterDialog = () => {
		setVisible(true);

		setDraftName(name);
		setDraftMaxPrice(maxPrice && maxPrice / 100);
		setDraftMinPrice(minPrice && minPrice / 100);
		setDraftRating(rating);
		setDraftCategory(category);
	};

	const clearPriceRange = () => {
		setMinPrice(undefined);
		setMaxPrice(undefined);
	};

	const clearRating = () => {
		setRating(undefined);
	};

	const clearName = () => {
		setName(undefined);
	};

	const clearCategory = () => {
		setCategory(undefined);
	};

	const applyFilters = () => {
		setName(draftName);
		setMaxPrice(draftMaxPrice && draftMaxPrice * 100);
		setMinPrice(draftMinPrice && draftMinPrice * 100);
		setRating(draftRating);
		setVisible(false);
		setCategory(draftCategory);
	};

	const cancelFilters = () => {
		setVisible(false);
	};

	useEffect(() => {
		updateParams();
	}, [name, sort, minPrice, maxPrice, rating, category]);

	useEffect(() => {
		const params = Object.fromEntries(
			searchParams.entries(),
		) as ProductsPageParams;
		setName(params.name);
		setCategory(params.category);
	}, [searchParams]);

	return {
		isLoading,
		data,

		name,
		category,
		minPrice,
		maxPrice,
		rating,
		options,
		categories,

		sort,
		setSort,
		visible,
		setVisible,

		draftName,
		setDraftName,
		draftCategory,
		setDraftCategory,
		draftMinPrice,
		setDraftMinPrice,
		draftMaxPrice,
		setDraftMaxPrice,
		draftRating,
		setDraftRating,

		openFilterDialog,

		clearName,
		clearCategory,
		clearRating,
		clearPriceRange,
		cancelFilters,

		applyFilters,
	};
}
