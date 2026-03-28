"use client";

import { useRouter } from "next/navigation";

import { contactMessagesService } from "@redux/services/contactMessagesService";
import { Section } from "@shared/components/section";
import { SubmitHandler, useForm } from "react-hook-form";
import { InputText } from "@shared/components/inputText";
import { Textarea } from "@shared/components/textarea";
import { TypographyH2, TypographyH4 } from "@shared/ui/typography";
import { TypographyP } from "@shadcn/components/ui/typography";
import { Button } from "@shadcn/components/ui/button";
import { toast } from "sonner";

type Inputs = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

export default function Contact() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<Inputs>({ mode: "onTouched" });

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			await contactMessagesService.sendMessage(data);

			reset();

			toast("Message sent successfully. Thank you!", {
				position: "top-center",
			});

			router.push("/");
		} catch (error) {
			toast("Something went wrong.", { position: "top-center" });

			console.error(error);
		}
	};

	return (
		<Section className="grid grid-cols-1 md:grid-cols-2 gap-12">
			<div>
				<TypographyH2 className="text-center lg:text-left">
					Contact us
				</TypographyH2>
				<TypographyH4>Have a question?</TypographyH4>
				<TypographyP>
					Email us and we&apos;ll get back to you within 24 hours.
					Monday-Saturday <br /> <br />
					Please fill the form below to contact us and we will get back to you
					as soon as possible! We&apos;re happy to answer questions or help.
				</TypographyP>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<InputText
					type="text"
					placeholder="Name"
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
					placeholder="Email"
					icon="send"
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
					type="text"
					placeholder="Subject"
					icon="subject"
					message={errors.subject?.message}
					hasError={!!errors.subject}
					{...register("subject", {
						required: "This field is required.",
						maxLength: {
							value: 64,
							message: "This field must be 64 characters or fewer.",
						},
					})}
				/>
				<Textarea
					styleClass="h-36"
					placeholder="Message"
					icon="mail"
					message={errors.message?.message}
					hasError={!!errors.message}
					{...register("message", { required: "This field is required." })}
				/>

				<Button size="xl" type="submit">
					Send
				</Button>
			</form>
		</Section>
	);
}
