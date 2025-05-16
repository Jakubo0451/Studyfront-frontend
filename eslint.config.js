import globals from "globals";
import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
 
export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/__tests__/**",
  ]),
  {
    files: ["**/*.js", "**/*.jsx"],
 
    // Extend recommended rule sets from:
    // 1. ESLint JS's recommended rules
    // 2. ESLint React's recommended rules
    extends: [eslintJs.configs.recommended, eslintReact.configs.recommended],
 
    // Configure language/parsing options
    languageOptions: {
      // Include browser global variables (window, document, etc.)
      globals: {
        ...globals.browser,
        process: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX syntax support
        },
      },
    },
 
    // Custom rule overrides (modify rule levels or disable rules)
    rules: {
      "@eslint-react/no-missing-key": "warn",
      "@eslint-react/no-array-index-key": "off",
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",
      "@eslint-react/dom/no-missing-iframe-sandbox":"off",
      "@eslint-react/dom/no-unsafe-iframe-sandbox":"off",
    },
  },
]);