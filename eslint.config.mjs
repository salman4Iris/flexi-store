import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Modern ES6+ patterns
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "warn",
      "prefer-destructuring": [
        "warn",
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: true, object: true },
        },
        { enforceForRenamedProperties: false },
      ],
      "prefer-spread": "warn",
      "no-var": "error",
      "object-shorthand": "warn",

      // TypeScript strict patterns
      "@typescript-eslint/explicit-function-return-types": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
        },
      ],

      // React/Next.js patterns
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/jsx-boolean-value": ["warn", "never"],
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",
    },
  },
]);

export default eslintConfig;
