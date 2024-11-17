import { RuleTester } from "@typescript-eslint/rule-tester";

import { noParentNameChildIdMatch } from "../no-parent-name-child-id-match.mjs";

// const ruleTester = new RuleTester({
//   languageOptions: { ecmaVersion: "latest", sourceType: "module" },
// });

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("no-parent-name-child-id-match", noParentNameChildIdMatch, {
  valid: [
    // WHEN: child id not same parent construct name
    {
      code: `
      class TestClass {
        constructor() {
          const test = new TestClass("test", "validId");
        }
      }`,
    },
    // WHEN: construct does not have child
    {
      code: `
      class TestClass {
        constructor() {}
      }`,
    },
  ],
  // WHEN: child id same parent construct name
  invalid: [
    // WHEN: child class inside constructor
    {
      code: `
      class TestClass {
        constructor() {
          const test = new Sample("test", "TestClass");
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
    // WHEN: child statement inside if statement inside constructor (expression statement)
    {
      code: `
      class TestClass {
        constructor() {
          if (true) new Sample("test", "TestClass");
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
    // WHEN: child statement inside if statement inside constructor (block statement)
    {
      code: `
      class TestClass {
        constructor() {
          if (true) {
            const test = new Sample("test", "TestClass");
          }
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
    // WHEN: child statement inside if statement inside inside constructor (block statement / nested)
    {
      code: `
      class TestClass {
        constructor() {
          if (true) {
            if (true) {
              const test = new Sample("test", "TestClass");
            }
          }
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
    // WHEN: child statement inside switch statement inside inside constructor (expression statement)
    {
      code: `
      class TestClass {
        constructor() {
          switch (item.type) {
            case "test":
              const test = new Sample("test", "TestClass");
              break;
          }
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
    // WHEN: child statement inside switch statement inside inside constructor (block statement)
    {
      code: `
      class TestClass {
        constructor() {
          switch (item.type) {
            case "test": {
              const test = new Sample("test", "TestClass");
              break;
            }
          }
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
    // WHEN: child statement inside switch statement inside inside constructor (block statement / nested)
    {
      code: `
      class TestClass {
        constructor() {
          switch (item.type) {
            case "test": {
              switch (item.type) {
                case "test":
                  const test = new Sample("test", "TestClass");
                  break;
              }
            }
          }
        }
      }`,
      errors: [{ messageId: "noParentNameChildIdMatch" }],
    },
  ],
});
