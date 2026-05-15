import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import convexPlugin from "@convex-dev/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      ".next/**",
      ".agents/**",
      "node_modules/**",
      "convex/_generated/**",
      "coverage/**",
      "dist/**",
      "out/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...convexPlugin.configs.recommended,
];

export default config;
