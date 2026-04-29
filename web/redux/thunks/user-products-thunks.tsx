import { toast } from "sonner";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { productsService } from "@/redux/services/products-service";
import { usersService } from "@/redux/services/users-service";

import { CreateProduct, UpdateProduct } from "@/shared/types/product.types";

export const getUserProductsAsync = createAsyncThunk(
	"userProducts/getUserProducts",
	async (_, { rejectWithValue }) => {
		try {
			return await usersService.getMeProducts();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postUserProductAsync = createAsyncThunk(
	"cart/postUserProduct",
	async ({ data }: { data: CreateProduct }, { rejectWithValue }) => {
		try {
			const updatedCart = await productsService.post(data);

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
		{ id, data }: { id: string; data: UpdateProduct },
		{ rejectWithValue },
	) => {
		try {
			const response = await productsService.update(id, data);

			toast && toast("Product updated.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeUserProductAsync = createAsyncThunk(
	"userProducts/removeUserProduct",
	async ({ id }: { id: string }, { rejectWithValue }) => {
		try {
			const response = await productsService.remove(id);

			toast("Product deleted.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
