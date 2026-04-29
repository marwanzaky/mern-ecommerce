import js from "@eslint/js";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
	{
		ignores: ["node_modules", "dist"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/**/*.ts"],
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"simple-import-sort/imports": [
				"warn",
				{
					groups: [
						["^\\u0000"],

						["^@nestjs"],

						["^[^@./]"],

						// e.g "@nestjs/..." etc...
						["^@"],

						// e.g "@/users/...", "@/products/..." etc...
						["^@/"],

						// e.g "./users/...", "./products/..." etc...
						["^\\."],
					],
				},
			],
			"simple-import-sort/exports": "warn",
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
);
