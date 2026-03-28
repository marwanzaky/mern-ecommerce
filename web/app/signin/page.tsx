"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { handleLogin } from "@utils/authHelpers";

import { InputText } from "@shared/components/inputText";
import { Section } from "@shared/components/section";
import { TypographyH4 } from "@shared/shadcn/typography";
import Icon from "@shared/ui/icon";
import { Button } from "@shadcn/components/ui/button";

type Inputs = {
	email: string;
	password: string;
};

export default function Page() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({ mode: "onTouched" });

	const dispatch = useDispatch();

	return (
		<Section>
			<form
				onSubmit={handleSubmit(({ email, password }) => {
					handleLogin(email, password, dispatch, router, toast);
				})}
				className="m-auto max-w-lg"
			>
				<TypographyH4 className="text-center mb-4">Sign In</TypographyH4>
				<p className="text-center text-grey mb-8 text-muted-foreground">
					Sign in to get personalized product recommendations, save and
					synchronize your data across your devices.
				</p>

				<div className="flex flex-col gap-4">
					<InputText
						type="text"
						placeholder="Enter Email"
						icon="mail"
						message={errors.email?.message}
						{...register("email", {
							required: "This field is required.",
							minLength: { value: 2, message: "Email is too short." },
							maxLength: { value: 32, message: "Email is too long." },
							pattern: {
								value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
								message: "Invalid characters in email",
							},
						})}
					/>
					<InputText
						type="password"
						placeholder="Enter Password"
						icon="password"
						message={errors.password?.message}
						{...register("password", {
							required: "This field is required.",
						})}
					/>

					<div className="flex flex-col gap-2">
						<Button size="xl" type="submit">
							Sign in
						</Button>

						<Button
							variant="secondary"
							size="xl"
							type="button"
							onClick={() => {
								window.location.href = `${process.env.NEXT_PUBLIC_SERVER!}/auth/google`;
							}}
						>
							<Icon src="google.svg" />
							Sign in with Google
						</Button>
					</div>

					<p className="text-center text-custom-background">
						Not a member yet?&emsp;
						<Link
							className="hover:underline font-bold text-foreground"
							href="/signup"
						>
							Sign Up
						</Link>
					</p>
				</div>
			</form>
		</Section>
	);
}
