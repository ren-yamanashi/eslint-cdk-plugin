---
title: eslint-cdk-plugin - Getting Started
titleTemplate: ":title"
---

# eslint-cdk-plugin

## インストール

以下のコマンドを実行してインストールします。

::: code-group

```sh [npm]
npm install -D eslint-cdk-plugin
```

```sh [yarn]
yarn add -D eslint-cdk-plugin
```

```sh [pnpm]
pnpm install -D eslint-cdk-plugin
```

:::

## eslint の設定

`eslint.config.mjs` を以下のように記述します。

<div style="margin-top:16px; margin-bottom:16px; background-color: #595959; padding: 16px;border-radius: 4px;">
  🚨 このプラグインは FlatConfig のみをサポートしています。
  <br />
  ❓  <a href="https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats">
    FlatConfig とは?
  </a>
</div>

```js
// eslint.config.mjs
import eslintCdkPlugin from "eslint-cdk-plugin";
export default [
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

## ルールのカスタマイズ

ルールをカスタマイズしたい場合は、`eslint.config.mjs` を以下のように記述します。

```js
// eslint.config.mjs
import eslintCdkPlugin from "eslint-cdk-plugin";
export default [
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
