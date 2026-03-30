"use client";

import { handleGoogleAuth } from "@utils/auth-helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const dispatch = useDispatch();

	useEffect(() => {
		const token = searchParams.get("token");

		if (token) {
			handleGoogleAuth(token, dispatch, router);
		}
	}, [searchParams, router]);

	return <p>Logging you in...</p>;
}
