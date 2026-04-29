import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Cart, CartSchema } from "@/carts/entities/cart.entity";

import { CartsController } from "./carts.controller";
import { CartsService } from "./carts.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
	],
	controllers: [CartsController],
	providers: [CartsService],
	exports: [CartsService],
})
export class CartsModule {}
