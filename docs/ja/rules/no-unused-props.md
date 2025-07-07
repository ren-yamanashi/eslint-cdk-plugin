---
title: eslint-cdk-plugin - no-unused-props
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../../components/NotRecommendedItem.vue'
import NextRecommendedItem from '../../components/NextRecommendedItem.vue'
</script>

# no-unused-props

<NotRecommendedItem japanese />
<NextRecommendedItem japanese version="v4.0.0" />

このルールは、Construct の Props (interface) で定義されたすべてのプロパティが、Construct のコンストラクタ内で実際に使用されることを強制します。

CDK Construct の開発では、複数のプロパティを持つ Props (interface) を定義することが一般的ですが、開発者がコンストラクタの実装でこれらのプロパティの一部を使用するのを忘れる場合があり、これはデッドコードを引き起こします

(このルールは `Construct` を継承するクラスにのみ適用されます。)

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "cdk/no-unused-props": "error",
    },
  },
]);
```

#### ✅ 正しい例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning: boolean;
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ✅ すべてのpropsプロパティが使用されています
    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning,
    });
  }
}
```

#### ❌ 不正な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning: boolean;
  readonly unusedProp: string; // ❌ このプロパティは使用されていません
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning,
    });
  }
}
```
