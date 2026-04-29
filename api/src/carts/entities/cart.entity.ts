import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { Product } from "@/products/entities/product.entity";
import { User } from "@/users/entities/user.entity";

export type CartDocumentType = {
	user: mongoose.Schema.Types.ObjectId;
	items: {
		product: mongoose.Schema.Types.ObjectId;
		quantity: number;
	}[];
};

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Cart extends Document implements CartDocumentType {
	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop([
		{
			product: {
				type: mongoose.Schema.ObjectId,
				ref: Product.name,
				required: [true, "Cart item must belong to a product"],
			},
			quantity: {
				type: Number,
				min: 1,
				required: [true, "Cart item must have a quantity"],
			},
		},
	])
	items!: {
		product: mongoose.Schema.Types.ObjectId;
		quantity: number;
	}[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre(/^find/, function (next) {
	(this as any).populate({
		path: "items.product",
		select: "name imgUrls price priceCompare category",
	});
	next();
});
