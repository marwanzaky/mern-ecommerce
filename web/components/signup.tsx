"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signupAsync } from "@redux/thunks/auth-thunks";
import { useForm } from "react-hook-form";
import { Section } from "@shared/components/ui/section";
import { Button } from "@shadcn/components/ui/button";
import { Input } from "@shadcn/components/ui/input";
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

type Form = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Signup() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Form>({ mode: "onTouched" });

	const password = watch("password");

	const dispatch = useDispatch<AppDispatch>();

	return (
		<Section>
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your information below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-2"
						onSubmit={handleSubmit(async ({ name, email, password }) => {
							const action = await dispatch(
								signupAsync({ name, email, password }),
							);

							if (signupAsync.fulfilled.match(action)) {
								router.push("/signin");
							}
						})}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									{...register("name", {
										required: "This field is required.",
										minLength: { value: 2, message: "Name is too short." },
										maxLength: { value: 16, message: "Name is too long." },
										pattern: {
											value: /^[a-zA-Z\s'-]+$/,
											message: "Invalid characters in name.",
										},
									})}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									{...register("email", {
										required: "This field is required.",
										minLength: { value: 2, message: "Email is too short." },
										maxLength: { value: 32, message: "Email is too long." },
										pattern: {
											value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
											message: "Invalid characters in email.",
										},
									})}
								/>
								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									type="password"
									{...register("password", {
										required: "This field is required.",
										minLength: {
											value: 8,
											message: "Password is too short.",
										},
										maxLength: {
											value: 32,
											message: "Password is too long.",
										},
									})}
								/>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="confirm-password">
									Confirm Password
								</FieldLabel>

								<Input
									id="confirm-password"
									type="password"
									{...register("confirmPassword", {
										required: "This field is required.",
										validate: (value) =>
											value === password || "Passwords do not match.",
									})}
								/>
								<FieldDescription>
									Please confirm your password.
								</FieldDescription>
							</Field>

							<FieldGroup>
								<Field>
									<Button type="submit">Create Account</Button>
									<Button
										variant="outline"
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
										Sign up with Google
									</Button>
									<FieldDescription className="px-6 text-center">
										Already have an account? <Link href="/signin">Sign in</Link>
									</FieldDescription>
								</Field>
							</FieldGroup>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</Section>
	);
}
