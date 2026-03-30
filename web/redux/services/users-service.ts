import { jsonToFormData } from "@utils/helper";
import { UpdateUser, UpdateUserPassword, User } from "@shared/types/user.type";
import { IProduct } from "@shared/interfaces";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export const usersService = {
	login,
	signup,

	// My account
	getMe,
	getMeProducts,
	updateMe,
	updateMyPassword,
	deleteMe,

	// Users
	getPublicById,
};

async function login(
	email: string,
	password: string,
): Promise<{ token: string }> {
	const response = await fetch(`${baseUrl}/auth/login`, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function signup(
	name: string,
	email: string,
	password: string,
): Promise<{ token: string }> {
	const response = await fetch(`${baseUrl}/auth/signup`, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			name,
			email,
			password,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function getMe(token: string): Promise<User> {
	const response = await fetch(`${baseUrl}/users/me`, {
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

async function getMeProducts(token: string): Promise<IProduct[]> {
	const response = await fetch(`${baseUrl}/users/me/products`, {
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

async function updateMe(
	token: string,
	updatedUser: UpdateUser & { photoFile?: File },
): Promise<User> {
	const formData = jsonToFormData(updatedUser);

	const response = await fetch(`${baseUrl}/users/updateMe`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function updateMyPassword(
	token: string,
	{ currentPassword, newPassword }: UpdateUserPassword,
): Promise<{ token: string }> {
	const response = await fetch(`${baseUrl}/users/updateMyPassword`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
		body: JSON.stringify({ currentPassword, newPassword }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function deleteMe(token: string): Promise<{ token: string }> {
	const response = await fetch(`${baseUrl}/users/deleteMe`, {
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

async function getPublicById(id: string): Promise<User> {
	const response = await fetch(`${baseUrl}/users/public/${id}`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
