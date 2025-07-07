import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
} from "@typescript-eslint/utils";

import { createRule } from "../utils/createRule";
import { getConstructorPropertyNames } from "../utils/getPropertyNames";
import { isConstructType } from "../utils/typeCheck";

type Options = [
  {
    allowNonThisAndDisallowScope?: boolean;
  }
];

type Context = TSESLint.RuleContext<"missingPassingThis", Options>;

/**
 * Enforces that `this` is passed to the constructor
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const requirePassingThis = createRule({
  name: "require-passing-this",
  meta: {
    type: "problem",
    docs: {
      description: "Require passing `this` in a constructor.",
    },
    messages: {
      missingPassingThis: "Require passing `this` in a constructor.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowNonThisAndDisallowScope: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: "code",
  },
  defaultOptions: [
    {
      allowNonThisAndDisallowScope: false,
    },
  ],
  create(context: Context) {
    const options = context.options[0] || {
      allowNonThisAndDisallowScope: false,
    };
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      NewExpression(node) {
        const type = parserServices.getTypeAtLocation(node);

        if (!isConstructType(type) || !node.arguments.length) return;

        const argument = node.arguments[0];

        // NOTE: If the first argument is already `this`, it's valid
        if (argument.type === AST_NODE_TYPES.ThisExpression) return;

        // NOTE: If the first argument is not `scope`, it's valid
        const constructorPropertyNames = getConstructorPropertyNames(type);
        if (constructorPropertyNames[0] !== "scope") return;

        // NOTE: If `allowNonThisAndDisallowScope` is false, require `this` for all cases
        if (!options.allowNonThisAndDisallowScope) {
          context.report({
            node: argument,
            messageId: "missingPassingThis",
            fix: (fixer) => {
              return fixer.replaceText(argument, "this");
            },
          });
          return;
        }
        // NOTE: If `allowNonThisAndDisallowScope` is true, allow non-`this` values except `scope` variable
        // Check if the argument is the `scope` variable
        if (
          argument.type === AST_NODE_TYPES.Identifier &&
          argument.name === "scope"
        ) {
          context.report({
            node: argument,
            messageId: "missingPassingThis",
            fix: (fixer) => {
              return fixer.replaceText(argument, "this");
            },
          });
        }
      },
    };
  },
});
