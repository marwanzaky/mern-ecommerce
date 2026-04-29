import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CategoriesModule } from "@/modules/categories/categories.module";
import { TranslationModule } from "@/modules/translation/translation.module";
import { Product, ProductSchema } from "@/products/entities/product.entity";
import { ProductsService } from "@/products/products.service";
import { User, UserSchema } from "@/users/entities/user.entity";

import { Review, ReviewSchema } from "./entities/review.entity";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Review.name, schema: ReviewSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: User.name, schema: UserSchema },
		]),
		CategoriesModule,
		TranslationModule,
	],
	controllers: [ReviewsController],
	providers: [ReviewsService, ProductsService],
})
export class ReviewsModule {}
