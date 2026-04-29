import { EntityBase } from "./entity.type";
import { WithoutMongoMeta } from "./mongoose.type";

export type ContactMessageStatus = "new" | "read" | "replied";

export type ContactMessage = EntityBase & {
	name: string;
	email: string;
	subject: string;
	message: string;
	status: ContactMessageStatus;
};

export type CreateContactMessage = Omit<
	WithoutMongoMeta<ContactMessage>,
	"status"
>;
