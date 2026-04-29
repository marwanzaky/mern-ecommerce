import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { Product } from "@/products/entities/product.entity";
import { User } from "@/users/entities/user.entity";

type FavoriteDocumentType = {
	user: mongoose.Schema.Types.ObjectId;
	product: mongoose.Schema.Types.ObjectId;
};

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class Favorite extends Document implements FavoriteDocumentType {
	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a user"],
	})
	product!: mongoose.Schema.Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
