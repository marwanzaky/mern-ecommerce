import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import Stripe from "stripe";

import { Public } from "@/auth/auth.guard";
import { ProductsService } from "@/products/products.service";

import { CreateCheckoutSessionDto } from "./dto/create-checkout-session.dto";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
	constructor(
		private readonly paymentsService: PaymentsService,
		private readonly productsService: ProductsService,
	) {}

	@Post("create-checkout-session")
	@Public()
	@ApiOperation({
		summary: "Create a checkout session",
	})
	async create(@Body() body: CreateCheckoutSessionDto) {
		const products = await this.productsService.find({
			query: {
				ids: body.items.map((item) => item.id),
			},
		});

		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items
			.map((item) => {
				const matchProduct = products.find((product) => product.id === item.id);

				if (matchProduct) {
					return {
						price_data: {
							currency: "usd",
							product_data: { name: matchProduct.name.en },
							unit_amount: matchProduct.price,
						},
						quantity: item.quantity,
					};
				}

				return null;
			})
			.filter((item) => item !== null);

		const session = await this.paymentsService.createCheckoutSession(lineItems);

		return {
			url: session.url,
		};
	}
}
