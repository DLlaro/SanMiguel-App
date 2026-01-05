// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  // Config base de Expo
  expoConfig,

  // Reglas de Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "comma-dangle": "off",
    },
  },

  // Desactiva reglas que chocan con Prettier
  prettierConfig,

  // Archivos a ignorar
  {
    ignores: ["dist/*", "node_modules/*"],
  },
]);
