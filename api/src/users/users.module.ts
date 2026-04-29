import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "@/auth/auth.module";
import { CloudinaryModule } from "@/modules/cloudinary/cloudinary.module";
import { ProductsModule } from "@/products/products.module";

import { User, UserSchema } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		forwardRef(() => AuthModule),
		forwardRef(() => ProductsModule),
		CloudinaryModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
