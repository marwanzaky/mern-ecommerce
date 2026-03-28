"use client";

import { useState } from "react";
import { useAppSelector } from "@redux/store";
import {
	contactMessagesService,
	IContactMessage,
} from "@redux/services/contactMessagesService";

import { Column } from "@shared/components/table";
import { ButtonIcon } from "@shared/ui/buttonIcon";
import { useQuery } from "@tanstack/react-query";
import { InputText } from "@shared/components/inputText";
import { Textarea } from "@shared/components/textarea";
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
			className: "capitalize",
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
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>View Message</DialogTitle>
					</DialogHeader>

					{selectedMessage && (
						<>
							<Select
								value={selectedMessage.status}
								onValueChange={async (value: "new" | "read" | "replied") => {
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
								<SelectTrigger className="w-full max-w-48">
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
							<InputText
								size="sm"
								disabled
								value={new Date(selectedMessage.createdAt).toLocaleDateString(
									"en-GB",
								)}
							/>
							<InputText size="sm" disabled value={selectedMessage.name} />
							<InputText size="sm" disabled value={selectedMessage.email} />
							<InputText size="sm" disabled value={selectedMessage.subject} />
							<Textarea disabled value={selectedMessage.message} />
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
