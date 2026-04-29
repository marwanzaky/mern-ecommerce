import { forwardRef, Module } from "@nestjs/common";

import { ProductsModule } from "@/products/products.module";

import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
	imports: [forwardRef(() => ProductsModule)],
	controllers: [PaymentsController],
	providers: [PaymentsService],
})
export class PaymentsModule {}
