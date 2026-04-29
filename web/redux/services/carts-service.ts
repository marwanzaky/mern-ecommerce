import { CartEntity } from "@/shared/types/cart.type";

import { clientFetch } from "@/lib/api-client";

export const cartsService = {
	getMe: () => clientFetch<CartEntity>("/carts"),
	postItem: (productId: string, quantity: number) =>
		clientFetch<CartEntity>(`/carts/items/${productId}`, {
			method: "POST",
			body: JSON.stringify({
				quantity,
			}),
		}),
	updateItemQuantity: (productId: string, quantity: number) => {
		if (quantity <= 0) {
			quantity = 1;
		}

		return clientFetch<CartEntity>(`/carts/items/${productId}/quantity`, {
			method: "PATCH",
			body: JSON.stringify({
				quantity,
			}),
		});
	},
	deleteItem: (productId: string) =>
		clientFetch<CartEntity>(`/carts/items/${productId}`, {
			method: "DELETE",
		}),
};
