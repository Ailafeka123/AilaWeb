import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends:["next/core-web-vitals", "next/typescript",'next'],
    rules:{
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-console': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    }
  })
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
