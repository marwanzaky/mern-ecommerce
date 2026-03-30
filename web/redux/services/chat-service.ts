const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export const chatService = {
	chat,
};

async function chat({
	message,
	previousChat,
}: {
	message: string;
	previousChat: string[];
}): Promise<string> {
	const response = await fetch(`${baseUrl}/chat`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message, previousChat }),
	});

	const data = await response.text();

	if (!response.ok) {
		throw new Error(data);
	}

	return data;
}
