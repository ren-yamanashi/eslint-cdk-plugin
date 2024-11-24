---
title: eslint-cdk-plugin - Getting Started
titleTemplate: ":title"
---

# eslint-cdk-plugin

## Install

Just run this:

::: code-group

```sh [npm]
npm install --save-dev eslint-cdk-plugin
```

```sh [yarn]
yarn add -D eslint-cdk-plugin
```

```sh [pnpm]
pnpm install -D eslint-cdk-plugin
```

:::

## Setting eslint config

Write `eslint.config.mjs` as follows:

<div style="margin-top:16px; margin-bottom:16px; background-color: #595959; padding: 16px;border-radius: 4px;">
  🚨 This plugin only supports FlatConfig.
  <br />
  ❓ <a href="https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats">
    What's FlatConfig?
  </a>
</div>

This plugin is recommended to be used with `typescript-eslint` because it uses type information.

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintCdkPlugin from "eslint-cdk-plugin";

export default [
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  {
    plugins: {
      cdk: eslintCdkPlugin,
    },
    rules: {
      ...eslintCdkPlugin.configs.recommended.rules,
    },
  },
];
```

## Customize rules

If you want to customize the rules, write `eslint.config.mjs` as follows:

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintCdkPlugin from "eslint-cdk-plugin";

export default [
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  {
    plugins: {
      cdk: eslintCdkPlugin,
    },
    rules: {
      ...eslintCdkPlugin.configs.recommended.rules,
      "cdk/no-public-class-fields": "warn",
    },
  },
];
```
