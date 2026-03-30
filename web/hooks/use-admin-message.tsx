"use client";

import { useState } from "react";
import { useAppSelector } from "@redux/store";
import {
	contactMessagesService,
	IContactMessage,
} from "@redux/services/contact-messages-service";

import { Column } from "@shared/components/ui/table";
import { ButtonIcon } from "@shared/components/ui/button-icon";
import { useQuery } from "@tanstack/react-query";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@shadcn/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@shadcn/components/ui/dialog";
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
import { Input } from "@shadcn/components/ui/input";
import { Textarea } from "@shadcn/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";

export function useAdminMessages() {
	const { token } = useAppSelector((state) => state.authReducer);

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["contact-messages"],
		queryFn: () => contactMessagesService.getAllMessages(token),
		staleTime: 0,
	});

	const [visible, setVisible] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState<IContactMessage>();

	const columns: Column<IContactMessage>[] = [
		{
			header: "Status",
			field: "status",
			type: "text",
			className: "text-center! capitalize",
		},
		{
			header: "Name",
			field: "name",
			type: "text",
		},
		{
			header: "Email",
			field: "email",
			type: "text",
		},
		{
			header: "Message",
			field: "message",
			type: "text",
			className: "max-w-xs truncate",
		},
		{
			header: "Date",
			field: "createdAt",
			type: "date",
		},
		{
			header: "",
			field: "_id",
			type: "custom",
			className: "w-9.5",
			render(value, row) {
				return (
					<div className="flex gap-2">
						<ButtonIcon
							icon="visibility"
							onClick={() => {
								setSelectedMessage(row);
								setVisible(true);
							}}
						/>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<ButtonIcon icon="delete" />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the message data from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											contactMessagesService.deleteMessage(token, row._id);
											refetch();
										}}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				);
			},
		},
	];

	const ViewMessageDialog = (
		<Dialog open={visible} onOpenChange={setVisible}>
			<form>
				<DialogContent className="sm:max-w-xs">
					<DialogHeader>
						<DialogTitle>View Message</DialogTitle>
					</DialogHeader>

					{selectedMessage && (
						<>
							<FieldGroup>
								<Field>
									<FieldLabel>Status</FieldLabel>
									<Select
										value={selectedMessage.status}
										onValueChange={async (
											value: "new" | "read" | "replied",
										) => {
											const newMessage =
												await contactMessagesService.updateMessageStatus(
													token,
													selectedMessage._id,
													value,
												);
											setSelectedMessage(newMessage);
											refetch();
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Status</SelectLabel>
												<SelectItem value="new">New</SelectItem>
												<SelectItem value="read">Read</SelectItem>
												<SelectItem value="replied">Replied</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
								<Field>
									<FieldLabel htmlFor="date">Date</FieldLabel>
									<Input
										id="date"
										value={new Date(
											selectedMessage.createdAt,
										).toLocaleDateString("en-GB")}
										readOnly
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="name">Full Name</FieldLabel>
									<Input id="name" value={selectedMessage.name} readOnly />
								</Field>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input id="email" value={selectedMessage.email} readOnly />
								</Field>
								<Field>
									<FieldLabel htmlFor="subject">Subject</FieldLabel>
									<Input
										id="subject"
										value={selectedMessage.subject}
										readOnly
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="message">Message</FieldLabel>
									<Textarea
										id="message"
										value={selectedMessage.message}
										readOnly
									/>
								</Field>
							</FieldGroup>
						</>
					)}
				</DialogContent>
			</form>
		</Dialog>
	);

	return {
		columns,
		isLoading,
		data,
		ViewMessageDialog,
	};
}
