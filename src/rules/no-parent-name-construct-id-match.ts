import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { toPascalCase } from "../utils/convertString";
import { isConstructOrStackType, isConstructType } from "../utils/typeCheck";

type Context = TSESLint.RuleContext<"noParentNameConstructIdMatch", []>;

type ValidateStatementArgs<T extends TSESTree.Statement> = {
  node: TSESTree.ClassBody;
  statement: T;
  parentClassName: string;
  context: Context;
  parserServices: ParserServicesWithTypeInformation;
};

type ValidateExpressionArgs<T extends TSESTree.Expression> = {
  node: TSESTree.ClassBody;
  expression: T;
  parentClassName: string;
  context: Context;
  parserServices: ParserServicesWithTypeInformation;
};

/**
 * Enforce that construct IDs does not match the parent construct name.
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 * @see {@link https://eslint-cdk-plugin.dev/rules/no-parent-name-construct-id-match} - Documentation
 */
export const noParentNameConstructIdMatch = ESLintUtils.RuleCreator.withoutDocs(
  {
    meta: {
      type: "problem",
      docs: {
        description:
          "Enforce that construct IDs does not match the parent construct name.",
      },
      messages: {
        noParentNameConstructIdMatch:
          "Construct ID '{{ constructId }}' should not match parent construct name '{{ parentConstructName }}'. Use a more specific identifier.",
      },
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      const parserServices = ESLintUtils.getParserServices(context);
      return {
        ClassBody(node) {
          const type = parserServices.getTypeAtLocation(node);

          if (!isConstructOrStackType(type)) return;

          const parent = node.parent;
          if (parent?.type !== AST_NODE_TYPES.ClassDeclaration) return;

          const parentClassName = parent.id?.name;
          if (!parentClassName) return;

          for (const body of node.body) {
            // NOTE: Ignore if neither method nor constructor.
            if (
              body.type !== AST_NODE_TYPES.MethodDefinition ||
              !["method", "constructor"].includes(body.kind) ||
              body.value.type !== AST_NODE_TYPES.FunctionExpression
            ) {
              continue;
            }
            validateConstructorBody({
              node,
              expression: body.value,
              parentClassName,
              context,
              parserServices,
            });
          }
        },
      };
    },
  }
);

/**
 * Validate the constructor body for the parent class
 * - validate each statement in the constructor body
 */
const validateConstructorBody = ({
  node,
  expression,
  parentClassName,
  context,
  parserServices,
}: ValidateExpressionArgs<TSESTree.FunctionExpression>): void => {
  for (const statement of expression.body.body) {
    switch (statement.type) {
      case AST_NODE_TYPES.VariableDeclaration: {
        const newExpression = statement.declarations[0].init;
        if (newExpression?.type !== AST_NODE_TYPES.NewExpression) continue;
        validateConstructId({
          node,
          context,
          expression: newExpression,
          parentClassName,
          parserServices,
        });
        break;
      }
      case AST_NODE_TYPES.ExpressionStatement: {
        if (statement.expression?.type !== AST_NODE_TYPES.NewExpression) break;
        validateStatement({
          node,
          statement,
          parentClassName,
          context,
          parserServices,
        });
        break;
      }
      case AST_NODE_TYPES.IfStatement: {
        traverseStatements({
          node,
          context,
          parentClassName,
          statement: statement.consequent,
          parserServices,
        });
        break;
      }
      case AST_NODE_TYPES.SwitchStatement: {
        for (const switchCase of statement.cases) {
          for (const statement of switchCase.consequent) {
            traverseStatements({
              node,
              context,
              parentClassName,
              statement,
              parserServices,
            });
          }
        }
        break;
      }
    }
  }
};

/**
 * Recursively traverse and validate statements in the AST
 * - Handles BlockStatement, ExpressionStatement, and VariableDeclaration
 * - Validates construct IDs against parent class name
 */
