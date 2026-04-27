import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { importX } from "eslint-plugin-import-x";
import globals from "globals";
import tseslint from "typescript-eslint";
 
export default defineConfig([
  globalIgnores(["dist/**"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.strict,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    rules: {
      eqeqeq: ["error", "always"],
      "import-x/order": ["error", { alphabetize: { order: "asc" } }],
      "import-x/no-named-as-default-member": "off",
    },
  },
  eslintConfigPrettier,
]);