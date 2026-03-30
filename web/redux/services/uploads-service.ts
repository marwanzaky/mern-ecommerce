const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export const uploadsService = {
	uploadFile,
};

export async function uploadFile(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await await fetch(`${baseUrl}/uploads`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) throw new Error("Upload failed");

	const data = await response.json();
	return data.url;
}
