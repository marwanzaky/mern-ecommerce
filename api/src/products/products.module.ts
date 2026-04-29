import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CategoriesModule } from "@/modules/categories/categories.module";
import { CloudinaryModule } from "@/modules/cloudinary/cloudinary.module";
import { TranslationModule } from "@/modules/translation/translation.module";
import { Review, ReviewSchema } from "@/reviews/entities/review.entity";

import { Product, ProductSchema } from "./entities/product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
		CloudinaryModule,
		CategoriesModule,
		TranslationModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService],
})
export class ProductsModule {}
