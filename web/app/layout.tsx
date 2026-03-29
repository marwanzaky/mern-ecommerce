import "./globals.css";

import { Poppins, Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Footer from "@components/footer";
import Navigation from "@components/navigation";
import AppStateInit from "@components/appStateInit";

import { Container } from "@shared/components/ui/container";
import { TooltipProvider } from "@shadcn/components/ui/tooltip";

import AppProviders from "@redux/appProviders";

import { cn } from "@lib/utils";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// const poppins = Poppins({
// 	subsets: ["latin"],
// 	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// 	variable: "--font-poppins",
// 	display: "swap",
// });

export const metadata: Metadata = {
	title: "Mamolio",
	icons: {
		icon: "/icon.svg",
	},
	description: "eCommerce",
	manifest: "/manifest.json",
	keywords: ["ecommerce", "technology", "web application"],
};

export const viewport: Viewport = {
	width: "device-width shrink-to-fit=no",
	initialScale: 1,
	minimumScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("font-sans", inter.variable)}>
			<body className={cn("min-h-screen bg-background")}>
				<AppProviders>
					<AppStateInit />
					<Analytics />
					<SpeedInsights />
					<Toaster />
					{/* <Chatbot /> */}

					{/* Banner */}
					<div className="h-10.5 flex justify-center items-center text-center text-white bg-primary leading-none">
						Free shipping on orders over $50
					</div>

					{/* Navigation */}
					<div className="border-b-2 sticky top-0 bg-white z-50">
						<Container>
							<Navigation />
						</Container>
					</div>

					{/* Page */}
					<Container>
						<TooltipProvider>{children}</TooltipProvider>
					</Container>

					{/* Footer */}
					<Footer />
				</AppProviders>
			</body>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
		</html>
	);
}
