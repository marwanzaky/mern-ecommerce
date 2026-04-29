import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model } from "mongoose";

import {
	Category as CategoryType,
	CreateCategory,
	PublicCategory,
	PublicCategoryTree,
	UpdateCategory,
} from "@/shared/types/category.type";

import { Category as CategoryEntity } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(CategoryEntity.name)
		private categoryModel: Model<CategoryEntity>,
	) {}

	async create(params: CreateCategory): Promise<CategoryEntity> {
		const { name, parent, slug, sortOrder, imgUrl } = params;

		const category = await this.categoryModel.create({
			name,
			parent,
			slug,
			sortOrder,
			imgUrl,
		});

		return category.save();
	}

	async find(filter?: Partial<CategoryType>): Promise<CategoryEntity[]> {
		return this.categoryModel.find(filter ? filter : {});
	}

	async findOne(
		filter?: Partial<CategoryType>,
	): Promise<CategoryEntity | null> {
		return this.categoryModel.findOne(filter);
	}

	async findPublic(filter?: Partial<CategoryType>): Promise<PublicCategory[]> {
		return this.categoryModel
			.find(filter ? filter : {})
			.select("name slug parent imgUrl");
	}

	async getPublicCategoryTree() {
		const categories = await this.categoryModel
			.find({ isActive: true })
			.select("name slug parent imgUrl");

		const categoryMap = new Map<string, PublicCategoryTree>();

		categories.forEach((cat) => {
			categoryMap.set(cat.id, {
				id: cat.id,
				name: cat.name,
				slug: cat.slug,
				imgUrl: cat.imgUrl,
				children: [],
			});
		});

		const tree: PublicCategoryTree[] = [];

		categories.forEach((cat) => {
			if (cat.parent) {
				const parent = categoryMap.get(cat.parent.toString());

				if (parent) {
					const categoryTree = categoryMap.get(cat.id);
					categoryTree && parent.children.push(categoryTree);
				}
			} else {
				const categoryTree = categoryMap.get(cat.id);
				categoryTree && tree.push(categoryTree);
			}
		});

		return tree;
	}

	findOneAndUpdate(
		id: string,
		update: UpdateCategory,
	): Promise<CategoryEntity | null> {
		return this.categoryModel.findOneAndUpdate(
			{
				_id: new mongoose.Types.ObjectId(id),
			},
			update,
			{
				new: true,
				runValidators: true,
			},
		);
	}

	async getAllDescendantCategoryIds(category: string): Promise<string[]> {
		const categories = await this.find();

		const map = new Map<string, string[]>();
		categories.forEach((cat: CategoryEntity) => {
			if (cat.parent) {
				if (!map.has(cat.parent.toString())) {
					map.set(cat.parent.toString(), []);
				}

				map.get(cat.parent.toString())?.push(cat.id.toString());
			}
		});

		const result: string[] = [];
		const stack = [category];

		while (stack.length) {
			const current = stack.pop() || "";
			result.push(current);

			const children = map.get(current) || [];
			stack.push(...children);
		}

		return result;
	}
}
