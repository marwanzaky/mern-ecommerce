import {
	PublicCategory,
	PublicCategoryTree,
} from "@shared/types/category.type";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export const categoriesService = {
	getAllCategories,
	getCategoryTree,
};

async function getAllCategories(): Promise<PublicCategory[]> {
	const response = await fetch(`${baseUrl}/categories`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function getCategoryTree(): Promise<PublicCategoryTree[]> {
	const response = await fetch(`${baseUrl}/categories/tree`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
