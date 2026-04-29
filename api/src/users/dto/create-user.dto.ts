import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsNotEmpty } from "class-validator";

import { CreateUser } from "@/shared/types/user.type";

export class CreateUserDto implements CreateUser {
	@ApiProperty()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	readonly email!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly password!: string;
}