const traverseStatements = ({
  node,
  statement,
  parentClassName,
  context,
  parserServices,
}: ValidateStatementArgs<TSESTree.Statement>) => {
  switch (statement.type) {
    case AST_NODE_TYPES.BlockStatement: {
      for (const body of statement.body) {
        validateStatement({
          node,
          statement: body,
          parentClassName,
          context,
          parserServices,
        });
      }
      break;
    }
    case AST_NODE_TYPES.ExpressionStatement: {
      const newExpression = statement.expression;
      if (newExpression?.type !== AST_NODE_TYPES.NewExpression) break;
      validateStatement({
        node,
        statement,
        parentClassName,
        context,
        parserServices,
      });
      break;
    }
    case AST_NODE_TYPES.VariableDeclaration: {
      const newExpression = statement.declarations[0].init;
      if (newExpression?.type !== AST_NODE_TYPES.NewExpression) break;
      validateConstructId({
        node,
        context,
        expression: newExpression,
        parentClassName,
        parserServices,
      });
      break;
    }
  }
};

/**
 * Validate a single statement in the AST
 * - Handles different types of statements (Variable, Expression, If, Switch)
 * - Extracts and validates construct IDs from new expressions
 */
const validateStatement = ({
  node,
  statement,
  parentClassName,
  context,
  parserServices,
}: ValidateStatementArgs<TSESTree.Statement>): void => {
  switch (statement.type) {
    case AST_NODE_TYPES.VariableDeclaration: {
      const newExpression = statement.declarations[0].init;
      if (newExpression?.type !== AST_NODE_TYPES.NewExpression) break;
      validateConstructId({
        node,
        context,
        expression: newExpression,
        parentClassName,
        parserServices,
      });
      break;
    }
    case AST_NODE_TYPES.ExpressionStatement: {
      const newExpression = statement.expression;
      if (newExpression?.type !== AST_NODE_TYPES.NewExpression) break;
      validateConstructId({
        node,
        context,
        expression: newExpression,
        parentClassName,
        parserServices,
      });
      break;
    }
    case AST_NODE_TYPES.IfStatement: {
      validateIfStatement({
        node,
        statement,
        parentClassName,
        context,
        parserServices,
      });
      break;
    }
    case AST_NODE_TYPES.SwitchStatement: {
      validateSwitchStatement({
        node,
        statement,
        parentClassName,
        context,
        parserServices,
      });
      break;
    }
  }
};

/**
 * Validate the `if` statement
 * - Validate recursively if `if` statements are nested
 */
const validateIfStatement = ({
  node,
  statement,
  parentClassName,
  context,
  parserServices,
}: ValidateStatementArgs<TSESTree.IfStatement>): void => {
  traverseStatements({
    node,
    context,
    parentClassName,
    statement: statement.consequent,
    parserServices,
  });
};

/**
 * Validate the `switch` statement
 * - Validate recursively if `switch` statements are nested
 */
const validateSwitchStatement = ({
  node,
  statement,
  parentClassName,
  context,
  parserServices,
}: ValidateStatementArgs<TSESTree.SwitchStatement>): void => {
  for (const caseStatement of statement.cases) {
    for (const _consequent of caseStatement.consequent) {
      traverseStatements({
        node,
        context,
        parentClassName,
        statement: _consequent,
        parserServices,
      });
    }
  }
};

/**
 * Validate that parent construct name and child id do not match
 */
const validateConstructId = ({
  node,
  context,
  expression,
  parentClassName,
  parserServices,
}: ValidateExpressionArgs<TSESTree.NewExpression>): void => {
  const type = parserServices.getTypeAtLocation(expression);

  if (expression.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = expression.arguments[1];
  if (
    secondArg.type !== AST_NODE_TYPES.Literal ||
    typeof secondArg.value !== "string"
  ) {
    return;
  }

  const formattedConstructId = toPascalCase(secondArg.value);
  const formattedParentClassName = toPascalCase(parentClassName);

  if (!isConstructType(type)) return;

  if (formattedConstructId.includes(formattedParentClassName)) {
    context.report({
      node,
      messageId: "noParentNameConstructIdMatch",
      data: {
        constructId: secondArg.value,
        parentConstructName: parentClassName,
      },
    });
  }
};
