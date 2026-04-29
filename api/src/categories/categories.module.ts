import { Module } from "@nestjs/common";

import { CategoriesModule as CategoriesServiceModule } from "@/modules/categories/categories.module";

import { CategoriesController } from "./categories.controller";

@Module({
	imports: [CategoriesServiceModule],
	controllers: [CategoriesController],
})
export class CategoriesModule {}
