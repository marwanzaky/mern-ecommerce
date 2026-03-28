import { useState } from "react";
import { useRouter } from "next/navigation";

import Stars from "@shared/components/stars";

import { IProduct } from "@shared/interfaces";

import { useAppSelector } from "@redux/store";
import { productsService } from "@redux/services/productsService";
import { Textarea } from "@shared/components/textarea";
import { TypographyH4 } from "@shared/shadcn/typography";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shadcn/components/ui/dialog";
import { Label } from "@shadcn/components/ui/label";
import Ratings from "@shared/shadcn/ratings";
import Icon from "@shared/ui/icon";
import { Button } from "@shadcn/components/ui/button";
import { TypographyMuted } from "@shadcn/components/ui/typography";
import { toast } from "sonner";

export default function Overview({ product }: { product: IProduct }) {
	const router = useRouter();

	const { isAuthenticated, token } = useAppSelector(
		(state) => state.authReducer,
	);

	const [displayDialog, setDisplayDialog] = useState(false);
	const [dialogRating, setDialogRating] = useState(5);
	const [dialogDescription, setDialogDescription] = useState("");

	const openDialog = () => {
		if (!isAuthenticated) return router.push("/signin");
		setDisplayDialog(true);
	};

	const closeDialog = () => {
		setDisplayDialog(false);
	};

	const submitDialog = async () => {
		await productsService.postProductReview(
			token,
			product._id,
			dialogRating,
			dialogDescription,
		);

		toast("Your review is sent successfully!", { position: "top-center" });

		closeDialog();
	};

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
				<Button size="lg" onClick={openDialog}>
					Write a review
				</Button>
			</div>

			<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
				<DialogContent className="sm:max-w-[24rem] ">
					<DialogHeader>
						<DialogTitle>Write a review</DialogTitle>
						<DialogDescription>
							Share your experience with this product to help other shoppers
							like you.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<Ratings
							value={dialogRating}
							onValueChange={setDialogRating}
							Icon={<Icon src="icons/star.svg" />}
						/>

						<div className="space-y-4">
							<Label>Description</Label>
							<Textarea
								id="description"
								placeholder="Describe your experience..."
								icon="description"
								onChange={(e) => setDialogDescription(e.target.value)}
							/>
						</div>
					</div>

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

						<Button type="button" onClick={submitDialog}>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
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
