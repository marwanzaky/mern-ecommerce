import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Public } from "@/auth/auth.guard";
import { CategoriesService } from "@/modules/categories/categories.service";

@Controller("categories")
@Public()
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({
		summary: "Get all categories",
	})
	async getAllCategories() {
		return this.categoriesService.findPublic({ isActive: true });
	}

	@Get("tree")
	@ApiOperation({
		summary: "Get categories tree",
	})
	async getCategoryTree() {
		return this.categoriesService.getPublicCategoryTree();
	}
}
