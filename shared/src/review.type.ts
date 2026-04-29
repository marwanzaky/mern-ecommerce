import { EntityBase } from "./entity.type";
import { TranslatedText } from "./product.types";

export type ReviewEntity = EntityBase & {
	rating: number;
	description?: TranslatedText;
	product: string;
	user: string;
};
