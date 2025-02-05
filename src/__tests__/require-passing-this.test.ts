import { RuleTester } from "@typescript-eslint/rule-tester";

import { requirePassingThis } from "../rules/require-passing-this";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("require-passing-this", requirePassingThis, {
  valid: [
    // WHEN: passing `this` to a constructor
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(this, "ValidId");
        }
      }
      `,
    },
    // WHEN: instantiated class does not extend Construct
    {
      code: `
      class Construct {}
      class SampleClass {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
    },
    // WHEN: property name is not `scope`
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(validProperty: Construct, id: string) {
          super(validProperty, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
    },
  ],
  invalid: [
    // WHEN: not passing `this` to a constructor
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
      errors: [{ messageId: "requirePassingThis" }],
      output: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(this, "ValidId");
        }
      }
      `,
    },
  ],
});
