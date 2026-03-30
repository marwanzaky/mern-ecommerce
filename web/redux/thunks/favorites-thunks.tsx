import { RootState } from "@redux/store";
import { favoritesService } from "@redux/services/favorites-service";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct } from "@shared/interfaces";
import { toast } from "sonner";

export const getFavoritesAsync = createAsyncThunk(
	"favorites/getFavorites",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			return await favoritesService.getMe(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postFavoritesAsync = createAsyncThunk(
	"favorites/postFavorites",
	async ({ product }: { product: IProduct }, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			const response = await favoritesService.post(
				state.authReducer.token,
				product._id,
			);

			toast("Added to favorites.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeFavoritesAsync = createAsyncThunk(
	"favorites/removeFavorites",
	async ({ product }: { product: IProduct }, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			const response = await favoritesService.remove(
				state.authReducer.token,
				product._id,
			);

			toast("Removed to favorites.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
