"use client";

import { useMemo } from "react";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { categoriesService } from "@/redux/services/categories-service";

import { useI18n } from "@/components/layout/i18n-provider";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shadcn/components/ui/breadcrumb";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";

import { PublicCategoryTree } from "@/shared/types/category.type";
import { ProductWithReviewsEntity } from "@/shared/types/product.types";

import { localizePath } from "@/lib/i18n";

export default function ProductBreadcrumb({
	product,
}: {
	product: ProductWithReviewsEntity;
}) {
	const { locale, t } = useI18n();

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const productSubcategoryTree = useMemo(
		() =>
			categoryTree
				?.flatMap((cat) => [...cat.children, cat])
				.find((cat) => cat.id === product.category),
		[categoryTree, product],
	);

	const productCategoryTree = useMemo<PublicCategoryTree | undefined>(
		() =>
			categoryTree?.find((rootCat) =>
				rootCat.children.some((childCat) => childCat.id === product.category),
			),
		[categoryTree, product],
	);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href={localizePath("/", locale)}>{t("product.home")}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							href={localizePath(
								`/products?category=${productCategoryTree?.slug}`,
								locale,
							)}
						>
							{productCategoryTree?.name}
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							href={localizePath(
								`/products?category=${productSubcategoryTree?.slug}`,
								locale,
							)}
						>
							{productSubcategoryTree?.name}
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem className="min-w-0 flex-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<BreadcrumbPage className="truncate">
								{product.name[locale]}
							</BreadcrumbPage>
						</TooltipTrigger>
						<TooltipContent>{product.name[locale]}</TooltipContent>
					</Tooltip>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
