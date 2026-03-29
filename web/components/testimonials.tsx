"use client";

import Icon from "@shared//components/ui/icon";

import { Section } from "@shared/components/ui/section";
import { Container } from "@shared/components/ui/container";
import { useIsMobile } from "@shadcn/hooks/use-mobile";

export default function Testimonials() {
	const isMobile = useIsMobile({ mobileBreakpoint: 1024 });

	return (
		<Section className="full-bleed bg-[#dfe6e9]">
			<Container>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
					<Testimonial
						blockquote="One of the bust purchases. Great, easy and safely in use."
						cite="Nihat Y."
					/>

					<Testimonial
						blockquote="Simply a very elegant peace of hardware, with a gorgeous UI in the app."
						cite="Kevin L."
					/>

					<Testimonial
						blockquote="Delivery was awesome! 1 day. Payment was simple. Product is perfect and save!"
						cite="Dimitrios G."
					/>

					{isMobile && (
						<Testimonial
							blockquote="Setup was quick, and everything works flawlessly. Highly recommend!"
							cite="Sarah M."
						/>
					)}
				</div>
			</Container>
		</Section>
	);
}

function Testimonial({
	blockquote,
	cite,
}: {
	blockquote: string;
	cite: string;
}) {
	return (
		<div>
			<div className="m-auto lg:m-0 mb-1 w-8">
				<Icon src="icons/format_quote.svg" size={32} />
			</div>

			<blockquote className="text-center italic lg:text-left text-sm md:text-base">
				{blockquote}
				<cite className="block mt-5 before:content-['\2014_\0020']">
					{cite}
				</cite>
			</blockquote>
		</div>
	);
}
