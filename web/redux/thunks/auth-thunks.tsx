import { usersService } from "@redux/services/users-service";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateUser, UpdateUserPassword } from "@shared/types/user.type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const loginAsync = createAsyncThunk(
	"auth/login",
	async (
		credentials: {
			email: string;
			password: string;
			router: AppRouterInstance;
		},
		{ rejectWithValue },
	) => {
		const { email, password, router } = credentials;

		try {
			const data = await usersService.login(email, password);

			toast("Welcome back!", { position: "top-center" });

			router.push("/");
			return data;
		} catch (error: any) {
			toast.error("Sign-in failed.", {
				description: error.message,
				position: "top-center",
			});

			return rejectWithValue(error.message);
		}
	},
);

export const signupAsync = createAsyncThunk(
	"auth/signup",
	async (
		credentials: {
			name: string;
			email: string;
			password: string;
		},
		{ rejectWithValue },
	) => {
		const { name, email, password } = credentials;

		try {
			const data = await usersService.signup(name, email, password);

			toast("Account created successfully!");

			return data;
		} catch (error: any) {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
				position: "top-center",
			});

			return rejectWithValue(error.message);
		}
	},
);

export const getMeAsync = createAsyncThunk(
	"auth/getMe",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			return await usersService.getMe(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateMeAsync = createAsyncThunk(
	"auth/updateMe",
	async (
		updatedUser: UpdateUser & { photoFile?: File },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const data = await usersService.updateMe(
				state.authReducer.token,
				updatedUser,
			);

			toast("User settings updated successfully!", { position: "top-center" });

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateMyPasswordAsync = createAsyncThunk(
	"auth/updateMyPassword",
	async (
		updatedUserPassword: UpdateUserPassword,
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const data = await usersService.updateMyPassword(
				state.authReducer.token,
				updatedUserPassword,
			);

			toast("User password updated successfully!", { position: "top-center" });

			return data;
		} catch (error: any) {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
				position: "top-center",
			});

			return rejectWithValue(error.message);
		}
	},
);

export const deleteMeAsync = createAsyncThunk(
	"auth/deleteMe",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			const data = await usersService.deleteMe(state.authReducer.token);

			toast("User deleted successfully!", { position: "top-center" });

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
