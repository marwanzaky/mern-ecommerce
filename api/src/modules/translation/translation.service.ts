import { Injectable } from "@nestjs/common";

import { GeminiService } from "@/modules/gemini/gemini.service";
import { TranslatedText } from "@/shared/types/product.types";

type TextNodeRef = {
	node: any;
	path: number[];
};

const locales = ["en", "fr", "ar"] as const;

type Locale = (typeof locales)[number];

const labledLocale = {
	en: "English",
	fr: "French",
	ar: "Arabic",
};

function extractTextNodes(root: any): TextNodeRef[] {
	const results: TextNodeRef[] = [];

	function walk(node: any) {
		if (!node) return;

		if (node.type === "text" && typeof node.text === "string") {
			results.push({ node } as TextNodeRef);
		}

		if (node.children) {
			node.children.forEach(walk);
		}
	}

	walk(root);
	return results;
}

@Injectable()
export class TranslationService {
	private defaultLocale: Locale;

	constructor(private geminiService: GeminiService) {
		this.defaultLocale = process.env.DEFAULT_LOCALE as Locale;
	}

	async translateText(text: string): Promise<TranslatedText> {
		const result: TranslatedText = {
			en: "",
			fr: "",
			ar: "",
		};

		result[this.defaultLocale] = text;

		const langs = locales.filter((locale) => locale !== this.defaultLocale);

		const translations = await Promise.all(
			langs.map((lang) => this.translateTextToLanguage(text, lang)),
		);

		langs.forEach((lang, index) => {
			result[lang] = translations[index] ?? "";
		});

		return result;
	}

	async translateJson(json: string): Promise<TranslatedText> {
		const result: TranslatedText = {
			en: "",
			fr: "",
			ar: "",
		};

		result[this.defaultLocale] = json;

		const langs = locales.filter((locale) => locale !== this.defaultLocale);

		const translations = await Promise.all(
			langs.map((lang) => this.translateJsonToLanguage(json, lang)),
		);

		langs.forEach((lang, index) => {
			result[lang] = translations[index] ?? "";
		});

		return result;
	}

	private async translateJsonToLanguage(
		json: string,
		language: Locale,
	): Promise<string> {
		const jsonObj = JSON.parse(json);
		const nodes = extractTextNodes(jsonObj.root);

		const texts = nodes.map((n) => n.node.text);

		const translatedTexts = await this.translateBatch(texts, language);

		if (nodes.length !== translatedTexts.length) {
			throw new Error("Mismatch between texts and translations");
		}

		nodes.forEach((ref, i) => {
			ref.node.text = translatedTexts[i];
		});

		return JSON.stringify(jsonObj);
	}

	private async translateBatch(
		texts: string[],
		language: Locale,
	): Promise<string[]> {
		const prompt = `
Translate the following array of strings to ${labledLocale[language]}.
Return ONLY a valid JSON array of translated strings in the same order.
Do not include explanations or extra text.

${JSON.stringify(texts)}`;

		const text = await this.geminiService.request(prompt);

		const cleaned = (text || "")
			.replace(/```json\s*/i, "")
			.replace(/```$/, "")
			.trim();

		return JSON.parse(cleaned) as string[];
	}

	private async translateTextToLanguage(
		text: string,
		language: Locale,
	): Promise<string | undefined> {
		const prompt = `Translate the following text to ${labledLocale[language]}. Provide only the translated text without any additional explanation or notes:\n\n${text}`;

		return await this.geminiService.request(prompt);
	}
}
