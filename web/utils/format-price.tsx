const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";
const locale = process.env.NEXT_PUBLIC_LOCALE || "en-US";

export function formatPrice(amount: number) {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(amount / 100);
}
