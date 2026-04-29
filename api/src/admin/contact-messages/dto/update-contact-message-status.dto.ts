import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

import { ContactMessageStatus } from "@/shared/types/contact-message.type";

export class UpdateContactMessageStatusDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly status!: ContactMessageStatus;
}
