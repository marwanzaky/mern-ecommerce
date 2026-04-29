import { Injectable } from "@nestjs/common";

import { ContentListUnion, GoogleGenAI } from "@google/genai";

@Injectable()
export class GeminiService {
	ai = new GoogleGenAI({});

	async sendMessage(options: {
		promptContent: string;
		systemContent: string;
		previousChat: string;
	}) {
		const { promptContent, systemContent, previousChat } = options;

		try {
			return await this.request([
				{ role: "user", parts: [{ text: systemContent }] },
				{ role: "model", parts: [{ text: previousChat }] },
				{ role: "user", parts: [{ text: promptContent }] },
			]);
		} catch (error) {
			console.log("err", error);
			return `An error occurred: ${error}`;
		}
	}

	async request(contents: ContentListUnion): Promise<string | undefined> {
		const response = await this.ai.models.generateContent({
			model: "gemini-3.1-flash-lite-preview",
			contents,
		});

		return response.text;
	}
}
