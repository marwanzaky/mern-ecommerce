import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { AdminCategoriesModule } from "./admin/admin-categories/admin-categories.module";
import { ContactMessagesModule } from "./admin/contact-messages/contact-messages.module";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { CartsModule } from "./carts/carts.module";
import { CategoriesModule } from "./categories/categories.module";
import { ChatModule } from "./chat/chat.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { RolesGuard } from "./guards/roles.guard";
import { PaymentsModule } from "./payments/payments.module";
import { ProductsModule } from "./products/products.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true,
		}),

		// Mongoose config
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>("MONGODB_URI"),
			}),
		}),

		AuthModule,
		UsersModule,
		ProductsModule,
		ReviewsModule,
		CartsModule,
		FavoritesModule,
		PaymentsModule,
		ContactMessagesModule,
		ChatModule,
		UploadsModule,
		AdminCategoriesModule,
		CategoriesModule,
	],
	providers: [
		JwtService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
