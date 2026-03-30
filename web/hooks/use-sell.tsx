import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	postUserProductAsync,
	removeUserProductAsync,
	updateUserProductAsync,
} from "@redux/thunks/user-products-thunks";

import { IProduct } from "@shared/interfaces";
import { Column } from "@shared/components/ui/table";
import { LogoCell } from "@shared/components/ui/table/cells/logo-cell";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@shadcn/components/ui/alert-dialog";
import { ButtonIcon } from "@shared/components/ui/button-icon";
import { ImageNode } from "@shared/components/ui/lexical/nodes/image-node";

import { useForm, useWatch } from "react-hook-form";

import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LineBreakNode, ParagraphNode } from "lexical";
import { ProductDialog } from "@app/sell/components/product-dialog";
import { createProductSlug } from "@utils/string-utils";

type CartItem = IProduct & { imgUrl: string };

export type SellInputs = {
	productId: string;
	category: string;
	name: string;
	description: string;
	priceRangeUsd: {
		min?: number;
		max?: number;
	};
	tags: string[];
	images: {
		url?: string;
		file?: File;
	}[];
};

export function useSell() {
	const router = useRouter();

	const dispatch = useDispatch<AppDispatch>();

	const { isAuthenticated } = useAppSelector((state) => state.authReducer);
	const { products } = useAppSelector((state) => state.userProductsReducer);

	const initialConfig: InitialConfigType = {
		namespace: "MyEditor",
		nodes: [ImageNode, ParagraphNode, LineBreakNode],
		theme: {
			paragraph: "editor-paragraph",
		},
		onError: console.error,
	};

	function PluginOnChange(editorState: string, isEmpty: boolean): void {
		setValue("description", isEmpty ? "" : editorState, {
			shouldValidate: true,
			shouldDirty: true,
		});
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		formState,
		control,
		reset,
		setValue,
	} = useForm<SellInputs>({
		mode: "onTouched",
	});

	const description = useWatch({
		control,
		name: "description",
	});

	const [displayDialog, setDisplayDialog] = useState(false);
	const [displayEditDialog, setDisplayEditDialog] = useState(false);

	const columns: Column<CartItem>[] = [
		{
			header: "Product",
			field: "imgUrl",
			type: "custom",
			className: "w-auto md:w-[60%]",
			render: (value, row) => (
				<LogoCell
					href={`products/${createProductSlug(row.name, row._id)}`}
					label={row.name}
					imgUrl={value}
				/>
			),
		},
		{ header: "Price", field: "price", type: "usd", width: "10%" },
		{
			header: "Compare",
			field: "priceCompare",
			type: "usd",
			width: "10%",
		},
		{
			header: "Stock",
			field: "stock",
			type: "number-input",
			width: "10%",
			onChange: (value, row) => {
				dispatch(
					updateUserProductAsync({
						id: row._id,
						data: {
							name: row.name,
							stock: value,
						},
					}),
				);
			},
		},
		{
			field: "_id",
			header: "",
			type: "custom",
			className: "w-21",
			render(value, row) {
				return (
					<div className="flex gap-2">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<ButtonIcon icon="delete" />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the product data from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											dispatch(removeUserProductAsync({ product: row }));
										}}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<ButtonIcon
							icon="edit"
							onClick={() => {
								reset({
									productId: row._id,
									name: row.name,
									description: row.description,
									priceRangeUsd: {
										min: row.price / 100,
										max: row.priceCompare / 100,
									},
									tags: row.tags,
									images: row.imgUrls.map((el) => ({ url: el })),
									category: row.category ? row.category : undefined,
								});

								setDisplayEditDialog(true);
							}}
						/>
					</div>
				);
			},
		},
	];

	const tableData: CartItem[] = products.map((item) => ({
		...item,
		imgUrl: item.imgUrls[0],
	}));

	useEffect(() => {
		if (isAuthenticated === false) {
			router.push("/signin");
		}
	}, []);

	const onAddProduct = ({
		name,
		description,
		priceRangeUsd,
		tags,
		images,
		category,
	}: SellInputs) => {
		if (priceRangeUsd.min && priceRangeUsd.max && description) {
			dispatch(
				postUserProductAsync({
					data: {
						name,
						description,
						price: priceRangeUsd.min * 100,
						priceCompare: priceRangeUsd.max * 100,
						imgFiles: images
							.filter(Boolean)
							.map((img) => img.file)
							.filter((img) => img !== undefined),
						tags,
						category,
						stock: 1,
					},
				}),
			);
		}

		setDisplayDialog(false);
		resetForm();
	};

	const onUpdateProduct = ({
		productId,
		name,
		description,
		priceRangeUsd,
		tags,
		images,
		category,
	}: SellInputs) => {
		const newImgs = images
			.map((img, index) => (img?.file ? { file: img.file, index } : null))
			.filter((el) => el !== null);

		const keptImgs = images
			.map((img, index) => (img?.url ? { url: img.url, index } : null))
			.filter((el) => el !== null);

		if (priceRangeUsd.min && priceRangeUsd.max) {
			dispatch(
				updateUserProductAsync({
					id: productId,
					data: {
						name,
						description,
						price: priceRangeUsd.min * 100,
						priceCompare: priceRangeUsd.max * 100,
						newImgs,
						keptImgs,
						tags,
						category,
					},
				}),
			);
		}

		setDisplayEditDialog(false);
		resetForm();
	};

	const resetForm = () => {
		reset({
			name: "",
			description: "",
			priceRangeUsd: {
				min: undefined,
				max: undefined,
			},
			tags: [],
			images: [],
			category: "",
		});
	};

	const EditProductDialog = (
		<ProductDialog
			// React-form-hook
			formState={formState}
			description={description}
			PluginOnChange={PluginOnChange}
			register={register}
			errors={errors}
			initialConfig={initialConfig}
			control={control}
			// Edit item dialog
			open={displayEditDialog}
			onOpenChange={setDisplayEditDialog}
			dialogHeader="Edit product"
			onSubmit={handleSubmit(onUpdateProduct)}
			cancelButtonText="Cancel"
			cancelButtonAction={() => {
				setDisplayEditDialog(false);
			}}
			submitButtonText="Update"
			injectLoadDescriptionPlugin
		/>
	);

	const AddProductDialog = (
		<ProductDialog
			// React-form-hook
			formState={formState}
			description={description}
			PluginOnChange={PluginOnChange}
			register={register}
			errors={errors}
			initialConfig={initialConfig}
			control={control}
			// Dialog
			open={displayDialog}
			onOpenChange={setDisplayDialog}
			dialogHeader="Add product"
			onSubmit={handleSubmit(onAddProduct)}
			submitButtonText="Add"
		/>
	);

	return {
		columns,
		tableData,
		resetForm,
		setDisplayDialog,
		AddProductDialog,
		EditProductDialog,
	};
}
