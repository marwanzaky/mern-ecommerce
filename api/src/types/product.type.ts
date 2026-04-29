export type CreateProductEntity = {
	name: string;
	price: number;
	priceCompare: number;
	description: string;
	shortDescription?: string;
	imgUrls: string[];
	tags?: string[];
	stock?: number;
	category?: string | null;
};

export type UpdateProductEntity = Partial<CreateProductEntity>;
