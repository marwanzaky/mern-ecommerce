import { toast } from "sonner";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { AppDispatch } from "@redux/store";
import { getUserProductsAsync } from "@redux/thunks/user-products-thunks";
import { getMeAsync, loginAsync } from "@redux/thunks/auth-thunks";
import { getCartMeAsync } from "@redux/thunks/cart-thunks";
import { getFavoritesAsync } from "@redux/thunks/favorites-thunks";
import { setToken } from "@redux/slices/auth-slice";

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
