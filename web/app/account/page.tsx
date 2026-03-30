"use client";

import { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	deleteMeAsync,
	updateMeAsync,
	updateMyPasswordAsync,
} from "@redux/thunks/auth-thunks";

import { Section } from "@shared/components/ui/section";
import { ButtonIcon } from "@shared/components/ui/button-icon";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@shadcn/components/ui/alert-dialog";

import {
	TypographyH2,
	TypographyH3,
	TypographyH4,
	TypographyMuted,
} from "@shadcn/components/ui/typography";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@shadcn/components/ui/button";
import { toast } from "sonner";

import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";
import { initials } from "@utils/string-utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@shadcn/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@shadcn/components/ui/card";

function PersonalInformationForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		formState,
		control,
	} = useForm<{
		name?: string;
		email?: string;
		photo: {
			url: string;
			file?: File;
		};
	}>();

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useAppSelector((state) => state.authReducer);

	const inputRef = useRef<HTMLInputElement>(null);

	const resetForm = () => {
		user &&
			reset({
				name: user.name,
				email: user.email,
				photo: {
					url: user.photoUrl,
				},
			});
	};

	useEffect(() => {
		resetForm();
	}, [user]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal information</CardTitle>
				<CardDescription>
					Manage your personal details and how your profile appears Enter your
					information below
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit((data) => {
						dispatch(
							updateMeAsync({
								name: data.name,
								email: data.email,
								...(data.photo.file
									? { photoFile: data.photo.file }
									: { photoUrl: data.photo.url }),
							}),
						);
					})}
					className="space-y-4"
				>
					<input
						ref={inputRef}
						className="hidden"
						type="file"
						accept=".png, .jpg, .jpeg"
						onChange={async (event) => {
							const file = event.target.files?.[0];
							if (!file) return;

							if (file.size > 4 * 1024 * 1024) {
								alert("Image size exceeds the 4MB limit");
								event.target.value = "";
								return;
							}

							setValue("photo", { url: "", file }, { shouldDirty: true });
							event.target.value = "";
						}}
					/>

					<FieldGroup>
						<Field>
							<FieldLabel>Profile Photo</FieldLabel>
							<div className="flex items-center gap-4">
								<Controller
									name="photo"
									control={control}
									render={({ field }) => {
										const { value } = field;
										const [previewUrl, setPreviewUrl] = useState(
											value?.url || "",
										);

										useEffect(() => {
											let url: string | undefined;

											if (value?.file) {
												url = URL.createObjectURL(value.file);
												setPreviewUrl(url);
											} else {
												setPreviewUrl(value?.url || "");
											}

											return () => {
												if (url) {
													URL.revokeObjectURL(url);
												}
											};
										}, [value?.file, value?.url]);

										return (
											<Avatar className="h-12 w-12">
												<AvatarImage src={previewUrl} />
												<AvatarFallback>{initials(user!.name)}</AvatarFallback>
											</Avatar>
										);
									}}
								/>

								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<Button
											variant="secondary"
											type="button"
											onClick={() => inputRef.current?.click()}
										>
											Change avatar
										</Button>

										<ButtonIcon
											size="sm"
											type="button"
											icon="delete"
											onClick={() => {
												const current = user?.photoUrl;

												setValue(
													"photo",
													{ url: "", file: undefined },
													{ shouldDirty: !!current },
												);
											}}
										/>
									</div>

									<TypographyMuted className="text-xs">
										Must be a .jpg, or .png file smaller than 4MB.
									</TypographyMuted>
								</div>
							</div>
						</Field>
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
										value: /^[a-zA-Z0-9\s'-]+$/,
										message: "Invalid characters in name.",
									},
								})}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="name">Email</FieldLabel>
							<Input
								id="name"
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
						</Field>
						<Field orientation="horizontal">
							<Button
								variant="outline"
								disabled={!formState.isDirty}
								onClick={resetForm}
							>
								Cancel
							</Button>

							<Button type="submit" disabled={!formState.isDirty}>
								Save
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}

function ChangePasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		formState,
		reset,
	} = useForm<{
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}>();
	const dispatch = useDispatch<AppDispatch>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change password</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit((data) => {
						const { currentPassword, newPassword, confirmPassword } = data;
						if (newPassword === confirmPassword) {
							dispatch(updateMyPasswordAsync({ currentPassword, newPassword }));
							reset();
						} else {
							toast("The passwords you entered do not match.", {
								position: "top-center",
							});
						}
					})}
				>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="current-password">
								Current Password
							</FieldLabel>
							<Input
								id="current-password"
								type="password"
								{...register("currentPassword", {
									required: "This field is required.",
									minLength: { value: 8, message: "Password is too short." },
									maxLength: { value: 32, message: "Password is too long." },
								})}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="new-password">New Password</FieldLabel>
							<Input
								id="new-password"
								type="password"
								{...register("newPassword", {
									required: "This field is required.",
									minLength: { value: 8, message: "Password is too short." },
									maxLength: { value: 32, message: "Password is too long." },
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
									minLength: { value: 8, message: "Password is too short." },
									maxLength: { value: 32, message: "Password is too long." },
								})}
							/>
							<FieldDescription>Please confirm your password.</FieldDescription>
						</Field>

						<Field orientation="horizontal">
							<Button
								variant="outline"
								disabled={!formState.isDirty}
								onClick={() => reset()}
							>
								Cancel
							</Button>

							<Button type="submit" disabled={!formState.isDirty}>
								Save
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}

function DeleteAccountForm() {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Delete account</CardTitle>
				<CardDescription>
					No longer want to use our service? You can delete your account here.
					This action is not reversible. All information related to this account
					will be deleted permanently.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button className="w-full" size="xl" variant="destructive">
							Yes, delete my account
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									dispatch(deleteMeAsync());
								}}
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}

export default function Page() {
	const { user, isAuthenticated } = useAppSelector(
		(state) => state.authReducer,
	);
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated === false) {
			router.push("/signin");
		}
	}, []);

	return (
		<>
			{user == null ? (
				<Section className="m-auto max-w-lg">
					<TypographyH3>loading...</TypographyH3>
				</Section>
			) : (
				<Section className="m-auto max-w-sm space-y-2 lg:space-y-4">
					<TypographyH4 className="text-center">Settings</TypographyH4>

					<div className="flex flex-col gap-4">
						<PersonalInformationForm />
						<ChangePasswordForm />

						{user.role === "admin" && <DeleteAccountForm />}
					</div>
				</Section>
			)}
		</>
	);
}
