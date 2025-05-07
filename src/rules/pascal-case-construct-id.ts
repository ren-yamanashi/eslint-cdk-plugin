import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { toPascalCase } from "../utils/convertString";
import { getConstructorPropertyNames } from "../utils/parseType";
import { isConstructOrStackType } from "../utils/typeCheck";

const QUOTE_TYPE = {
  SINGLE: "'",
  DOUBLE: '"',
} as const;

type QuoteType = (typeof QUOTE_TYPE)[keyof typeof QUOTE_TYPE];

type Context = TSESLint.RuleContext<"pascalCaseConstructId", []>;

/**
/**
 * Enforce PascalCase for Construct ID.
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 * @see {@link https://eslint-cdk-plugin.dev/rules/pascal-case-construct-id} - Documentation
 */
export const pascalCaseConstructId = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Enforce PascalCase for Construct ID.",
    },
    messages: {
      pascalCaseConstructId: "Construct ID must be PascalCase.",
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      NewExpression(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type) || node.arguments.length < 2) {
          return;
        }

        const constructorPropertyNames = getConstructorPropertyNames(type);
        if (constructorPropertyNames[1] !== "id") return;

        validateConstructId(node, context);
      },
    };
  },
});

/**
 * check if the string is PascalCase
 * @param str - The string to check
 * @returns true if the string is PascalCase, false otherwise
 */
const isPascalCase = (str: string) => {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
};

/**
 * Check the construct ID is PascalCase
 */
const validateConstructId = (
  node: TSESTree.NewExpression,
  context: Context,
) => {
  if (node.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  if (
    secondArg.type !== AST_NODE_TYPES.Literal ||
    typeof secondArg.value !== "string"
  ) {
    return;
  }

  const quote: QuoteType = secondArg.raw?.startsWith('"')
    ? QUOTE_TYPE.DOUBLE
    : QUOTE_TYPE.SINGLE;

  if (isPascalCase(secondArg.value)) return;

  context.report({
    node,
    messageId: "pascalCaseConstructId",
    fix: (fixer) => {
      const pascalCaseValue = toPascalCase(secondArg.value);
      return fixer.replaceText(secondArg, `${quote}${pascalCaseValue}${quote}`);
    },
  });
};
