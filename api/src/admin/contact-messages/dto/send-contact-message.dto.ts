import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { CreateContactMessage } from "@/shared/types/contact-message.type";

export class SendContactMessageDto implements CreateContactMessage {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	readonly email!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly subject!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly message!: string;
}
