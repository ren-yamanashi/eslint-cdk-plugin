import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { SYMBOL_FLAGS } from "../constants/tsInternalFlags";
import { isConstructOrStackType } from "../utils/typeCheck";

type Context = TSESLint.RuleContext<"noPublicClassFields", []>;

/**
 * Disallow class types in public class fields
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 * @see {@link https://eslint-cdk-plugin.dev/rules/no-public-class-fields} - Documentation
 */
export const noPublicClassFields = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow class types in public class fields",
    },
    messages: {
      noPublicClassFields:
        "Public field '{{ propertyName }}' should not use class type '{{ typeName }}'. Consider using an interface or type alias instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      ClassDeclaration(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type)) return;

        // NOTE: Check class members
        validateClassMember(node, context, parserServices);

        // NOTE: Check constructor parameter properties
        const constructor = node.body.body.find(
          (member): member is TSESTree.MethodDefinition =>
            member.type === AST_NODE_TYPES.MethodDefinition &&
            member.kind === "constructor",
        );
        if (
          !constructor ||
          constructor.value.type !== AST_NODE_TYPES.FunctionExpression
        ) {
          return;
        }

        validateConstructorParameterProperty(
          constructor,
          context,
          parserServices,
        );
      },
    };
  },
});

/**
 * check the public variable of the class
 * - if it is a class type, report an error
 */
const validateClassMember = (
  node: TSESTree.ClassDeclaration,
  context: Context,
  parserServices: ParserServicesWithTypeInformation,
) => {
  for (const member of node.body.body) {
    if (
      member.type !== AST_NODE_TYPES.PropertyDefinition ||
      member.key.type !== AST_NODE_TYPES.Identifier
    ) {
      continue;
    }

    // NOTE: Skip private and protected fields
    if (["private", "protected"].includes(member.accessibility ?? "")) {
      continue;
    }

    // NOTE: Skip fields without type annotation
    if (!member.typeAnnotation) continue;

    const type = parserServices.getTypeAtLocation(member);
    if (!type.symbol) continue;

    // NOTE: In order not to make it dependent on the typescript library, it defines its own unions.
    //       Therefore, the type information structures do not match.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isClass = type.symbol.flags === SYMBOL_FLAGS.CLASS;
    if (!isClass) continue;

    context.report({
      node: member,
      messageId: "noPublicClassFields",
      data: {
        propertyName: member.key.name,
        typeName: type.symbol.name,
      },
    });
  }
};

/**
 * check the constructor parameter property
 * - if it is a class type, report an error
 */
const validateConstructorParameterProperty = (
  constructor: TSESTree.MethodDefinition,
  context: Context,
  parserServices: ParserServicesWithTypeInformation,
) => {
  for (const param of constructor.value.params) {
    if (
      param.type !== AST_NODE_TYPES.TSParameterProperty ||
      param.parameter.type !== AST_NODE_TYPES.Identifier
    ) {
      continue;
    }

    // NOTE: Skip private and protected parameters
    if (["private", "protected"].includes(param.accessibility ?? "")) {
      continue;
    }

    // NOTE: Skip parameters without type annotation
    if (!param.parameter.typeAnnotation) continue;

    const type = parserServices.getTypeAtLocation(param);
    if (!type.symbol) continue;

    // NOTE: In order not to make it dependent on the typescript library, it defines its own unions.
    //       Therefore, the type information structures do not match.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isClass = type.symbol.flags === SYMBOL_FLAGS.CLASS;
    if (!isClass) continue;

    context.report({
      node: param,
      messageId: "noPublicClassFields",
      data: {
        propertyName: param.parameter.name,
        typeName: type.symbol.name,
      },
    });
  }
};
