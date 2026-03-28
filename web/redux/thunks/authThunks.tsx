import { usersService } from "@redux/services/usersService";
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
			toast("Sign-in failed.", { position: "top-center" });

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

			toast({
				title: "Account created successfully!",
				duration: 3000,
			});

			return data;
		} catch (error: any) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: error.message,
				duration: 3000,
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
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

			toast({
				title: "User settings updated successfully!",
				duration: 3000,
			});

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

			toast({
				title: "User password updated successfully!",
				duration: 3000,
			});

			return data;
		} catch (error: any) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: error.message,
				duration: 3000,
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
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

			toast({
				title: "User deleted successfully!",
				duration: 3000,
			});

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
