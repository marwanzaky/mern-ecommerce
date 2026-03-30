import { productsService } from "@redux/services/products-service";
import { usersService } from "@redux/services/users-service";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateProduct, IProduct, IUpdateProduct } from "@shared/interfaces";
import { toast } from "sonner";

export const getUserProductsAsync = createAsyncThunk(
	"userProducts/getUserProducts",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			return await usersService.getMeProducts(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postUserProductAsync = createAsyncThunk(
	"cart/postUserProduct",
	async ({ data }: { data: ICreateProduct }, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			const updatedCart = await productsService.post(
				state.authReducer.token,
				data,
			);

			toast("Product added.", { position: "top-center" });

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateUserProductAsync = createAsyncThunk(
	"userProducts/updateUserProduct",
	async (
		{ id, data }: { id: string; data: IUpdateProduct },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const response = await productsService.update(
				state.authReducer.token,
				id,
				data,
			);

			toast && toast("Product updated.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeUserProductAsync = createAsyncThunk(
	"userProducts/removeUserProduct",
	async ({ product }: { product: IProduct }, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			const response = await productsService.remove(
				state.authReducer.token,
				product._id,
			);

			toast("Product deleted.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
