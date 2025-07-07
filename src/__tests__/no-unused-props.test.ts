import { RuleTester } from "@typescript-eslint/rule-tester";
import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

import { noUnusedProps } from "../rules/no-unused-props";

const typedRule = noUnusedProps as ESLintUtils.RuleModule<
  "unusedProp",
  [],
  {
    ClassDeclaration(node: TSESTree.ClassDeclaration): void;
  }
>;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("no-unused-props", typedRule, {
  valid: [
    // WHEN: All properties are used directly
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning
          });
        }
      }
      `,
    },
    // WHEN: Properties are used via destructuring
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName, enableVersioning } = props;
          new Bucket(this, "MyBucket", {
            bucketName,
            versioned: enableVersioning
          });
        }
      }
      `,
    },
    // WHEN: Props is assigned to private variable and all properties are used
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        private props: MyConstructProps;
        
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.props = props;
          
          new Bucket(this, "MyBucket", {
            bucketName: this.props.bucketName,
            versioned: this.props.enableVersioning
          });
        }
      }
      `,
    },
    // WHEN: Individual properties are assigned to instance variables
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        private bucketName: string;
        private enableVersioning: boolean;
        
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.bucketName = props.bucketName;
          this.enableVersioning = props.enableVersioning;
          
          new Bucket(this, "MyBucket", {
            bucketName: this.bucketName,
            versioned: this.enableVersioning
          });
        }
      }
      `,
    },
    // WHEN: Optional properties are used conditionally
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning?: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning || false
          });
        }
      }
      `,
    },
    // WHEN: Constructor has no props parameter
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new Bucket(this, "MyBucket");
        }
      }
      `,
    },
    // WHEN: Class does not extend Construct
    {
      code: `
      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyClass {
        constructor(props: MyConstructProps) {
          // This should not be checked as it's not a Construct
        }
      }
      `,
    },
    // WHEN: Props is used in nested object access
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        config: {
          bucketName: string;
          enableVersioning: boolean;
        };
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props.config.bucketName,
            versioned: props.config.enableVersioning
          });
        }
      }
      `,
    },
    // WHEN: Properties are used via destructuring with aliases
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName: bn, enableVersioning: ev } = props;
          new Bucket(this, "MyBucket", {
            bucketName: bn,
            versioned: ev
          });
        }
      }
      `,
    },
    // WHEN: Inline destructuring in constructor parameters (all properties used)
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, { bucketName, enableVersioning }: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName,
            versioned: enableVersioning
          });
        }
      }
      `,
    },
    // WHEN: Properties are used via optional chaining
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName?: string;
        enableVersioning?: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props?.bucketName || "default",
            versioned: props?.enableVersioning || false
          });
        }
      }
      `,
    },
  ],
  invalid: [
    // WHEN: Some properties are unused
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    // WHEN: All properties are unused but props parameter exists
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: "hardcoded-name",
            versioned: true
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }, { messageId: "unusedProp" }],
    },
    // WHEN: Props parameter is not referenced at all
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket");
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }, { messageId: "unusedProp" }],
    },
    // WHEN: Only some properties are used via destructuring
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName, enableVersioning } = props;
          new Bucket(this, "MyBucket", {
            bucketName,
            versioned: enableVersioning
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    // WHEN: Props is accessed but not all properties are used
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          console.log(props); // props is referenced but properties not used
          new Bucket(this, "MyBucket");
        }
      }
      `,
      errors: [
        { messageId: "unusedProp" },
        { messageId: "unusedProp" },
        { messageId: "unusedProp" },
      ],
    },
    // WHEN: Props is assigned to private variable but some properties are unused
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }
      
      export class MyConstruct extends Construct {
        private props: MyConstructProps;
        
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.props = props;
          
          new Bucket(this, "MyBucket", {
            bucketName: this.props.bucketName,
            versioned: this.props.enableVersioning
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    // WHEN: Alias destructuring with some properties unused
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName: bn, enableVersioning: ev } = props;
          new Bucket(this, "MyBucket", {
            bucketName: bn,
            versioned: ev
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    // WHEN: Inline destructuring with some properties unused
    {
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: { bucketName: string; versioned: boolean }) {
          super(scope, id);
          console.log(props.bucketName, props.versioned);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }
      
      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, { bucketName, enableVersioning }: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName,
            versioned: enableVersioning
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
  ],
});
