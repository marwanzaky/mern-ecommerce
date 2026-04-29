import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	readonly price!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	readonly priceCompare!: number;

	@ApiProperty({
		type: "string",
		format: "binary",
		isArray: true,
	})
	readonly imgFiles!: Express.Multer.File[];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly description!: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly shortDescription?: string;

	@ApiPropertyOptional()
	@IsString({ each: true })
	@IsOptional()
	readonly tags?: string[];

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly stock?: number = 1;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly category?: string | null;
}
