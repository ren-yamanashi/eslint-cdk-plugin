---
title: eslint-cdk-plugin - no-mutable-property-of-props-interface
titleTemplate: ":title"
---

# no-mutable-property-of-props-interface

<div class="info-item">
    ✅ <a href="/ja/rules/#recommended-rules">recommended</a>
  を使用した場合、このルールが有効になります。
</div>
<div class="info-item">
  🔧 このルールによってエラーになるコードは
  <a href="https://eslint.org/docs/latest/use/command-line-interface#--fix">
    ESLint の --fix コマンド
  </a>
  で自動修正できます。
</div>

このルールは、CDK Construct または Stack の、`Props` (interface) の `public` プロパティを変更可能にすることを禁止します。  
(`readonly` 修飾子がない Props プロパティの定義を禁止します)

Props で変更可能な `public` プロパティを指定すると、意図しない副作用を引き起こす可能性があるため、推奨されません。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default [
  {
    // ... some configs
    rules: {
      "cdk/no-mutable-property-of-props-interface": "error",
    },
  },
];
```

#### ✅ 正しい例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ✅ readonly なプロパティは許可されます
  readonly bucket: IBucket;
}
```

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

// ✅ Props ではない interface には、このルールは適用されません
interface MyInterface {
  bucket: IBucket;
}
```

#### ❌ 不正な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ Props のプロパティは `readonly` にすべきです
  bucket: IBucket;
}
```
