import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "@/auth/auth.guard";

import { ContactMessagesService } from "./contact-messages.service";
import { SendContactMessageDto } from "./dto/send-contact-message.dto";
import { UpdateContactMessageStatusDto } from "./dto/update-contact-message-status.dto";

@Controller("contact-messages")
@ApiTags("Contact Messages")
export class ContactMessagesController {
	constructor(private contactMessagesService: ContactMessagesService) {}

	@Get()
	@ApiOperation({
		summary: "Get all contact messages (admin)",
	})
	async getAll() {
		return this.contactMessagesService.find();
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update contact message status (admin)",
	})
	async updateStatus(
		@Param("id") id: string,
		@Body() body: UpdateContactMessageStatusDto,
	) {
		return this.contactMessagesService.findByIdAndUpdate(id, body.status);
	}

	@Post()
	@Public()
	@ApiOperation({
		summary: "Send a contact message",
	})
	async create(@Body() body: SendContactMessageDto) {
		const { name, email, message, subject } = body;

		return this.contactMessagesService.create({
			name,
			email,
			message,
			subject,
		});
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete contact message (admin)",
	})
	async delete(@Param("id") id: string) {
		return this.contactMessagesService.findByIdAndDelete(id);
	}
}
