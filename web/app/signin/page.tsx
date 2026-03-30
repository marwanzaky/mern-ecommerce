"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { handleLogin } from "@utils/auth-helpers";

import { Section } from "@shared/components/ui/section";
import { Button } from "@shadcn/components/ui/button";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@shadcn/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";

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
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						onSubmit={handleSubmit(({ email, password }) => {
							handleLogin(email, password, dispatch, router);
						})}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="text"
									placeholder="m@example.com"
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
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>

									<Link
										href="/forgot-password"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>

								<Input
									id="password"
									type="password"
									{...register("password", {
										required: "This field is required.",
									})}
								/>
							</Field>

							<Field>
								<Button type="submit">Login</Button>
								<Button
									type="button"
									variant="outline"
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
									Login with Google
								</Button>
								<FieldDescription className="text-center">
									Don&apos;t have an account?{" "}
									<Link href="/signup">Sign up</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</Section>
	);
}
