import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { isConstructType } from "../utils/typeCheck";

type Context = TSESLint.RuleContext<"invalidConstructorProperty", []>;

/**
 * Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 * @see {@link https://eslint-cdk-plugin.dev/rules/construct-constructor-property} - Documentation
 */
export const constructConstructorProperty = ESLintUtils.RuleCreator.withoutDocs(
  {
    meta: {
      type: "problem",
      docs: {
        description:
          "Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'",
      },
      messages: {
        invalidConstructorProperty:
          "Constructor of a class extending Construct must have the property names 'scope, id' or 'scope, id, props'",
      },
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      const parserServices = ESLintUtils.getParserServices(context);

      return {
        ClassDeclaration(node) {
          const type = parserServices.getTypeAtLocation(node);
          if (!isConstructType(type)) return;

          // NOTE: Find the constructor method
          const constructor = node.body.body.find(
            (member): member is TSESTree.MethodDefinition =>
              member.type === AST_NODE_TYPES.MethodDefinition &&
              member.kind === "constructor",
          );

          // NOTE: Skip if there's no constructor
          if (!constructor) return;

          validateConstructorProperty(constructor, context);
        },
      };
    },
  },
);

/**
 * Validates that the constructor has the property names "scope, id" or "scope, id, props"
 */
const validateConstructorProperty = (
  constructor: TSESTree.MethodDefinition,
  context: Context,
): void => {
  const params = constructor.value.params;

  // NOTE: Check if the constructor has at least 2 parameters
  if (params.length < 2) {
    context.report({
      node: constructor,
      messageId: "invalidConstructorProperty",
    });
    return;
  }

  // NOTE: Check if the first parameter is named "scope"
  const firstParam = params[0];
  if (
    firstParam.type === AST_NODE_TYPES.Identifier &&
    firstParam.name !== "scope"
  ) {
    context.report({
      node: constructor,
      messageId: "invalidConstructorProperty",
    });
    return;
  }

  // NOTE: Check if the second parameter is named "id"
  const secondParam = params[1];
  if (
    secondParam.type === AST_NODE_TYPES.Identifier &&
    secondParam.name !== "id"
  ) {
    context.report({
      node: constructor,
      messageId: "invalidConstructorProperty",
    });
    return;
  }

  // NOTE: If there's no third parameter, return
  if (params.length < 3) return;

  // NOTE: Check if the third parameter is named "props"
  const thirdParam = params[2];
  if (
    thirdParam.type === AST_NODE_TYPES.Identifier &&
    thirdParam.name !== "props"
  ) {
    context.report({
      node: constructor,
      messageId: "invalidConstructorProperty",
    });
    return;
  }
};
