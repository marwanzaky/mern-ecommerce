"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { handleLogin } from "@utils/authHelpers";

import { InputText } from "@shared/components/inputText";
import { Section } from "@shared/components/section";
import { TypographyH4 } from "@shared/shadcn/typography";
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
					handleLogin(email, password, dispatch, router);
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
						<Button size="lg" type="submit">
							Sign in
						</Button>

						<Button
							variant="outline"
							size="lg"
							type="button"
							onClick={() => {
								window.location.href = `${process.env.NEXT_PUBLIC_SERVER!}/auth/google`;
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
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
