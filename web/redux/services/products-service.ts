import {
	ICreateProduct,
	IGetAllProductsDto,
	IProduct,
	IUpdateProduct,
} from "@shared/interfaces";

import { stringify } from "qs";
import { jsonToFormData } from "@utils/helper";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export type GetAllProductsOptions = {
	sort?: {
		property?: keyof IProduct;
		order?: "asc" | "desc";
	};
	query?: {
		excludeIds?: string[];
		name?: string;
		user?: string;
		minPrice?: number;
		maxPrice?: number;
		featured?: boolean;
		limit?: number;
		avgRatings?: number;
		category?: string | null;
	};
};

export const productsService = {
	getAllProducts,
	getProduct,
	post,
	update,
	remove,
	postProductReview,
};

async function getAllProducts(
	options?: GetAllProductsOptions,
): Promise<IProduct[]> {
	const { sort = {}, query = {} } = options || {};

	const paramsObj: IGetAllProductsDto = {
		...query,
		sortProperty: sort.property,
		sortOrder: sort.order,
	};

	const params = stringify(paramsObj, {
		skipNulls: true,
		arrayFormat: "repeat",
	});

	const response = await fetch(`${baseUrl}/products?${params}`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function getProduct(id: string): Promise<IProduct> {
	const response = await fetch(`${baseUrl}/products/${id}`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function post(token: string, product: ICreateProduct): Promise<IProduct> {
	const formData = jsonToFormData({
		...product,
		imgFiles: undefined,
	} satisfies ICreateProduct);

	product.imgFiles?.forEach((file) => {
		formData.append("imgFiles", file);
	});

	const response = await fetch(`${baseUrl}/products`, {
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

async function update(
	token: string,
	id: string,
	product: IUpdateProduct,
): Promise<IProduct> {
	const formData = jsonToFormData({
		...product,
		newImgs: undefined,
		keptImgs: undefined,
	} satisfies IUpdateProduct);

	product.newImgs?.forEach((img) => {
		formData.append("newImgs", img.file);
		formData.append("newImgsIndex", String(img.index));
	});

	product.keptImgs?.forEach((img) => {
		formData.append("keptImgsUrl", img.url);
		formData.append("keptImgsIndex", String(img.index));
	});

	const response = await fetch(`${baseUrl}/products/${id}`, {
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

async function remove(token: string, id: string): Promise<null> {
	const response = await fetch(`${baseUrl}/products/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function postProductReview(
	token: string,
	productId: string,
	rating: number,
	description: string,
): Promise<IProduct> {
	const response = await fetch(`${baseUrl}/products/${productId}/reviews`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			rating,
			description,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
