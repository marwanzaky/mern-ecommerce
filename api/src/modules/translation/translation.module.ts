import { Module } from "@nestjs/common";

import { GeminiModule } from "@/modules/gemini/gemini.module";

import { TranslationService } from "./translation.service";

@Module({
	imports: [GeminiModule],
	providers: [TranslationService],
	exports: [TranslationService],
})
export class TranslationModule {}
