import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ContactMessagesController } from "./contact-messages.controller";
import { ContactMessagesService } from "./contact-messages.service";
import {
	ContactMessage,
	ContactMessageSchema,
} from "./entities/contact-message.entity";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ContactMessage.name, schema: ContactMessageSchema },
		]),
	],
	controllers: [ContactMessagesController],
	providers: [ContactMessagesService],
})
export class ContactMessagesModule {}
