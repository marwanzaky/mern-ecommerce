import {
	ContactMessage,
	ContactMessageStatus,
	CreateContactMessage,
} from "@/shared/types/contact-message.type";

import { clientFetch } from "@/lib/api-client";

export const contactMessagesService = {
	getAllMessages: () => clientFetch<ContactMessage[]>("/contact-messages"),
	sendMessage: (body: CreateContactMessage) =>
		clientFetch<void>("/contact-messages", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	updateMessageStatus: (id: string, status: ContactMessageStatus) =>
		clientFetch<ContactMessage>(`/contact-messages/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		}),
	deleteMessage: (id: string) =>
		clientFetch<void>(`/contact-messages/${id}`, {
			method: "DELETE",
		}),
};
