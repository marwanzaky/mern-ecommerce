import { toast } from "sonner";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { AppDispatch } from "@redux/store";
import { getUserProductsAsync } from "@redux/thunks/userProductsThunks";
import { getMeAsync, loginAsync } from "@redux/thunks/authThunks";
import { getCartMeAsync } from "@redux/thunks/cartThunks";
import { getFavoritesAsync } from "@redux/thunks/favoritesThunks";
import { setToken } from "@redux/slices/authSlice";

export const handleLogin = async (
	email: string,
	password: string,
	dispatch: AppDispatch,
	router: AppRouterInstance,
) => {
	await dispatch(loginAsync({ email, password, router })).unwrap();
	await dispatch(getMeAsync());
	await dispatch(getCartMeAsync());
	await dispatch(getFavoritesAsync());
	await dispatch(getUserProductsAsync());
};

export const handleGoogleAuth = async (
	token: string,
	dispatch: AppDispatch,
	router: AppRouterInstance,
) => {
	dispatch(setToken(token));

	await dispatch(getMeAsync()).unwrap();
	await dispatch(getCartMeAsync());
	await dispatch(getFavoritesAsync());
	await dispatch(getUserProductsAsync());

	toast("Welcome back!", { position: "top-center" });

	router.push("/");
};
