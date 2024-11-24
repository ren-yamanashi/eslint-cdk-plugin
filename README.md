# eslint-cdk-plugin

ESLint plugin for [AWS CDK](https://github.com/aws/aws-cdk).

## Installation

```bash
# npm
npm install --save-dev eslint-cdk-plugin

# yarn
yarn add -D eslint-cdk-plugin

# pnpm
pnpm install -D eslint-cdk-plugin
```

## Usage

### Use recommended config

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

### For more detailed documentation, see [docs for eslint-cdk-plugin](https://eslint-cdk-plugin.dev/)
