---
title: eslint-cdk-plugin - no-unused-props
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../components/NotRecommendedItem.vue'
import NextRecommendedItem from '../components/NextRecommendedItem.vue'
</script>

# no-unused-props

<NotRecommendedItem />
<NextRecommendedItem version="v4.0.0" />

This rule enforces that all properties defined in CDK Construct props interfaces are actually used within the constructor.

When developing CDK Constructs, it's common to define props interfaces with multiple properties, but developers may forget to use some of these properties in the constructor implementation. This leads to dead code.

(This rule applies only to classes that extend `Construct`.)

---

#### 🔧 How to use

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

#### ✅ Correct Example

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

    // ✅ All props properties are used
    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning,
    });
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning: boolean;
  readonly unusedProp: string; // ❌ This property is never used
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
