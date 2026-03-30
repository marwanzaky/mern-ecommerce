import { jsonToFormData } from "@utils/helper";
import {
	Category,
	CreateCategory,
	UpdateCategory,
} from "@shared/types/category.type";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export const adminCategoriesService = {
	getAllCategories,
	addCategory,
	updateCategory,
};

async function getAllCategories(token: string): Promise<Category[]> {
	const response = await fetch(`${baseUrl}/admin/categories`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function addCategory(
	token: string,
	category: CreateCategory & { imgFile?: File },
): Promise<Category[]> {
	const formData = jsonToFormData(category);

	const response = await fetch(`${baseUrl}/admin/categories`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function updateCategory(
	id: string,
	token: string,
	category: UpdateCategory & { imgFile?: File | null },
): Promise<Category> {
	const formData = jsonToFormData(category);

	const response = await fetch(`${baseUrl}/admin/categories/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
