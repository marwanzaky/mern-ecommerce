import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty } from "class-validator";

import { UpdateUserPassword } from "@/shared/types/user.type";

export class UpdateUserPasswordDto implements UpdateUserPassword {
	@ApiProperty()
	@IsNotEmpty()
	readonly currentPassword!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly newPassword!: string;
}
