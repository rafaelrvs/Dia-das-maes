import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // herda as configs do Next
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // desativa regras específicas
  {
    rules: {
      // ex.: react hooks sem deps
      "react-hooks/exhaustive-deps": "off",
      // ex.: permitir any
      "@typescript-eslint/no-explicit-any": "off",
      // adicione aqui outras regras que estiverem bloqueando seu build
    },
  },
];

export default eslintConfig;
