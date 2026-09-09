import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { Node, Type, TypeChecker } from "typescript";

import { isConstructTypeIgnoringSubclasses } from "../core/cdk-construct/type-checker/is-construct";
import { findNonNullableType } from "../core/ts-type/finder/non-nullable-type";
import { createRule } from "../shared/create-rule";

export const preferGrantsProperty = createRule({
  name: "prefer-grants-property",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer using the grants property over grant* methods when available.",
    },
    messages: {
      useGrantsProperty:
        "Use '{{ objectName }}.grants.{{ methodName }}()' instead of '{{ objectName }}.{{ grantMethod }}()'.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          node.callee.property.type !== AST_NODE_TYPES.Identifier
        ) {
          return;
        }

        const methodName = node.callee.property.name;
        if (!methodName.startsWith("grant")) return;

        const convertedMethodName = methodName
          .replace(/^grant/, "")
          .replace(/^./, (c) => c.toLowerCase());

        const objectNode = node.callee.object;
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(objectNode);
        const type = checker.getTypeAtLocation(tsNode);
        if (!hasGrantsMethod(type, tsNode, convertedMethodName, checker)) return;

        const objectName =
          objectNode.type === AST_NODE_TYPES.Identifier ? objectNode.name : "object";

        context.report({
          node: node.callee.property,
          messageId: "useGrantsProperty",
          data: {
            objectName,
            methodName: convertedMethodName,
            grantMethod: methodName,
          },
        });
      },
    };
  },
});

/**
 * Check whether a Construct type exposes the given method on its grants property
 * @param type - The type of the call receiver
 * @param location - The node the receiver type was resolved from
 * @param methodName - The grants method name the grant* call maps to
 * @param checker - The TypeScript type checker
 * @returns True if `type.grants.<methodName>()` is available, otherwise false
 */
const hasGrantsMethod = (
  type: Type,
  location: Node,
  methodName: string,
  checker: TypeChecker,
): boolean => {
  // NOTE: An optional receiver such as `props.topic?.grantPublish()` is typed
  // `Topic | undefined`, so strip the nullish members before inspecting the Construct.
  const receiverType = findNonNullableType(type, checker);
  if (!isConstructTypeIgnoringSubclasses(receiverType)) return false;

  const grantsProperty = receiverType.getProperty("grants");
  if (!grantsProperty) return false;

  const grantsType = checker.getTypeOfSymbolAtLocation(grantsProperty, location);
  const grantsTypeName = grantsType.symbol?.name;
  if (!grantsTypeName?.endsWith("Grants")) return false;

  return !!grantsType.getProperty(methodName);
};
