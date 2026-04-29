import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { Product } from "@/products/entities/product.entity";
import { WithoutMongoMeta } from "@/shared/types/mongoose.type";
import { ReviewEntity } from "@/shared/types/review.type";
import { User } from "@/users/entities/user.entity";
import { TranslatedText } from "@/shared/types/product.types";

type ReviewDocumentType = Omit<
	WithoutMongoMeta<ReviewEntity>,
	"product" | "user"
> & {
	product: mongoose.Schema.Types.ObjectId;
	user: mongoose.Schema.Types.ObjectId;
};

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Review extends Document implements ReviewDocumentType {
	@Prop({
		type: Number,
		min: 1,
		max: 5,
		required: [true, "A review must have a rating"],
	})
	rating!: number;

	@Prop({
		type: {
			en: { type: String, trim: true },
			fr: { type: String, trim: true },
			ar: { type: String, trim: true },
		},
	})
	description?: TranslatedText;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a product"],
	})
	product!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, function (next) {
	(this as any)
		.populate({
			path: "product",
			select: "name",
		})
		.populate({
			path: "user",
			select: "name photoUrl",
		});

	next();
});
