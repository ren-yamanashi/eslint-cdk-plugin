---
title: eslint-cdk-plugin - props-name-convention
titleTemplate: ":title"
---

# props-name-convention

Forces the Props(interface) name of the Construct class to follow the form `${ConstructName}Props`.  
Where `${ConstructName}` is the name of the Construct class.

Following a consistent naming pattern clarifies the relationship between Construct and its Props(interface), improving code maintainability and ease of understanding.

#### ✅ Correct Examples

```ts
// ✅ Props(interface) name follows the format of `${ConstructName}Props`
interface MyConstructProps {
  readonly bucket?: IBucket;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);
  }
}
```

```ts
// ✅ This rule does not apply to interfaces that are not Construct classes
interface Props {
  readonly bucket?: string;
}

class NotConstruct {
  constructor(props: Props) {}
}
```

#### ❌ Incorrect Examples

```ts
interface Props {
  // ❌ Props interface name must follow ${ConstructName}Props format
  readonly bucket?: string;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
  }
}
```