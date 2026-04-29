import { Module } from "@nestjs/common";

import { CategoriesModule } from "@/modules/categories/categories.module";
import { CloudinaryModule } from "@/modules/cloudinary/cloudinary.module";

import { AdminCategoriesController } from "./admin-categories.controller";

@Module({
	imports: [CategoriesModule, CloudinaryModule],
	controllers: [AdminCategoriesController],
})
export class AdminCategoriesModule {}
