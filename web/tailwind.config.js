/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./utils/**/*.{js,ts,jsx,tsx}",
		"./hooks/**/*.{js,ts,jsx,tsx}",
		"./_shared/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			screens: {
				container: "1090px",
			},
			fontSize: {
				base: "15px",
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				mono: ["var(--font-geist-mono)"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {
				custom: {
					primary: {
						foreground: "#009679",
						background: "#b8fff1",
					},
					background: {
						DEFAULT: "#2d3436",
						foreground: "#f6f8f8",
					},
					grey: {
						DEFAULT: "#868686",
						foreground: "#f6f8f8",
					},
					border: "#dfe6e9",
				},
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "#009679", // "hsl(var(--primary))"
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
			},
			filter: {
				"custom-primary-foreground":
					"brightness(0) saturate(100%) invert(30%) sepia(85%) saturate(1559%) hue-rotate(146deg) brightness(99%) contrast(101%)",
				"custom-placeholder":
					"brightness(0) saturate(100%) invert(68%) sepia(4%) saturate(720%) hue-rotate(146deg) brightness(95%) contrast(89%)",
				"custom-star":
					"brightness(0) saturate(100%) invert(65%) sepia(86%) saturate(1066%) hue-rotate(343deg) brightness(100%) contrast(90%);",
			},
		},
	},
};
