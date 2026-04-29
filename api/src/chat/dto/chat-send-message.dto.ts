import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

export class ChatSendMessageDto {
	@ApiProperty()
	@IsString({ each: true })
	@IsNotEmpty()
	readonly previousChat!: string[];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly message!: string;
}
