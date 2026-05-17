import { defineConfig, globalIgnores } from "eslint/config";
import convexPlugin from "@convex-dev/eslint-plugin";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".agents/**",
    "node_modules/**",
    "convex/_generated/**",
    "coverage/**",
    "dist/**",
  ]),
  {
    rules: {
      "react-hooks/incompatible-library": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
    },
  },
  ...convexPlugin.configs.recommended,
];

export default defineConfig(config);
