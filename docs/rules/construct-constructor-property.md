---
title: eslint-cdk-plugin - construct-constructor-property
titleTemplate: ":title"
---

# construct-constructor-property

<div class="info-item">
  ✅ Using
  <a href="/rules/#recommended-rules">recommended</a>
  in an ESLint configuration enables this rule.
</div>

This rule enforces that constructors of classes extending `Construct` have the property names `scope, id` or `scope, id, props`.

All Construct constructors should have a consistent property naming pattern to maintain uniformity across the codebase.

Note: Additional parameters after the first three are allowed as long as the first three follow the pattern.

---

#### 🔧 How to use

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

#### ✅ Correct Examples

```ts
import { Construct } from "constructs";

// ✅ Constructor with "scope, id" property names
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

// ✅ Constructor with "scope, id, props" property names
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

// ✅ Constructor with "scope, id, props?" property names (optional props)
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

// ✅ Constructor with additional parameters after "scope, id, props"
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

#### ❌ Incorrect Examples

```ts
import { Construct } from "constructs";

// ❌ First parameter is not named "scope"
export class MyConstruct extends Construct {
  constructor(myScope: Construct, id: string) {
    super(myScope, id);
  }
}
```

```ts
import { Construct } from "constructs";

// ❌ Second parameter is not named "id"
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

// ❌ Third parameter is not named "props"
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, myProps: MyConstructProps) {
    super(scope, id);
  }
}
```
