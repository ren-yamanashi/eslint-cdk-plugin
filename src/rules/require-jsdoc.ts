import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  ESLintUtils,
} from "@typescript-eslint/utils";

import { isConstructType } from "../utils/typeCheck";

/**
 * Require JSDoc comments for interface properties and public properties in Construct classes
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 * @see {@link https://eslint-cdk-plugin.dev/rules/require-jsdoc} - Documentation
 */
export const requireJSDoc = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description:
        "Require JSDoc comments for interface properties and public properties in Construct classes",
    },
    messages: {
      missingJSDoc:
        "Property '{{ propertyName }}' should have a JSDoc comment.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      TSPropertySignature(node) {
        if (
          node.key.type !== AST_NODE_TYPES.Identifier ||
          node.parent?.type !== AST_NODE_TYPES.TSInterfaceBody
        ) {
          return;
        }

        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsBefore(node);
        const hasJSDoc = comments.some(
          ({ type, value }) =>
            type === AST_TOKEN_TYPES.Block && value.startsWith("*"),
        );

        if (!hasJSDoc) {
          context.report({
            node,
            messageId: "missingJSDoc",
            data: {
              propertyName: node.key.name,
            },
          });
        }
      },
      PropertyDefinition(node) {
        if (
          node.key.type !== AST_NODE_TYPES.Identifier ||
          node.parent.type !== AST_NODE_TYPES.ClassBody
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct
        const classDeclaration = node.parent.parent;
        if (
          classDeclaration.type !== AST_NODE_TYPES.ClassDeclaration ||
          !classDeclaration.superClass
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct and the property is public
        const classType = parserServices.getTypeAtLocation(classDeclaration);
        if (!isConstructType(classType) || node.accessibility !== "public") {
          return;
        }

        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsBefore(node);
        const hasJSDoc = comments.some(
          ({ type, value }) =>
            type === AST_TOKEN_TYPES.Block && value.startsWith("*"),
        );

        if (!hasJSDoc) {
          context.report({
            node,
            messageId: "missingJSDoc",
            data: {
              propertyName: node.key.name,
            },
          });
        }
      },
    };
  },
});
