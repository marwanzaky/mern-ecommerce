import { cartsService } from "@redux/services/carts-service";
import { guestCartService } from "@redux/services/guest-cart-service";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct } from "@shared/interfaces";
import { toast } from "sonner";

export const getCartMeAsync = createAsyncThunk(
	"cart/getCartMe",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				return await guestCartService.getMe();
			}

			return await cartsService.getMe(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postCartItemAsync = createAsyncThunk(
	"cart/postCartItem",
	async (
		{ product, quantity = 1 }: { product: IProduct; quantity?: number },
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

			const updatedCart = await cartsService.postItem(
				state.authReducer.token,
				product._id,
				quantity,
			);

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

			return await cartsService.updateItemQuantity(
				state.authReducer.token,
				productId,
				quantity,
			);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const deleteCartItemAsync = createAsyncThunk(
	"cart/deleteCartItem",
	async ({ product }: { product: IProduct }, { getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				const updatedCart = await guestCartService.deleteItem(product._id);

				toast("Removed from cart (guest).", { position: "top-center" });

				return updatedCart;
			}

			const updatedCart = await cartsService.deleteItem(
				state.authReducer.token,
				product._id,
			);

			toast("Removed from cart.", { position: "top-center" });

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
