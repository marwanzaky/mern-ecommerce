import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { ProductsService } from "@/products/products.service";

import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { Review } from "./entities/review.entity";
import { TranslationService } from "@/modules/translation/translation.service";
import { TranslatedText } from "@/shared/types/product.types";
import { ReviewEntity } from "@/shared/types/review.type";

@Injectable()
export class ReviewsService {
	constructor(
		@InjectModel(Review.name) private reviewModel: Model<Review>,
		private productService: ProductsService,
		private translationService: TranslationService,
	) {}

	async create(dto: CreateProductReviewDto): Promise<Review> {
		const { user, product, rating, description } = dto;

		let translatedDescription: TranslatedText | undefined = undefined;
		if (description) {
			translatedDescription =
				await this.translationService.translateText(description);
		}

		const review = await this.reviewModel.create({
			product,
			rating,
			description: translatedDescription,
			user,
		});

		await review.save();

		await this.productService.calcAvgRatings(product);
		await this.productService.calcRatingDistribution(product);

		return review;
	}

	async findByIdAndUpdate(
		id: string,
		updateReviewDto: { description: string },
	): Promise<Review | null> {
		const data: Partial<ReviewEntity> = {
			...updateReviewDto,
			description: undefined,
		};

		if (updateReviewDto.description) {
			data.description = await this.translationService.translateText(
				updateReviewDto.description,
			);
		}

		return this.reviewModel.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
		});
	}

	async findAll(query: { product: string }): Promise<Review[]> {
		return this.reviewModel.find(query);
	}

	async findProduct(id: string): Promise<Review> {
		const user = await this.reviewModel.findById(id);

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	remove(id: string): Promise<Review | null> {
		return this.reviewModel.findByIdAndDelete(id);
	}
}
