import globals from "globals";

export default {
  languageOptions: {
    globals: globals.browser,
  },
  env: {
    "node": true,
  },
  /*
  extends: [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReactConfig,
  ],
  */
};
