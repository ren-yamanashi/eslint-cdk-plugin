---
title: eslint-cdk-plugin - Rules
titleTemplate: ":title"
---

<script setup>
import RuleItem from '../../components/RuleItem.vue'
</script>

<style>
.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.legend {
  margin-bottom: 16px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  padding: 12px;
  background-color: var(--vp-c-bg);
  border-radius: 4px;
}

.legend-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-text {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
</style>

# Rules

## Rules Reference

<div class="legend">
  <div class="legend-item">
    <div class="legend-icon">
      <span class="status-icon recommended">✅</span>
    </div>
    <span class="legend-text"><a href="/rules/#recommended-rules">recommended</a> 設定を使用した場合に有効になるルールです</span>
  </div>
  <div class="legend-item">
    <div class="legend-icon">
      <span class="status-icon fixable">🔧</span>
    </div>
    <span class="legend-text">
      <a href="https://eslint.org/docs/latest/use/command-line-interface#--fix">--fix</a>
      オプションを使用して自動的に修正できるルールです
    </span>
  </div>
</div>

現在は、以下のルールをサポートしております。

<ul class="rule-list">
  <RuleItem
    name="construct-constructor-property"
    description="CDK Construct の constructor が 'scope, id' または 'scope, id, props' というプロパティ名を持つことを強制します"
    link="/ja/rules/construct-constructor-property"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-construct-in-interface"
    description="interface のプロパティに CDK Construct 型 (例: Bucket) を指定することを禁止します"
    link="/ja/rules/no-construct-in-interface"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-construct-in-public-property-of-construct"
    description="CDK Construct の public プロパティに Construct 型 (例: Bucket) を指定することを禁止します"
    link="/ja/rules/no-construct-in-public-property-of-construct"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-construct-stack-suffix"
    description="Construct ID および Stack ID に 'Construct' または 'Stack' 文字列を含めることを禁止します"
    link="/ja/rules/no-construct-stack-suffix"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-import-private"
    description="異なる階層レベルの private ディレクトリからのモジュールの import を禁止します"
    link="/ja/rules/no-import-private"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="no-mutable-property-of-props-interface"
    description="Props (interface) のプロパティに readonly を指定することを強制します"
    link="/ja/rules/no-mutable-property-of-props-interface"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="no-mutable-public-property-of-construct"
    description="Construct の public プロパティに readonly を指定することを強制します"
    link="/ja/rules/no-mutable-public-property-of-construct"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="no-parent-name-construct-id-match"
    description="Construct ID に 親クラスの名前を指定することを禁止します"
    link="/ja/rules/no-parent-name-construct-id-match"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-unused-props"
    description="Construct の Props (interface) に定義されたすべてのプロパティがコンストラクタ内で使用されることを強制します"
    link="/ja/rules/no-unused-props"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="no-variable-construct-id"
    description="Construct ID に変数を使用しないように強制します"
    link="/ja/rules/no-variable-construct-id"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="pascal-case-construct-id"
    description="Construct ID に PascalCase を強制します"
    link="/ja/rules/pascal-case-construct-id"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="props-name-convention"
    description="Props (interface) 名が ${ConstructName}Props の形式に従うことを強制します"
    link="/ja/rules/props-name-convention"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="require-jsdoc"
    description="Props(interface) のプロパティと Construct の public プロパティに JSDoc の記載を必須とします"
    link="/ja/rules/require-jsdoc"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="require-passing-this"
    description="Construct のコンストラクタに this を渡すように強制します"
    link="/ja/rules/require-passing-this"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="require-props-default-doc"
    description="Props (interface) のオプショナルなプロパティに '@default' JSDoc を書くことを強制します"
    link="/ja/rules/require-props-default-doc"
    :isRecommended="false"
    :isFixable="false"
  />
</ul>

## Recommended Rules

`recommended` ルールは、コードを正しく保つための推奨ルールです。  
このルールを使用する場合は、以下のように設定します。

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-cdk-plugin";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    // ✅ Add plugins
    extends: [cdkPlugin.configs.recommended],
    // ... some configs
  },
]);
```

## Strict Rules

`strict` ルールは、利用可能なすべてのルールを提供します。  
このルールを使用する場合は、以下のように設定します。

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-cdk-plugin";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    // ✅ Add plugins
    extends: [cdkPlugin.configs.strict],
    // ... some configs
  },
]);
```
