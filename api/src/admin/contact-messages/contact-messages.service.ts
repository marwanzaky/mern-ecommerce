import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model } from "mongoose";

import {
	ContactMessageStatus,
	CreateContactMessage,
} from "@/shared/types/contact-message.type";

import { ContactMessage } from "./entities/contact-message.entity";

@Injectable()
export class ContactMessagesService {
	constructor(
		@InjectModel(ContactMessage.name)
		private contactMessage: Model<ContactMessage>,
	) {}

	async create(params: CreateContactMessage): Promise<ContactMessage> {
		const { name, email, subject, message } = params;

		const contactMessage = await this.contactMessage.create({
			name,
			email,
			subject,
			message,
		});

		return contactMessage.save();
	}

	async find(): Promise<ContactMessage[]> {
		return this.contactMessage.find();
	}

	findByIdAndUpdate(
		id: string,
		status: ContactMessageStatus,
	): Promise<ContactMessage | null> {
		return this.contactMessage.findByIdAndUpdate(
			id,
			{ status },
			{ new: true, runValidators: true },
		);
	}

	findByIdAndDelete(id: string): Promise<ContactMessage | null> {
		return this.contactMessage.findOneAndDelete({
			_id: new mongoose.Types.ObjectId(id),
		});
	}
}
