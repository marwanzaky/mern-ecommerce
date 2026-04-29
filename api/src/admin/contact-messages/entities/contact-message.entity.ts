import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

import { ContactMessage as ContactMessageType } from "@/shared/types/contact-message.type";
import { WithoutMongoMeta } from "@/shared/types/mongoose.type";

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class ContactMessage
	extends Document
	implements WithoutMongoMeta<ContactMessageType>
{
	@Prop({
		type: String,
		required: true,
		trim: true,
	})
	name!: string;

	@Prop({
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	})
	email!: string;

	@Prop({
		type: String,
		required: true,
		trim: true,
	})
	subject!: string;

	@Prop({
		type: String,
		required: true,
	})
	message!: string;

	@Prop({
		type: String,
		enum: ["new", "read", "replied"],
		default: "new",
	})
	status!: "new" | "read" | "replied";
}

export const ContactMessageSchema =
	SchemaFactory.createForClass(ContactMessage);
