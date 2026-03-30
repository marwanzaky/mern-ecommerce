import { cn } from "@lib/utils";
import Icon from "@shared//components/ui/icon";
import { Section } from "@shared/components/ui/section";
import { TypographyH3, TypographyH4 } from "@shadcn/components/ui/typography";
import { TypographyMuted } from "@shadcn/components/ui/typography";

export default function WhyChooseUs() {
	return (
		<Section className="lg:pt-0! space-y-2 lg:space-y-4">
			<TypographyH3 className="text-center">
				Why Should You Choose Us?
			</TypographyH3>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<Reason
					icon="local_shipping"
					title="Free Shipping"
					description="All purchases over $199 are eligible for free shipping via USPS First Class Mail."
				/>
				<Reason
					icon="payments"
					title="Easy Payments"
					description="All payments are processed instantly over a secure payment protocol."
				/>
				<Reason
					icon="attach_money"
					title="Money-Back Guarantee"
					description="If an item arrived damaged or you've changed your mind, you can send it back for a full refund."
				/>
				<Reason
					icon="inventory_2"
					title="Finest Quality"
					description="Designed to last, each of our products has been crafted with the finest materials."
				/>
			</div>
		</Section>
	);
}

function Reason({
	title,
	description,
	icon,
}: {
	title: string;
	description: string;
	icon: string;
}) {
	return (
		<div className="group">
			<div
				className={cn(
					"mx-auto lg:mx-0 mb-6 flex justify-center items-center",
					"w-17.5 h-17.5",
					"bg-secondary rounded-xl",
					"group-hover:bg-primary/20 transition-colors",
				)}
			>
				<Icon
					className="group-hover:filter-(--filter-primary) transition-all"
					src={`icons/${icon}.svg`}
					size={32}
				/>
			</div>

			<TypographyH4 className="text-center lg:text-left truncate mb-6">
				{title}
			</TypographyH4>
			<TypographyMuted className="text-center lg:text-left text-sm md:text-base">
				{description}
			</TypographyMuted>
		</div>
	);
}
