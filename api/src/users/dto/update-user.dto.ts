import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsEmail, IsOptional } from "class-validator";

import { UpdateUser } from "@/shared/types/user.type";

export class UpdateUserDto implements UpdateUser {
	@ApiPropertyOptional()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsEmail()
	@IsOptional()
	readonly email?: string;

	@ApiPropertyOptional()
	@IsOptional()
	readonly photoUrl?: string;
}
