import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model } from "mongoose";

import { delay } from "@/common/helper";
import { CategoriesService } from "@/modules/categories/categories.service";
import { TranslationService } from "@/modules/translation/translation.service";
import { Review } from "@/reviews/entities/review.entity";
import {
	ProductEntity,
	ProductWithReviewsEntity,
	Rating,
	RatingDistribution,
	TranslatedText,
} from "@/shared/types/product.types";
import { CreateProductEntity, UpdateProductEntity } from "@/types/product.type";

import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<Product>,
		@InjectModel(Review.name) private reviewModel: Model<Review>,
		private categoriesService: CategoriesService,
		private translationService: TranslationService,
	) {}

	async create(
		user: string,
		{
			name,
			price,
			priceCompare,
			imgUrls,
			description,
			shortDescription,
			tags,
			stock,
			category,
		}: CreateProductEntity,
	): Promise<Product> {
		const translatedName = await this.translationService.translateText(name);
		const translatedDescription =
			await this.translationService.translateJson(description);

		let translatedShortDescription: TranslatedText | undefined = undefined;
		if (shortDescription) {
			translatedShortDescription =
				await this.translationService.translateJson(shortDescription);
		}

		const product = await this.productModel.create({
			user,
			name: translatedName,
			price,
			priceCompare,
			imgUrls,
			description: translatedDescription,
			shortDescription: translatedShortDescription,
			tags: tags || [],
			stock,
			category,
		});

		return product.save();
	}

	/**
	 * Returns ProductEntity document
	 */
	async find(options?: {
		sort?: {
			property?: keyof ProductEntity;
			order?: "asc" | "desc";
		};
		query?: {
			ids?: string[];
			excludeIds?: string[];
			name?: string;
			user?: string;
			minPrice?: number;
			maxPrice?: number;
			featured?: boolean;
			isHero?: boolean;
			limit?: number;
			avgRatings?: number;
			category?: string;
		};
	}): Promise<Product[]> {
		const { sort = {}, query = {} } = options || {};

		const sortOptions: Record<string, 1 | -1> = {};

		if (sort.property && sort.order) {
			sortOptions[sort.property] = sort.order === "asc" ? 1 : -1;
		}

		const filter: Record<string, any> = {};

		if (query.user) {
			filter.user = new mongoose.Types.ObjectId(query.user);
		}

		if (query.name) {
			filter.$or = [
				{ "name.en": { $regex: new RegExp(query.name, "i") } },
				{ "name.fr": { $regex: new RegExp(query.name, "i") } },
				{ "name.ar": { $regex: new RegExp(query.name, "i") } },
			];
		}

		if (query.category) {
			const categories =
				await this.categoriesService.getAllDescendantCategoryIds(
					query.category,
				);

			filter.category = { $in: categories };
		}

		if (query.minPrice !== undefined || query.maxPrice !== undefined) {
			filter.price = {};

			if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
			if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
		}

		if (query.featured !== undefined) {
			filter.featured = query.featured;
		}

		if (query.isHero !== undefined) {
			filter.isHero = query.isHero;
		}

		if (query.ids && query.ids.length > 0) {
			filter._id = {
				$in: query.ids.map((id) => new mongoose.Types.ObjectId(id)),
			};
		}

		if (query.excludeIds && query.excludeIds.length > 0) {
			filter._id = {
				...filter._id,
				$nin: query.excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
			};
		}

		if (query.avgRatings !== undefined) {
			filter.avgRatings = { $gte: query.avgRatings };
		}

		const filteredProducts = this.productModel.find(filter).sort(sortOptions);

		if (query.limit !== undefined && query.limit > 0) {
			filteredProducts.limit(query.limit);
		}

		return filteredProducts;
	}

	async findById(id: string): Promise<ProductWithReviewsEntity> {
		const product = await this.productModel
			.findById(id)
			.populate("reviews")
			.populate({
				path: "user",
				select: "_id name photoUrl updatedAt createdAt",
			});

		if (!product) {
			throw new NotFoundException("Could not find the product");
		}

		return product as unknown as ProductWithReviewsEntity;
	}

	async findByIdAndUpdate(
		id: string,
		updateProductDto: UpdateProductEntity,
	): Promise<Product | null> {
		const data: Partial<ProductEntity> = {
			...updateProductDto,
			name: undefined,
			description: undefined,
			shortDescription: undefined,
		};

		if (updateProductDto.name) {
			data.name = await this.translationService.translateText(
				updateProductDto.name,
			);
		}

		await delay(1000);

		if (updateProductDto.description) {
			data.description = await this.translationService.translateJson(
				updateProductDto.description,
			);
		}

		await delay(1000);

		if (updateProductDto.shortDescription) {
			data.shortDescription = await this.translationService.translateJson(
				updateProductDto.shortDescription,
			);
		}

		return this.productModel.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
		});
	}

	/**
	 * Find product by id and delete, as well as its reviews
	 */
	async findByIdAndDelete(id: string): Promise<Product | null> {
		await this.reviewModel.deleteMany({
			product: new mongoose.Types.ObjectId(id),
		});
		return this.productModel.findByIdAndDelete(id);
	}

	async calcAvgRatings(productId: string) {
		const stats: { _id: string; numRating: number; avgRating: number }[] =
			await this.reviewModel.aggregate([
				{
					$match: {
						product: new mongoose.Types.ObjectId(productId),
					},
				},
				{
					$group: {
						_id: "$product",
						numRating: { $sum: 1 },
						avgRating: { $avg: "$rating" },
					},
				},
			]);

		await this.productModel.findByIdAndUpdate(productId, {
			numReviews: stats.length > 0 ? stats[0].numRating : 0,
			avgRatings: stats.length > 0 ? stats[0].avgRating : 0,
		});
	}

	async calcRatingDistribution(productId: string) {
		const distribution: { _id: Rating; count: number }[] =
			await this.reviewModel.aggregate([
				{
					$match: {
						product: new mongoose.Types.ObjectId(productId),
					},
				},
				{
					$group: {
						_id: { $round: ["$rating", 0] },
						count: { $sum: 1 },
					},
				},
			]);

		const ratingDistribution: RatingDistribution = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		};

		distribution.forEach((item) => {
			ratingDistribution[item._id] = item.count;
		});

		await this.productModel.findByIdAndUpdate(productId, {
			ratingDistribution,
		});
	}
}
