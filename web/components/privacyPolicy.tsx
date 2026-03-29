import { TypographyP } from "@shadcn/components/ui/typography";
import { Section } from "@shared/components/ui/section";
import { TypographyH2, TypographyH4 } from "@shadcn/components/ui/typography";

export default function PrivacyPolicy() {
	return (
		<Section>
			<TypographyH2>Privacy Policy</TypographyH2>

			<TypographyH4>Privacy Policy</TypographyH4>
			<TypographyP>
				This Privacy Policy describes how {process.env.NEXT_PUBLIC_WEBSITE} (the
				“Site” or “we”) collects, uses, and discloses your Personal Information
				when you visit or make a purchase from the Site.
				<br />
				<br />
			</TypographyP>

			<TypographyH4>Collecting Personal Information</TypographyH4>
			<TypographyP>
				When you visit the Site, we collect certain information about your
				device, your interaction with the Site, and information necessary to
				process your purchases. We may also collect additional information if
				you contact us for customer support. In this Privacy Policy, we refer to
				any information that can uniquely identify an individual (including the
				information below) as “Personal Information”. See the list below for
				more information about what Personal Information we collect and why.
			</TypographyP>
		</Section>
	);
}
