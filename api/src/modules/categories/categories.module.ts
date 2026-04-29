import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CategoriesService } from "./categories.service";
import { Category, CategorySchema } from "./entities/category.entity";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
		]),
	],
	providers: [CategoriesService],
	exports: [CategoriesService],
})
export class CategoriesModule {}
