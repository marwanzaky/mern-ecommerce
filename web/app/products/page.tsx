"use client";

import { SortOption, useProducts } from "@hooks/useProducts";

import ProductItem from "@shared/ui/productCart";
import { Chip } from "@shared/components/chip";
import { Section } from "@shared/components/section";
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
import { TypographyP } from "@shared/shadcn/typography";
import { InputCurrencyRange } from "@shared/components/InputCurrencyRange";
import RadioWithLabel from "@shared/components/radioWithLabel";
import { InputText } from "@shared/components/inputText";

import { formatPrice } from "@utils/formatPrice";
import { Button } from "@shadcn/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@shadcn/components/ui/radio-group";
import { Label } from "@shadcn/components/ui/label";

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
						<ProductItem key={item._id} data={item} />
					))}
				</div>
			</Section>

			<Dialog open={visible} onOpenChange={setVisible}>
				<DialogContent
					className="sm:max-w-[24rem]"
					onSubmit={(e) => {
						e.preventDefault();
						applyFilters();
					}}
				>
					<DialogHeader>
						<DialogTitle>Filters</DialogTitle>
					</DialogHeader>

					<form>
						<div className="flex flex-col gap-4">
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

							<InputText
								size="sm"
								placeholder="Search for a product"
								icon="search"
								value={draftName || ""}
								onChange={(event) => setDraftName(event.target.value)}
							/>

							<InputCurrencyRange
								minValue={draftMinPrice}
								maxValue={draftMaxPrice}
								onMinChange={(value) => setDraftMinPrice(value)}
								onMaxChange={(value) => setDraftMaxPrice(value)}
							/>

							<RadioGroup
								className="gap-1"
								onValueChange={(value) => {
									setDraftRating(parseInt(value));
								}}
							>
								<div className="flex items-center gap-2">
									<RadioGroupItem value="5" id="option-5" />
									<Label className="text-primary" htmlFor="option-5">
										★★★★★
									</Label>
								</div>
								<div className="flex items-center gap-2">
									<RadioGroupItem value="4" id="option-4" />
									<Label className="text-primary" htmlFor="option-4">
										★★★★
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<RadioGroupItem value="3" id="option-3" />
									<Label className="text-primary" htmlFor="option-3">
										★★★
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<RadioGroupItem value="2" id="option-2" />
									<Label className="text-primary" htmlFor="option-2">
										★★
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<RadioGroupItem value="1" id="option-1" />
									<Label className="text-primary" htmlFor="option-1">
										★
									</Label>
								</div>
							</RadioGroup>
						</div>

						<DialogFooter className="mt-4">
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
