import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly name?: string;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly price?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly priceCompare?: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly description?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly shortDescription?: string;

	@ApiProperty()
	@IsString({ each: true })
	@IsOptional()
	readonly tags?: string[];

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly stock?: number;

	@ApiPropertyOptional({ type: [Number] })
	@Type(() => Number)
	@IsNumber({}, { each: true })
	@IsOptional()
	newImgsIndex?: number[];

	@ApiPropertyOptional({ type: [String] })
	@IsString({ each: true })
	@IsOptional()
	keptImgsUrl?: string[];

	@ApiPropertyOptional({ type: [Number] })
	@Type(() => Number)
	@IsNumber({}, { each: true })
	@IsOptional()
	keptImgsIndex?: number[];

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly category?: string;
}
