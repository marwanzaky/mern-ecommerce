import { EntityBase } from "./entity.type";
import { ReviewEntity } from "./review.type";
import { User } from "./user.type";

export type Rating = 1 | 2 | 3 | 4 | 5;
export type RatingDistribution = Record<Rating, number>;

export type TranslatedText = {
	en: string;
	fr: string;
	ar: string;
};

export type OptionalTranslatedText = {
	en?: string;
	fr?: string;
	ar?: string;
};

/**
 * Mongodb product document entity
 */
export type ProductEntity = EntityBase & {
	name: TranslatedText;
	price: number;
	priceCompare: number;
	isHero: boolean;
	stock: number;
	discount: string;
	avgRatings: number;
	numReviews: number;
	ratingDistribution: RatingDistribution;
	imgUrls: string[];
	description: TranslatedText;
	shortDescription?: OptionalTranslatedText;
	tags: string[];
	featured: boolean;
	category: string | null;
};

export type ProductWithReviewsEntity = ProductEntity & {
	reviews: (Pick<
		ReviewEntity,
		"_id" | "createdAt" | "description" | "rating"
	> & {
		product: { name: TranslatedText };
		user: { _id: string; name: string; photoUrl: string };
	})[];
	user: Pick<User, "_id" | "name" | "photoUrl" | "updatedAt" | "createdAt">;
};

export type CreateProduct = {
	name: string;
	price: number;
	priceCompare: number;
	description: string;
	shortDescription?: string;
	tags?: string[];
	stock?: number;
	category?: string | null;
	imgFiles?: File[];
};

export type UpdateProduct = {
	name?: string;
	price?: number;
	priceCompare?: number;
	description?: string;
	shortDescription?: string;
	tags?: string[];
	stock?: number;
	category?: string | null;
	newImgs?: {
		file: File;
		index: number;
	}[];
	keptImgs?: {
		url: string;
		index: number;
	}[];
};
