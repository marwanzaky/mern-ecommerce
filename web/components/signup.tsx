"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signupAsync } from "@redux/thunks/authThunks";
import { InputText } from "@shared/components/inputText";
import { useForm } from "react-hook-form";
import { Section } from "@shared/components/section";
import { TypographyH4 } from "@shared/shadcn/typography";
import Icon from "@shared/ui/icon";
import { Button } from "@shadcn/components/ui/button";

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
			<form
				onSubmit={handleSubmit(async ({ name, email, password }) => {
					const action = await dispatch(signupAsync({ name, email, password }));

					if (signupAsync.fulfilled.match(action)) {
						router.push("/signin");
					}
				})}
				className="m-auto max-w-lg"
			>
				<TypographyH4 className="text-center mb-4">Sign Up</TypographyH4>
				<p className="text-center text-grey mb-8 text-muted-foreground">
					Create an account to unlock all the benefits to easily save and
					synchronize your data across your devices.
				</p>

				<div className="flex flex-col gap-4">
					<InputText
						type="text"
						placeholder="Enter Name"
						icon="person"
						message={errors.name?.message}
						hasError={!!errors.name}
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
					<InputText
						type="text"
						placeholder="Enter Email"
						icon="mail"
						message={errors.email?.message}
						hasError={!!errors.email}
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
					<InputText
						type="password"
						placeholder="Enter Password"
						icon="password"
						message={errors.password?.message}
						hasError={!!errors.password}
						{...register("password", {
							required: "This field is required.",
							minLength: { value: 8, message: "Password is too short." },
							maxLength: { value: 32, message: "Password is too long." },
						})}
					/>
					<InputText
						type="password"
						placeholder="Repeat Password"
						icon="password"
						message={errors.confirmPassword?.message}
						hasError={!!errors.confirmPassword}
						{...register("confirmPassword", {
							required: "This field is required.",
							validate: (value) =>
								value === password || "Passwords do not match.",
						})}
					/>

					<div className="flex flex-col gap-2">
						<Button size="xl" type="submit">
							Sign up
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
							Sign up with Google
						</Button>
					</div>

					<p className="text-center text-custom-background">
						Have an account?&emsp;
						<Link
							className="hover:underline font-bold text-foreground"
							href="/signin"
						>
							Sign In
						</Link>
					</p>
				</div>
			</form>
		</Section>
	);
}
