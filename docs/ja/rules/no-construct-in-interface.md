---
title: eslint-cdk-plugin - no-construct-in-interface
titleTemplate: ":title"
---

# no-construct-in-interface

<div class="info-item">
  ✅ <a href="/ja/rules/#recommended-rules">recommended</a>
  を使用した場合、このルールが有効になります。
</div>

このルールは、`interface` のプロパティに CDK Construct 型 (例: `Bucket`) を指定することを禁止します。

interface のプロパティに Construct 型を使用すると、interface と Construct の間に密接な結合が作成されます。  
さらに、Construct は本質的に変更可能であるため、interface のプロパティに Construct 型を指定すると、予期しない動作が発生する可能性があります。  
したがって、このようなコードは推奨されません。

代わりに、読み取り専用リソースのための interface (例: `IBucket`) を指定することが推奨されます

---

#### 🔧 使用方法

```ts
// eslint.config.mjs
export default [
  {
    // ... some configs
    rules: {
      "cdk/no-construct-in-interface": "error",
    },
  },
];
```

#### ✅ 正しい例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ✅ 読み取り専用のインターフェース (`IBucket` など) は使用できます
  readonly bucket: IBucket;
}
```

#### ❌ 不正な例

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ Construct 型 (`Bucket` など) のプロパティは使用すべきではありません
  readonly bucket: Bucket;
}
```

<br />

<div>
  <a href="https://eslint-online-playground.netlify.app/#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" target="_blank" rel="noopener">
    <strong>View on Playground</strong>
    <svg style="display:inline;vertical-align:middle;margin-left:0.3em;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 3l-12 12" stroke="currentColor" stroke-width="2" fill="none"/><rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>
  </a>
</div>
