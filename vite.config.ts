import {defineConfig} from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    dts: true,
    format: ["esm", "cjs"],
    exports: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    setupFiles: ["./vitest.setup.ts"],
  },
  fmt: {
    ignorePatterns: ["**/build/**", "**/dist/**"],
    printWidth: 80,
    bracketSpacing: false,
    arrowParens: "avoid",
    trailingComma: "es5",
    sortImports: {
      newlinesBetween: false,
    },
    sortTailwindcss: {
      preserveWhitespace: true,
      functions: ["tiwi", "tw"],
    },
  },
  lint: {
    ignorePatterns: ["**/build/**", "**/dist/**"],
    plugins: ["react"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "no-unused-vars": [
        "warn",
        {
          fix: {imports: "safe-fix", variables: "off"},
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
});
