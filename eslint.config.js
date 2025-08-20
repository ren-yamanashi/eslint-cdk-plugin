import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    files: ["src/*.{mts,ts}", "src/**/*.{mts,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [
      "*.js",
      "dist",
      "node_modules",
      ".vscode",
      "package.json",
      "docs",
      "examples",
    ],
  }
);
