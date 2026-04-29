import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ProductsModule } from "@/products/products.module";

import { Favorite, FavoriteSchema } from "./entities/favorite.entity";
import { FavoritesController } from "./favorites.controller";
import { FavoritesService } from "./favorites.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Favorite.name, schema: FavoriteSchema },
		]),

		forwardRef(() => ProductsModule),
	],
	controllers: [FavoritesController],
	providers: [FavoritesService],
	exports: [FavoritesService],
})
export class FavoritesModule {}
