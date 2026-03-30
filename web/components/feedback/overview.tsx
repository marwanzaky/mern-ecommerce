import { useState } from "react";
import { useRouter } from "next/navigation";

import Stars from "@shared/components/ui/stars";

import { IProduct } from "@shared/interfaces";

import { useAppSelector } from "@redux/store";
import { productsService } from "@redux/services/products-service";
import { TypographyH4 } from "@shadcn/components/ui/typography";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@shadcn/components/ui/dialog";
import { Button } from "@shadcn/components/ui/button";
import { TypographyMuted } from "@shadcn/components/ui/typography";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";
import { Textarea } from "@shadcn/components/ui/textarea";
import { Star, StarIcon } from "lucide-react";
import { cn } from "@lib/utils";

export default function Overview({ product }: { product: IProduct }) {
	const router = useRouter();

	const { isAuthenticated, token } = useAppSelector(
		(state) => state.authReducer,
	);

	const [displayDialog, setDisplayDialog] = useState(false);
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [description, setDescription] = useState("");

	return (
		<div className="flex flex-col justify-center">
			<TypographyH4 className="mx-auto mb-4">Rating and reviews</TypographyH4>

			<div className="grid grid-cols-2 mb-8">
				<div className="flex flex-col items-center justify-center space-y-2">
					<div className="text-5xl font-bold leading-none">
						{product.avgRatings.toFixed(2)}
					</div>
					<Stars value={product.avgRatings} displayTotal={false} />
					<TypographyMuted className="leading-none">
						{product.numReviews} reviews
					</TypographyMuted>
				</div>

				<ul className="flex flex-col justify-center space-y-2">
					<OverviewRatesLi stars={1} percent="10%" />
					<OverviewRatesLi stars={2} percent="20%" />
					<OverviewRatesLi stars={3} percent="30%" />
					<OverviewRatesLi stars={4} percent="40%" />
					<OverviewRatesLi stars={5} percent="50%" />
				</ul>
			</div>

			<div className="flex justify-center">
				<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
					<form
						onSubmit={async () => {
							await productsService.postProductReview(
								token,
								product._id,
								rating,
								description,
							);

							toast("Your review is sent successfully!", {
								position: "top-center",
							});
						}}
					>
						<DialogTrigger asChild>
							<Button
								size="lg"
								onClick={(e) => {
									if (!isAuthenticated) {
										e.preventDefault();
										return router.push("/signin");
									}
									setRating(0);
								}}
							>
								Write a review
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[24rem] ">
							<DialogHeader>
								<DialogTitle>Write a review</DialogTitle>
								<DialogDescription>
									Please rate your experience and share any additional feedback.
								</DialogDescription>
							</DialogHeader>

							<FieldGroup>
								<Field>
									<FieldLabel>Rating</FieldLabel>
									<div className="flex">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												className="transition-transform hover:scale-110 "
												key={star}
												onClick={() => setRating(star)}
												onMouseEnter={() => setHoverRating(star)}
												onMouseLeave={() => setHoverRating(0)}
												type="button"
											>
												<StarIcon
													className={cn(
														"h-8 w-8 mr-1 transition-colors",
														(hoverRating || rating) >= star
															? "fill-yellow-400 text-yellow-400"
															: "text-muted-foreground",
													)}
												/>
											</button>
										))}
									</div>
								</Field>
								<Field>
									<FieldLabel id="description">Additional feedback</FieldLabel>
									<Textarea
										id="description"
										placeholder="Describe your experience..."
										className="min-h-32"
										onChange={(e) => setDescription(e.target.value)}
									></Textarea>
								</Field>
							</FieldGroup>

							<DialogFooter>
								<Button
									variant="outline"
									type="button"
									onClick={() => {
										setDisplayDialog(false);
									}}
								>
									Cancel
								</Button>

								<Button type="submit" disabled={rating === 0}>
									Submit
								</Button>
							</DialogFooter>
						</DialogContent>
					</form>
				</Dialog>
			</div>
		</div>
	);
}

function OverviewRatesLi({
	stars,
	percent,
}: {
	stars: number;
	percent: string;
}) {
	return (
		<li className="flex items-center">
			<div className="w-2.5 text-primary leading-none">★</div>
			<div className="w-12.5 text-center leading-none">{stars}</div>
			<div className="h-0.5 w-full bg-border">
				<div className="h-full bg-primary" style={{ width: percent }} />
			</div>
		</li>
	);
}
