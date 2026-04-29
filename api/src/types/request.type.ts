import { Request } from "express";

import { UserRole } from "@/shared/types/user.type";

export interface IRequest extends Request {
	user: {
		id: string;
		role: UserRole;
		iat: number;
		exp: number;
	};
}
