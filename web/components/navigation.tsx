"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useAppSelector } from "@redux/store";

import { cn } from "@lib/utils";

import { ButtonIcon } from "@shared/ui/buttonIcon";
import { ImageButton } from "@shared/ui/imageButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@shadcn/components/ui/dropdown-menu";
import { InputText } from "@shared/components/inputText";
import { useIsMobile } from "@shared/shadcn/hooks/use-mobile";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@redux/services/categoriesService";
import { ProductsPageParams } from "@hooks/useProducts";

export default function Navigation() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();

	const { isAuthenticated, user } = useAppSelector(
		(state) => state.authReducer,
	);
	const { items } = useAppSelector((state) => state.cartReducer);

	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		const params = Object.fromEntries(
			searchParams.entries(),
		) as ProductsPageParams;
		setSearch(params.name ? params.name : "");
	}, [searchParams]);

	return (
		<nav className="flex justify-between gap-2 md:gap-4 h-16 md:h-20">
			<div className="flex-1 flex items-center gap-2 md:gap-4">
				<div>
					<NavigationMenu />
				</div>

				<Link
					className="hidden lg:block font-bold text-lg hover:text-custom-primary-foreground transition-colors"
					href="/"
				>
					{process.env.NEXT_PUBLIC_NAME}
				</Link>

				<form
					onSubmit={(event) => {
						event.preventDefault();
						const params = new URLSearchParams();
						params.set("name", search ? search : "");
						router.push(`/products?${params.toString()}`);
					}}
				>
					<InputText
						size="sm"
						icon={isMobile ? undefined : "search"}
						placeholder="Search..."
						className="md:w-40"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
				</form>
			</div>

			<ul className="flex-2 hidden sm:flex items-center justify-center gap-10">
				<NavLi href="/" name="Home" />
				<NavLi href="/products" name="Shop" />
				{process.env.NEXT_PUBLIC_ABOUT === "true" && !isMobile && (
					<NavLi href="/about" name="About" />
				)}
				<NavLi href="/contact" name="Contact" />
			</ul>

			<div className="flex-1 flex items-center justify-end">
				<ButtonIcon icon="storefront" onClick={() => router.push("/sell")} />
				<ButtonIcon icon="favorite" onClick={() => router.push("/favorites")} />
				<ButtonIcon
					className="relative"
					icon="shopping_cart"
					onClick={() => router.push("/cart")}
				>
					{items.length > 0 && <Badge>{items.length}</Badge>}
				</ButtonIcon>

				{isAuthenticated
					? process.env.NEXT_PUBLIC_ACCOUNT === "true" && (
							<div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<ImageButton imgUrl={user?.photoUrl || "/img/avatar.jpg"} />
									</DropdownMenuTrigger>

									<DropdownMenuContent
										className="w-fit"
										side="bottom"
										align="end"
										sideOffset={4}
									>
										<DropdownMenuLabel>
											<div className="flex flex-col space-y-1">
												<span className="truncate font-medium text-sm leading-none">
													{user?.name}
												</span>
												<span className="text-xs font-normal leading-none text-muted-foreground">
													{user?.email}
												</span>
											</div>
										</DropdownMenuLabel>

										<DropdownMenuSeparator />

										<DropdownMenuGroup>
											<DropdownMenuItem
												onClick={() => {
													router.push("/account");
												}}
											>
												Account
											</DropdownMenuItem>
										</DropdownMenuGroup>

										<DropdownMenuSeparator />

										{user && user.role === "admin" && (
											<>
												<DropdownMenuLabel className="text-sm">
													Admin
												</DropdownMenuLabel>

												<DropdownMenuGroup>
													<DropdownMenuItem
														onClick={() => {
															router.push("/admin/messages");
														}}
													>
														Messages
													</DropdownMenuItem>

													<DropdownMenuItem
														onClick={() => {
															router.push("/admin/categories");
														}}
													>
														Categories
													</DropdownMenuItem>
												</DropdownMenuGroup>

												<DropdownMenuSeparator />
											</>
										)}

										<DropdownMenuItem
											onClick={() => {
												window.localStorage.clear();
												location.reload();
											}}
										>
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)
					: process.env.NEXT_PUBLIC_ACCOUNT === "true" && (
							<ButtonIcon
								icon="person"
								onClick={() => router.push("/signin")}
							/>
						)}
			</div>
		</nav>
	);
}

function NavigationMenu() {
	const router = useRouter();

	const { data } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<ButtonIcon icon="menu" />
			</DropdownMenuTrigger>

			<DropdownMenuContent side="bottom" align="start" sideOffset={4}>
				<DropdownMenuLabel>Categories</DropdownMenuLabel>

				{data?.map((cat) => (
					<DropdownMenuSub key={`menu-sub-${cat.slug}`}>
						<DropdownMenuSubTrigger>{cat.name}</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{cat.children.map((subcat) => (
									<DropdownMenuItem
										key={`menu-item-${subcat.slug}`}
										onClick={() => {
											const params = new URLSearchParams();
											params.set("category", subcat.slug);
											router.push(`/products?${params.toString()}`);
										}}
									>
										{subcat.name}
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function NavLi({ href, name }: { href: string; name: string }) {
	const pathname = usePathname();
	let select = pathname === href;

	if (href === "/products" && pathname.includes("/product")) select = true;

	return (
		<li>
			<Link
				className={cn(
					"pb-1.5 border-b-2 border-transparent hover:border-b-primary hover:text-custom-primary-foreground transition-colors leading-none",
					select && "font-bold text-primary",
				)}
				href={href}
			>
				{name}
			</Link>
		</li>
	);
}

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={cn(
				"absolute inline-flex justify-center items-center",
				"top-1.25 -right-1.25 h-3.5 w-3.5",
				"bg-primary text-white text-xs rounded-full",
			)}
		>
			{children}
		</div>
	);
}
