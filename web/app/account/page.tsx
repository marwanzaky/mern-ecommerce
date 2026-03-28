"use client";

import { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	deleteMeAsync,
	updateMeAsync,
	updateMyPasswordAsync,
} from "@redux/thunks/authThunks";

import { InputText } from "@shared/components/inputText";
import { Section } from "@shared/components/section";
import { ButtonIcon } from "@shared/ui/buttonIcon";
import { Avatar, AvatarImage } from "@shared/shadcn/avatar";
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
	TypographyH3,
	TypographyH4,
	TypographyMuted,
} from "@shared/shadcn/typography";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@shadcn/components/ui/button";
import { toast } from "sonner";

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

			<TypographyH4>Personal Information</TypographyH4>

			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<Controller
						name="photo"
						control={control}
						render={({ field }) => {
							const { value } = field;
							const [previewUrl, setPreviewUrl] = useState(value?.url || "");

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
									<AvatarImage src={previewUrl || "img/avatar.jpg"} />
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

				<InputText
					size="sm"
					type="text"
					placeholder="Enter Name"
					icon="person"
					message={errors.name?.message}
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
				<InputText
					size="sm"
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
							message: "Invalid characters in email.",
						},
					})}
				/>

				<div className="flex gap-2">
					<Button
						size="lg"
						variant="outline"
						disabled={!formState.isDirty}
						onClick={resetForm}
					>
						Cancel
					</Button>

					<Button size="lg" type="submit" disabled={!formState.isDirty}>
						Save
					</Button>
				</div>
			</div>
		</form>
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
		<form
			className="space-y-4"
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
			<TypographyH4>Change Password</TypographyH4>

			<div className="flex flex-col gap-4">
				<InputText
					size="sm"
					type="password"
					placeholder="Current Password"
					icon="password"
					message={errors.currentPassword?.message}
					{...register("currentPassword", {
						required: "This field is required.",
						minLength: { value: 8, message: "Password is too short." },
						maxLength: { value: 32, message: "Password is too long." },
					})}
				/>
				<InputText
					size="sm"
					type="password"
					placeholder="New Password"
					icon="password"
					message={errors.newPassword?.message}
					{...register("newPassword", {
						required: "This field is required.",
						minLength: { value: 8, message: "Password is too short." },
						maxLength: { value: 32, message: "Password is too long." },
					})}
				/>
				<InputText
					size="sm"
					type="password"
					placeholder="Confirm Password"
					icon="password"
					message={errors.confirmPassword?.message}
					{...register("confirmPassword", {
						required: "This field is required.",
						minLength: { value: 8, message: "Password is too short." },
						maxLength: { value: 32, message: "Password is too long." },
					})}
				/>

				<div className="flex gap-2">
					<Button
						size="lg"
						variant="outline"
						disabled={!formState.isDirty}
						onClick={() => reset()}
					>
						Cancel
					</Button>

					<Button size="lg" type="submit" disabled={!formState.isDirty}>
						Save
					</Button>
				</div>
			</div>
		</form>
	);
}

function DeleteAccountForm() {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<form className="space-y-4">
			<TypographyH4>Delete Account</TypographyH4>

			<div className="flex flex-col gap-4">
				<TypographyMuted>
					No longer want to use our service? You can delete your account here.
					This action is not reversible. All information related to this account
					will be deleted permanently.
				</TypographyMuted>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button size="xl" variant="destructive">
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
			</div>
		</form>
	);
}

export default function Page() {
	const { user } = useAppSelector((state) => state.authReducer);

	return (
		<>
			{user == null ? (
				<Section className="m-auto max-w-lg">
					<TypographyH3>loading...</TypographyH3>
				</Section>
			) : (
				<Section className="m-auto max-w-lg">
					<TypographyH3>Settings</TypographyH3>

					<div className="flex flex-col gap-8">
						<PersonalInformationForm />
						<ChangePasswordForm />

						{user.role === "admin" && <DeleteAccountForm />}
					</div>
				</Section>
			)}
		</>
	);
}
