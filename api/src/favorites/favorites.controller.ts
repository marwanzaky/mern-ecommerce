import { Controller, Delete, Get, Param,Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { ProductsService } from "@/products/products.service";
import { IRequest } from "@/types/request.type";

import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { FavoritesService } from "./favorites.service";

@Controller("favorites")
@ApiBearerAuth("Authorization")
export class FavoritesController {
	constructor(
		private readonly favoritesService: FavoritesService,
		private readonly productsService: ProductsService,
	) {}

	@Get()
	@ApiOperation({
		summary: "Get all favorite products",
	})
	async get(@Req() request: IRequest) {
		const items = await this.favoritesService.find({ user: request.user.id });

		if (items.length > 0) {
			return this.productsService.find({
				query: { ids: items.map((item) => item.product.toString()) },
			});
		}

		return [];
	}

	@Post("/:productId")
	@ApiOperation({
		summary: "Add a product to favorites",
	})
	async create(@Req() request: IRequest, @Param() dto: CreateFavoriteDto) {
		const { productId } = dto;
		await this.favoritesService.create(request.user.id, productId);
		return this.productsService.findById(productId);
	}

	@Delete("/:productId")
	@ApiOperation({
		summary: "Remove a product from favorites",
	})
	async remove(@Param("productId") productId: string) {
		return this.favoritesService.findByIdAndDelete(productId);
	}
}
