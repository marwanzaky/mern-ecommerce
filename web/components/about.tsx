"use client";

import { Button } from "@shadcn/components/ui/button";
import { TypographyP } from "@shadcn/components/ui/typography";
import { Section } from "@shared/components/ui/section";
import { Container } from "@shared/components/ui/container";
import { TypographyH2, TypographyH4 } from "@shadcn/components/ui/typography";
import { useRouter } from "next/navigation";

function Paragraph({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<TypographyH4>{title}</TypographyH4>
			<TypographyP>{children}</TypographyP>
		</div>
	);
}

export default function About() {
	const router = useRouter();

	return (
		<Section className="full-bleed bg-[#b2bec3]">
			<Container>
				<TypographyH2 className="text-center border-muted-foreground border-none">
					What is {process.env.NEXT_PUBLIC_NAME}?
				</TypographyH2>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
					<Paragraph title="A community doing good">
						{process.env.NEXT_PUBLIC_NAME} is a global online marketplace, where
						people come together to make, sell, buy, and collect unique items.
						We&#39;re also a community pushing for positive change for small
						businesses, people, and the planet. Here are some of the ways
						we&#39;re making a positive impact, together.
					</Paragraph>
					<Paragraph title="Support independent creators">
						There&#39;s no {process.env.NEXT_PUBLIC_NAME} warehouse – just
						millions of people selling the things they love. We make the whole
						process easy, helping you connect directly with makers to find
						something extraordinary.
					</Paragraph>
					<Paragraph title="Peace of mind">
						Your privacy is the highest priority of our dedicated team. And if
						you ever need assistance, we are always ready to step in for
						support.
					</Paragraph>
				</div>

				<div>
					<TypographyH4 className="text-center mb-6">
						Have a question? contact us here.
					</TypographyH4>

					<div className="flex justify-center">
						<Button size="lg" onClick={() => router.push("/contact")}>
							Contact
						</Button>
					</div>
				</div>
			</Container>
		</Section>
	);
}
