import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { CreateCategory } from "@/shared/types/category.type";

export class CreateCategoryDto implements CreateCategory {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly slug!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	readonly sortOrder!: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly parent?: string | null;
}
