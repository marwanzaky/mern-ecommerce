import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	postFavoritesAsync,
	removeFavoritesAsync,
} from "@redux/thunks/favorites-thunks";
import { IProduct } from "@shared/interfaces";

export function useToggleFavorite(product: IProduct) {
	const router = useRouter();

	const dispatch = useDispatch<AppDispatch>();

	const { isAuthenticated } = useAppSelector((state) => state.authReducer);
	const { items } = useAppSelector((state) => state.favoritesReducer);

	const isFavorite = items.some((item) => item._id === product._id);

	const signin = () => {
		router.push("/signin");
	};

	const addToFavorites = () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			dispatch(postFavoritesAsync({ product }));
		}
	};

	const removeFromFavorites = () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			dispatch(removeFavoritesAsync({ product }));
		}
	};

	return { isFavorite, addToFavorites, removeFromFavorites };
}
