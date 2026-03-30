"use client";

import { useRouter } from "next/navigation";

import { contactMessagesService } from "@redux/services/contact-messages-service";
import { Section } from "@shared/components/ui/section";
import { Controller, useForm } from "react-hook-form";
import { TypographyH2, TypographyH4 } from "@shadcn/components/ui/typography";
import { TypographyP } from "@shadcn/components/ui/typography";
import { Button } from "@shadcn/components/ui/button";
import { toast } from "sonner";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";
import { Textarea } from "@shadcn/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
	name: z
		.string()
		.nonempty("This field is required.")
		.min(2, "Name is too short.")
		.max(16, "Name is too long."),
	email: z.email().nonempty("This field is required."),
	subject: z
		.string({ error: "a" })
		.nonempty("This field is required.")
		.max(64, "This field must be 64 characters or fewer."),
	message: z.string().nonempty("This field is required."),
});

export default function Contact() {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			console.log("data", data);
			await contactMessagesService.sendMessage(data);

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
				<TypographyH2 className="text-center border-none">
					Contact Us
				</TypographyH2>
				<TypographyH4>Have a question?</TypographyH4>
				<TypographyP>
					Email us and we&apos;ll get back to you within 24 hours.
					Monday-Saturday <br /> <br />
					Please fill the form below to contact us and we will get back to you
					as soon as possible! We&apos;re happy to answer questions or help.
				</TypographyP>
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<FieldGroup>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									{...field}
									id="name"
									aria-invalid={fieldState.invalid}
									placeholder="John Doe"
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									{...field}
									id="email"
									aria-invalid={fieldState.invalid}
									placeholder="m@example.com"
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="subject"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="subject">Subject</FieldLabel>
								<Input
									{...field}
									id="subject"
									aria-invalid={fieldState.invalid}
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="message"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="message">Message</FieldLabel>
								<Textarea
									{...field}
									id="message"
									className="h-32"
									aria-invalid={fieldState.invalid}
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Field>
						<Button size="lg" type="submit">
							Send
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</Section>
	);
}
