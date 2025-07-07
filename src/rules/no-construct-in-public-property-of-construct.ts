import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { SYMBOL_FLAGS } from "../constants/tsInternalFlags";
import { createRule } from "../utils/createRule";
import { getConstructor } from "../utils/getConstructor";
import { isConstructOrStackType } from "../utils/typeCheck";

type Context = TSESLint.RuleContext<"invalidPublicPropertyOfConstruct", []>;

/**
 * Disallow Construct types in public property of Construct
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noConstructInPublicPropertyOfConstruct = createRule({
  name: "no-construct-in-public-property-of-construct",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Construct types in public property of Construct",
    },
    messages: {
      invalidPublicPropertyOfConstruct:
        "Public property '{{ propertyName }}' of Construct should not use Construct type '{{ typeName }}'. Consider using an interface or type alias instead.",
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
        validatePublicPropertyOfConstruct(node, context, parserServices);

        // NOTE: Check constructor parameter properties
        const constructor = getConstructor(node);
        if (
          !constructor ||
          constructor.value.type !== AST_NODE_TYPES.FunctionExpression
        ) {
          return;
        }

        validateConstructorParameterProperty(
          constructor,
          context,
          parserServices
        );
      },
    };
  },
});

/**
 * check the public property of Construct
 * - if it is a Construct type, report an error
 */
const validatePublicPropertyOfConstruct = (
  node: TSESTree.ClassDeclaration,
  context: Context,
  parserServices: ParserServicesWithTypeInformation
) => {
  for (const property of node.body.body) {
    if (
      property.type !== AST_NODE_TYPES.PropertyDefinition ||
      property.key.type !== AST_NODE_TYPES.Identifier
    ) {
      continue;
    }

    // NOTE: Skip private and protected fields
    if (["private", "protected"].includes(property.accessibility ?? "")) {
      continue;
    }

    // NOTE: Skip fields without type annotation
    if (!property.typeAnnotation) continue;

    const type = parserServices.getTypeAtLocation(property);
    if (!isConstructOrStackType(type)) continue;

    // NOTE: In order not to make it dependent on the typescript library, it defines its own unions.
    //       Therefore, the type information structures do not match.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isClass = type.symbol.flags === SYMBOL_FLAGS.CLASS;
    if (!isClass) continue;

    context.report({
      node: property,
      messageId: "invalidPublicPropertyOfConstruct",
      data: {
        propertyName: property.key.name,
        typeName: type.symbol.name,
      },
    });
  }
};

/**
 * check the constructor parameter property
 * - if it is a Construct type, report an error
 */
const validateConstructorParameterProperty = (
  constructor: TSESTree.MethodDefinition,
  context: Context,
  parserServices: ParserServicesWithTypeInformation
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
    if (!isConstructOrStackType(type)) continue;

    // NOTE: In order not to make it dependent on the typescript library, it defines its own unions.
    //       Therefore, the type information structures do not match.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isClass = type.symbol.flags === SYMBOL_FLAGS.CLASS;
    if (!isClass) continue;

    context.report({
      node: param,
      messageId: "invalidPublicPropertyOfConstruct",
      data: {
        propertyName: param.parameter.name,
        typeName: type.symbol.name,
      },
    });
  }
};
