import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { createRule } from "../utils/createRule";
import { getConstructor } from "../utils/getConstructor";
import {
  IPropsUsageTracker,
  propsUsageTrackerFactory,
} from "../utils/propsUsageTracker";
import { isConstructType } from "../utils/typeCheck";

type Context = TSESLint.RuleContext<"unusedProp", []>;

/**
 * Enforces that all properties defined in props type are used within the constructor
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noUnusedProps = createRule({
  name: "no-unused-props",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforces that all properties defined in props type are used within the constructor",
    },
    messages: {
      unusedProp: "Property '{{propName}}' is defined in props but never used",
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

        analyzePropsUsage(constructor, context, parserServices);
      },
    };
  },
});

/**
 * Analyzes props usage in the constructor
 */
const analyzePropsUsage = (
  constructor: TSESTree.MethodDefinition,
  context: Context,
  parserServices: ParserServicesWithTypeInformation
): void => {
  const params = constructor.value.params;

  // NOTE: Check if constructor has props parameter (3rd parameter)
  if (params.length < 3) return;

  const propsParam = params[2];

  switch (propsParam.type) {
    case AST_NODE_TYPES.Identifier: {
      // NOTE: Standard props parameter (e.g. props: MyConstructProps)
      const propsType = parserServices.getTypeAtLocation(propsParam);
      const tracker = propsUsageTrackerFactory(propsType);
      if (!tracker || !constructor.value.body) return;

      analyzeConstructorBody(constructor.value.body, propsParam.name, tracker);
      reportUnusedProperties(tracker, propsParam, context);
      return;
    }
    case AST_NODE_TYPES.ObjectPattern: {
      // NOTE: Inline destructuring (e.g. { bucketName, enableVersioning }: MyConstructProps)
      const typeAnnotation = propsParam.typeAnnotation?.typeAnnotation;
      if (!typeAnnotation) return;

      const propsType = parserServices.getTypeAtLocation(typeAnnotation);
      const tracker = propsUsageTrackerFactory(propsType);
      if (!tracker) return;

      tracker.markAsUsedForObjectPattern(propsParam);
      reportUnusedProperties(tracker, propsParam, context);
      return;
    }
    default:
      return;
  }
};

/**
 * Analyzes constructor body for props usage patterns
 */
const analyzeConstructorBody = (
  body: TSESTree.BlockStatement,
  propsParamName: string,
  tracker: IPropsUsageTracker
): void => {
  const visited = new Set<TSESTree.Node>();

  const visitNode = (node: TSESTree.Node): void => {
    if (visited.has(node)) return;
    visited.add(node);

    switch (node.type) {
      case AST_NODE_TYPES.MemberExpression:
        tracker.markAsUsedForMemberExpression(node, propsParamName);
        break;
      case AST_NODE_TYPES.VariableDeclarator:
        tracker.markAsUsedForVariableDeclarator(node, propsParamName);
        break;
      case AST_NODE_TYPES.AssignmentExpression:
        tracker.markAsUsedForAssignmentExpression(node, propsParamName);
        break;
    }

    // NOTE: Recursively visit child nodes
    const children = getChildNodes(node);
    for (const child of children) {
      visitNode(child);
    }
  };

  visitNode(body);
};

/**
 * Reports unused properties to ESLint
 */
const reportUnusedProperties = (
  tracker: IPropsUsageTracker,
  propsParam: TSESTree.Parameter,
  context: Context
): void => {
  for (const propName of tracker.getUnusedProperties()) {
    context.report({
      node: propsParam,
      messageId: "unusedProp",
      data: {
        propName,
      },
    });
  }
};

/**
 * Safely gets child nodes from a TSESTree.Node
 */
const getChildNodes = (node: TSESTree.Node): TSESTree.Node[] => {
  return Object.entries(node).reduce<TSESTree.Node[]>((acc, [key, value]) => {
    if (["parent", "range", "loc"].includes(key)) return acc; // Keys to skip to avoid circular references and unnecessary properties
    if (isESTreeNode(value)) return [...acc, value];
    if (Array.isArray(value)) return [...acc, ...value.filter(isESTreeNode)];
    return acc;
  }, []);
};

/**
 * Type guard to check if a value is a TSESTree.Node
 */
const isESTreeNode = (value: unknown): value is TSESTree.Node => {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
};
