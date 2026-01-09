import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import tanstackQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tanstackQuery.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["node_modules", "dist", ".vite", "out"],
  }
);
