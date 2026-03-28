import { cn } from "@lib/utils";
import Icon from "@shared/ui/icon";
import { Section } from "@shared/components/section";
import { TypographyH3 } from "@shared/shadcn/typography";
import { TypographyMuted, TypographyP } from "@shadcn/components/ui/typography";

export default function WhyChooseUs() {
	return (
		<Section className="lg:pt-0! space-y-2 lg:space-y-4">
			<TypographyH3 className="text-center lg:text-left">
				Why should you choose us?
			</TypographyH3>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
				<Reason
					icon="local_shipping"
					title="Free Shipping"
					des="All purchases over $199 are eligible for free shipping via USPS First Class Mail."
				/>
				<Reason
					icon="payments"
					title="Easy Payments"
					des="All payments are processed instantly over a secure payment protocol."
				/>
				<Reason
					icon="attach_money"
					title="Money-Back Guarantee"
					des="If an item arrived damaged or you've changed your mind, you can send it back for a full refund."
				/>
				<Reason
					icon="inventory_2"
					title="Finest Quality"
					des="Designed to last, each of our products has been crafted with the finest materials."
				/>
			</div>
		</Section>
	);
}

function Reason({
	title,
	des,
	icon,
}: {
	title: string;
	des: string;
	icon: string;
}) {
	return (
		<div className="group">
			<div
				className={cn(
					"mx-auto lg:mx-0 mb-8 flex justify-center items-center",
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

			<div className="text-center font-bold mb-5 truncate lg:text-left text-sm md:text-base">
				{title}
			</div>
			<TypographyMuted className="text-center max-w-xs mx-auto lg:mx-0 lg:text-left text-sm md:text-base">
				{des}
			</TypographyMuted>
		</div>
	);
}
