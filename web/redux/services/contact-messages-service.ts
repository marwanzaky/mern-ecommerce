const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export type IContactMessage = {
	_id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	createdAt: string;
	status: "new" | "read" | "replied";
};

export const contactMessagesService = {
	getAllMessages,
	sendMessage,
	updateMessageStatus,
	deleteMessage,
};

async function getAllMessages(token: string): Promise<IContactMessage[]> {
	const response = await fetch(`${baseUrl}/contact-messages`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function sendMessage({
	name,
	email,
	subject,
	message,
}: {
	name: string;
	email: string;
	subject: string;
	message: string;
}): Promise<void> {
	const response = await fetch(`${baseUrl}/contact-messages`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, email, subject, message }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function updateMessageStatus(
	token: string,
	id: string,
	status: "new" | "read" | "replied",
): Promise<IContactMessage> {
	const response = await fetch(`${baseUrl}/contact-messages/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ status }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function deleteMessage(token: string, id: string): Promise<void> {
	const response = await fetch(`${baseUrl}/contact-messages/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
