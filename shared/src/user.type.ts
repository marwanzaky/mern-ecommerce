import { EntityBase } from "./entity.type";

export type UserRole = "user" | "admin";

export type User = EntityBase & {
	role: UserRole;

	name: string;
	email: string;

	photoUrl?: string;
};

export type CreateUser = {
	name: string;
	email: string;
	password: string;
};

export type UpdateUser = Partial<Pick<User, "name" | "email" | "photoUrl">>;

export type UpdateUserPassword = {
	currentPassword: string;
	newPassword: string;
};
