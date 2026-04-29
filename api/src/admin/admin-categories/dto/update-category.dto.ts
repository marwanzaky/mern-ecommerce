import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsBoolean,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { UpdateCategory } from "@/shared/types/category.type";

export class UpdateCategoryDto implements UpdateCategory {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsEmail()
	@IsOptional()
	readonly slug?: string;

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly sortOrder?: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly parent?: string | null;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === "true" || value === true)
	readonly isActive?: boolean;
}
