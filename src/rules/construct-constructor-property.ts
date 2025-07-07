import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { createRule } from "../utils/createRule";
import { getConstructor } from "../utils/getConstructor";
import { isConstructType } from "../utils/typeCheck";

type Context = TSESLint.RuleContext<
  | "invalidConstructorProperty"
  | "invalidConstructorType"
  | "invalidConstructorIdType",
  []
>;

/**
 * Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const constructConstructorProperty = createRule({
  name: "construct-constructor-property",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'",
    },
    messages: {
      invalidConstructorProperty:
        "Constructor of a class extending Construct must have the property names 'scope, id' or 'scope, id, props'",
      invalidConstructorType:
        "Constructor of a class extending Construct must have the type 'Construct' for the first parameter",
      invalidConstructorIdType:
        "Constructor of a class extending Construct must have the type 'string' for the second parameter",
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

        const constructor = getConstructor(node);
        if (!constructor) return;

        validateConstructorProperty(constructor, context, parserServices);
      },
    };
  },
});

/**
 * Validates that the constructor has the property names "scope, id" or "scope, id, props"
 */
const validateConstructorProperty = (
  constructor: TSESTree.MethodDefinition,
  context: Context,
  parserServices: ParserServicesWithTypeInformation
): void => {
  const params = constructor.value.params;

  // NOTE: Check if the constructor has at least 2 parameters
  if (params.length < 2) {
    context.report({
      node: constructor.value,
      messageId: "invalidConstructorProperty",
    });
    return;
  }

  // NOTE: Check if the first parameter is named "scope"
  const firstParam = params[0];
  if (
    firstParam.type !== AST_NODE_TYPES.Identifier ||
    firstParam.name !== "scope"
  ) {
    context.report({
      node: firstParam,
      messageId: "invalidConstructorProperty",
    });
  } else if (!isConstructType(parserServices.getTypeAtLocation(firstParam))) {
    context.report({
      node: firstParam,
      messageId: "invalidConstructorType",
    });
  }

  // NOTE: Check if the second parameter is named "id"
  const secondParam = params[1];
  if (
    secondParam.type !== AST_NODE_TYPES.Identifier ||
    secondParam.name !== "id"
  ) {
    context.report({
      node: secondParam,
      messageId: "invalidConstructorProperty",
    });
    return;
  } else if (
    secondParam.typeAnnotation?.typeAnnotation.type !==
    AST_NODE_TYPES.TSStringKeyword
  ) {
    context.report({
      node: secondParam,
      messageId: "invalidConstructorIdType",
    });
    return;
  }

  if (params.length < 3)
    // NOTE: If there's no third parameter, return
    return;

  // NOTE: Check if the third parameter is named "props"
  const thirdParam = params[2];
  if (
    thirdParam.type !== AST_NODE_TYPES.Identifier ||
    thirdParam.name !== "props"
  ) {
    context.report({
      node: thirdParam,
      messageId: "invalidConstructorProperty",
    });
    return;
  }
};
