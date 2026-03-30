"use client";

import { SortOption, useProducts } from "@hooks/use-products";

import ProductCard from "@shared/components/ui/product-card";
import { Chip } from "@shared/components/ui/chip";
import { Section } from "@shared/components/ui/section";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shadcn/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shadcn/components/ui/dialog";
import { TypographyP } from "@shadcn/components/ui/typography";
import { InputCurrencyRange } from "@shared/components/ui/input-currency-range";

import { formatPrice } from "@utils/format-price";
import { Button } from "@shadcn/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@shadcn/components/ui/radio-group";
import { Label } from "@shadcn/components/ui/label";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";
import { StarIcon } from "lucide-react";
import { cn } from "@lib/utils";

export default function Page() {
	const {
		isLoading,
		data,

		name,
		category,
		minPrice,
		maxPrice,
		rating,
		options,
		categories,

		setSort,
		sort,
		visible,
		setVisible,

		draftName,
		setDraftName,
		draftCategory,
		setDraftCategory,
		draftMinPrice,
		setDraftMinPrice,
		draftMaxPrice,
		setDraftMaxPrice,
		draftRating,
		setDraftRating,

		openFilterDialog,

		clearName,
		clearCategory,
		clearRating,
		clearPriceRange,
		cancelFilters,

		applyFilters,
	} = useProducts();

	return (
		<div>
			<Section>
				<div className="flex items-center justify-between gap-4 mb-4">
					<div className="flex items-center gap-4 flex-1 min-w-0">
						<Button variant="outline" onClick={openFilterDialog}>
							All filters
						</Button>

						<div className="flex flex-1 items-center gap-2 scrollbar-hide overflow-auto">
							{name && name !== undefined && (
								<Chip onClick={clearName}>Search &quot;{name}&quot;</Chip>
							)}
							{category && category !== undefined && (
								<Chip onClick={clearCategory}>Category: {category}</Chip>
							)}
							{minPrice && maxPrice && (
								<Chip onClick={clearPriceRange}>
									{formatPrice(minPrice)} - {formatPrice(maxPrice)}
								</Chip>
							)}
							{minPrice != undefined && maxPrice == null && (
								<Chip onClick={clearPriceRange}>
									Above {formatPrice(minPrice)}
								</Chip>
							)}
							{minPrice == null && maxPrice != undefined && (
								<Chip onClick={clearPriceRange}>
									Under {formatPrice(maxPrice)}
								</Chip>
							)}

							{rating !== undefined && rating === 5 && (
								<Chip onClick={clearRating}>5 Rating</Chip>
							)}
							{rating !== undefined && rating === 4 && (
								<Chip onClick={clearRating}>4.0+ Rating</Chip>
							)}
							{rating !== undefined && rating === 3 && (
								<Chip onClick={clearRating}>3.0+ Rating</Chip>
							)}
							{rating !== undefined && rating === 2 && (
								<Chip onClick={clearRating}>2.0+ Rating</Chip>
							)}
							{rating !== undefined && rating === 1 && (
								<Chip onClick={clearRating}>1.0+ Rating</Chip>
							)}
						</div>
					</div>

					<div className="flex justify-end items-center gap-4 shrink-0">
						{isLoading === false && (
							<TypographyP className="text-muted-foreground hidden sm:block">
								Showing {data?.length} Products
							</TypographyP>
						)}

						<div className="flex items-center gap-2">
							<TypographyP className="hidden sm:block whitespace-nowrap">
								Sort by:
							</TypographyP>

							<Select
								value={sort}
								onValueChange={(value) => setSort(value as SortOption)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{options.map((item) => (
											<SelectItem
												key={`select-item-${item.value}`}
												value={item.value}
											>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{data?.map((item) => (
						<ProductCard key={item._id} data={item} />
					))}
				</div>
			</Section>

			<Dialog open={visible} onOpenChange={setVisible}>
				<DialogContent
					className="sm:max-w-sm"
					onSubmit={(e) => {
						e.preventDefault();
						applyFilters();
					}}
				>
					<DialogHeader>
						<DialogTitle>Filters</DialogTitle>
					</DialogHeader>

					<form>
						<FieldGroup>
							<Field>
								<FieldLabel>Category</FieldLabel>
								<Select
									value={draftCategory}
									onValueChange={(value) => setDraftCategory(value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{categories?.map((cat) => (
												<SelectItem
													key={`select-item-${cat.slug}`}
													value={cat.slug}
												>
													{cat.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									id="name"
									placeholder="e.g., notebook, wall, and printer"
									value={draftName || ""}
									onChange={(event) => setDraftName(event.target.value)}
								/>
							</Field>
							<Field>
								<FieldLabel>Price Range</FieldLabel>
								<InputCurrencyRange
									minValue={draftMinPrice}
									maxValue={draftMaxPrice}
									onMinChange={(value) => setDraftMinPrice(value)}
									onMaxChange={(value) => setDraftMaxPrice(value)}
								/>
							</Field>
							<Field className="mb-4">
								<FieldLabel>Rating</FieldLabel>
								<RadioGroup
									className="gap-1"
									onValueChange={(value) => {
										setDraftRating(parseInt(value));
									}}
								>
									<div className="flex items-center gap-2">
										<RadioGroupItem value="5" id="option-5" />
										<Label className="gap-0.5" htmlFor="option-5">
											{[1, 2, 3, 4, 5].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>
									<div className="flex items-center gap-2">
										<RadioGroupItem value="4" id="option-4" />
										<Label className="gap-0.5" htmlFor="option-4">
											{[1, 2, 3, 4].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<RadioGroupItem value="3" id="option-3" />
										<Label className="gap-0.5" htmlFor="option-3">
											{[1, 2, 3].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<RadioGroupItem value="2" id="option-2" />
										<Label className="gap-0.5" htmlFor="option-2">
											{[1, 2].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<RadioGroupItem value="1" id="option-1" />
										<Label htmlFor="option-1">
											<StarIcon
												className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
											/>
										</Label>
									</div>
								</RadioGroup>
							</Field>
						</FieldGroup>

						<DialogFooter>
							<Button variant="outline" onClick={cancelFilters}>
								Cancel
							</Button>

							<Button type="submit">Apply filter</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
