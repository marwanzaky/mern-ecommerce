import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { Category } from "@/modules/categories/entities/category.entity";
import { WithoutMongoMeta } from "@/shared/types/mongoose.type";
import {
	ProductEntity,
	RatingDistribution,
	TranslatedText,
} from "@/shared/types/product.types";
import { User } from "@/users/entities/user.entity";

type ProductDocumentType = Omit<WithoutMongoMeta<ProductEntity>, "category"> & {
	category: mongoose.Types.ObjectId | null;
};

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Product extends Document implements ProductDocumentType {
	@Prop({
		type: {
			en: { type: String, required: true, trim: true },
			fr: { type: String, required: true, trim: true },
			ar: { type: String, required: true, trim: true },
		},
		required: [true, "A product must have a name in all languages"],
	})
	name!: TranslatedText;

	@Prop({
		type: Number,
		required: [true, "A product must have a price"],
	})
	price!: number;

	@Prop({
		type: Number,
		required: [true, "A product must have a priceCompare"],
	})
	priceCompare!: number;

	@Prop({
		type: Boolean,
		default: false,
	})
	isHero!: boolean;

	@Prop({
		type: Number,
		default: 1,
	})
	stock!: number;

	@Prop({
		type: Number,
		default: 0,
	})
	avgRatings!: number;

	@Prop({
		type: Number,
		default: 0,
	})
	numReviews!: number;

	@Prop({
		type: {
			1: { type: Number, default: 0 },
			2: { type: Number, default: 0 },
			3: { type: Number, default: 0 },
			4: { type: Number, default: 0 },
			5: { type: Number, default: 0 },
		},
		default: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		},
	})
	ratingDistribution!: RatingDistribution;

	@Prop({
		type: [String],
		required: true,
	})
	imgUrls!: string[];

	@Prop({
		type: {
			en: { type: String, required: true, trim: true },
			fr: { type: String, required: true, trim: true },
			ar: { type: String, required: true, trim: true },
		},
		required: [true, "A product must have a description in all languages"],
	})
	description!: TranslatedText;

	@Prop({
		type: {
			en: { type: String, trim: true },
			fr: { type: String, trim: true },
			ar: { type: String, trim: true },
		},
	})
	shortDescription?: TranslatedText;

	@Prop({
		type: [String],
		required: [true, "A product must have tags"],
		trim: true,
	})
	tags!: string[];

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A product must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: Boolean,
		default: false,
	})
	featured!: boolean;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Category.name,
		required: [true, "A product must have category value"],
		default: null,
	})
	category!: mongoose.Types.ObjectId | null;

	@Virtual({
		get: function (this: Product) {
			const discount = this.priceCompare - this.price;
			const discountPercent = (discount / this.priceCompare) * 100;
			return `${Math.round(discountPercent)}%`;
		},
	})
	discount!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "product",
	localField: "_id",
});
