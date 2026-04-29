import { toast } from "sonner";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { cartsService } from "@/redux/services/carts-service";
import { guestCartService } from "@/redux/services/guest-cart-service";
import { RootState } from "@/redux/store";

import { CartProductEntity } from "@/shared/types/cart.type";
import { ProductEntity } from "@/shared/types/product.types";

export const getCartMeAsync = createAsyncThunk(
	"cart/getCartMe",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				return await guestCartService.getMe();
			}

			return await cartsService.getMe();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postCartItemAsync = createAsyncThunk(
	"cart/postCartItem",
	async (
		{ product, quantity = 1 }: { product: ProductEntity; quantity?: number },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				const updatedCart = await guestCartService.postItem(product, quantity);

				toast("Added to cart (guest).", { position: "top-center" });

				return updatedCart;
			}

			const updatedCart = await cartsService.postItem(product._id, quantity);

			toast("Added to cart.", { position: "top-center" });

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateCartItemQuantityAsync = createAsyncThunk(
	"cart/updateCartItemQuantity",
	async (
		{ productId, quantity }: { productId: string; quantity: number },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				return await guestCartService.updateItemQuantity(productId, quantity);
			}

			return await cartsService.updateItemQuantity(productId, quantity);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const deleteCartItemAsync = createAsyncThunk(
	"cart/deleteCartItem",
	async (
		{ product }: { product: CartProductEntity },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				const updatedCart = await guestCartService.deleteItem(product._id);

				toast("Removed from cart (guest).", { position: "top-center" });

				return updatedCart;
			}

			const updatedCart = await cartsService.deleteItem(product._id);

			toast("Removed from cart.", { position: "top-center" });

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
