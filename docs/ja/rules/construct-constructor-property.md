---
title: eslint-cdk-plugin - construct-constructor-property
titleTemplate: ":title"
---

# construct-constructor-property

<div class="info-item">
  ✅ ESLint設定で
  <a href="/ja/rules/#recommended-rules">recommended</a>
  を使用すると、このルールが有効になります。
</div>

このルールは、`Construct`を継承するクラスのコンストラクタが`scope, id`または`scope, id, props`というプロパティ名を持つことを強制します。

すべての Construct コンストラクタは、コードベース全体で一貫性を維持するために統一されたプロパティ命名パターンを持つべきです。

※最初の 3 つのパラメータがパターンに従っていれば、それ以降の追加パラメータは許可されます

---

#### 🔧 使用方法

```ts
// eslint.config.mjs
export default [
  {
    // ... some configs
    rules: {
      "cdk/construct-constructor-property": "error",
    },
  },
];
```

#### ✅ 正しい例

```ts
import { Construct } from "constructs";

// ✅ "scope, id"のプロパティ名を持つコンストラクタ
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName: string;
}

// ✅ "scope, id, props"のプロパティ名を持つコンストラクタ
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName?: string;
}

// ✅ "scope, id, props?"のプロパティ名を持つコンストラクタ（オプションのprops）
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: MyConstructProps) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName: string;
}

// ✅ "scope, id, props"の後に追加パラメータを持つコンストラクタ
export class MyConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: MyConstructProps,
    resourceName: string,
  ) {
    super(scope, id);
  }
}
```

#### ❌ 誤った例

```ts
import { Construct } from "constructs";

// ❌ 最初のパラメータが"scope"という名前ではない
export class MyConstruct extends Construct {
  constructor(myScope: Construct, id: string) {
    super(myScope, id);
  }
}
```

```ts
import { Construct } from "constructs";

// ❌ 2番目のパラメータが"id"という名前ではない
export class MyConstruct extends Construct {
  constructor(scope: Construct, myId: string) {
    super(scope, myId);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName: string;
}

// ❌ 3番目のパラメータが"props"という名前ではない
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, myProps: MyConstructProps) {
    super(scope, id);
  }
}
```
