import nextConfig from "eslint-config-next";
import tseslint from "typescript-eslint";

// eslint-config-next@16 ships a flat-config array. typescript-eslint is
// brought in explicitly so we can reference @typescript-eslint/* rules.
const eslintConfig = [
  ...nextConfig,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  {
    files: ["**/scripts/**", "**/*.config.{ts,mjs,js}"],
    rules: { "no-console": "off" },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "supabase/migrations/**",
      "src/components/ui/**",
      "src/hooks/**",
    ],
  },
];

export default eslintConfig;
