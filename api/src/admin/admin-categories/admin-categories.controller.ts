import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CategoriesService } from "@/modules/categories/categories.service";
import { CloudinaryService } from "@/modules/cloudinary/cloudinary.service";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("admin/categories")
@ApiTags("Admin Categories")
export class AdminCategoriesController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private categoriesService: CategoriesService,
	) {}

	@Get()
	@ApiOperation({
		summary: "Get all categories (admin)",
	})
	async getAllCategories() {
		return this.categoriesService.find();
	}

	@Post()
	@ApiOperation({
		summary: "Create new category (admin)",
	})
	@UseInterceptors(FileInterceptor("imgFile"))
	async create(
		@Body() { name, parent, slug, sortOrder }: CreateCategoryDto,
		@UploadedFile() imgFile?: Express.Multer.File,
	) {
		let imgUrl: string | undefined;

		if (imgFile) {
			imgUrl = await this.cloudinaryService.uploadFile(imgFile);
		}

		return this.categoriesService.create({
			name,
			parent,
			slug,
			sortOrder,
			imgUrl,
		});
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update an existing category (admin)",
	})
	@UseInterceptors(FileInterceptor("imgFile"))
	async update(
		@Param("id") id: string,
		@Body() { name, parent, slug, sortOrder, isActive }: UpdateCategoryDto,
		@UploadedFile() imgFile?: Express.Multer.File,
	) {
		let imgUrl: string | undefined;

		if (imgFile !== undefined) {
			imgUrl = await this.cloudinaryService.uploadFile(imgFile);
		} else if (imgFile === null) {
			imgUrl = "";
		}

		return this.categoriesService.findOneAndUpdate(id, {
			name,
			parent,
			slug,
			sortOrder,
			imgUrl,
			isActive,
		});
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Deactivate an existing category (admin)",
	})
	async delete(@Param("id") id: string) {
		return this.categoriesService.findOneAndUpdate(id, { isActive: false });
	}
}
