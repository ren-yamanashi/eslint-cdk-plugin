import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { Type } from "typescript";

import { getPropertyNames } from "./getPropertyNames";

export interface IPropsUsageTracker {
  markAsUsedForMemberExpression(
    node: TSESTree.MemberExpression,
    propsParamName: string
  ): void;
  markAsUsedForVariableDeclarator(
    node: TSESTree.VariableDeclarator,
    propsParamName: string
  ): void;
  markAsUsedForAssignmentExpression(
    node: TSESTree.AssignmentExpression,
    propsParamName: string
  ): void;
  markAsUsedForObjectPattern(node: TSESTree.ObjectPattern): void;
  getUnusedProperties(): string[];
}

export const propsUsageTrackerFactory = (
  propsType: Type
): IPropsUsageTracker | null => {
  // ===============================================
  // Internal utility functions
  // ===============================================
  const getPropsPropertyNames = (propsType: Type): string[] => {
    const typeProperties = propsType.getProperties();
    if (typeProperties.length) {
      return typeProperties.reduce<string[]>(
        (acc, prop) =>
          !isInternalProperty(prop.name) ? [...acc, prop.name] : acc,
        []
      );
    }

    const symbol = propsType.getSymbol();
    if (!symbol?.members) return [];

    return Array.from(symbol.members.keys()).reduce<string[]>((acc, key) => {
      const name = String(key);
      return !isInternalProperty(name) ? [...acc, name] : acc;
    }, []);
  };

  const isInternalProperty = (propertyName: string): boolean => {
    return (
      propertyName.startsWith("_") ||
      propertyName === "constructor" ||
      propertyName === "prototype"
    );
  };

  const markAsUsed = (propertyName: string): void => {
    if (propUsages.has(propertyName)) propUsages.set(propertyName, true);
  };

  // ===============================================
  // Internal variables
  // ===============================================
  const propUsages = new Map<string, boolean>(
    getPropsPropertyNames(propsType).map((name) => [name, false])
  );

  // ===============================================
  // Public functions
  // ===============================================
  /**
   * Returns an array of unused property names.
   *
   * @returns An array of unused property names.
   */
  const getUnusedProperties = (): string[] => {
    return Array.from(propUsages.entries()).reduce<string[]>(
      (acc, [name, used]) => (!used ? [...acc, name] : acc),
      []
    );
  };

  /**
   * Marks a property as used when it is accessed in a member expression.
   *
   * @param node The member expression node.
   * @param propsParamName The name of the property being tracked.
   */
  const markAsUsedForMemberExpression = (
    node: TSESTree.MemberExpression,
    propsParamName: string
  ): void => {
    // NOTE: Check for props.propertyName or props?.propertyName pattern
    if (
      node.object.type === AST_NODE_TYPES.Identifier &&
      node.object.name === propsParamName &&
      node.property.type === AST_NODE_TYPES.Identifier
    ) {
      markAsUsed(node.property.name);
      return;
    }

    // NOTE: Check for this.props.propertyName or this.props?.propertyName pattern
    if (
      node.object.type === AST_NODE_TYPES.MemberExpression &&
      node.object.object.type === AST_NODE_TYPES.ThisExpression &&
      node.object.property.type === AST_NODE_TYPES.Identifier &&
      node.object.property.name === "props" &&
      node.property.type === AST_NODE_TYPES.Identifier
    ) {
      markAsUsed(node.property.name);
      return;
    }
  };

  /**
   * Marks a property as used when it is accessed in a member expression.
   *
   * @param node The member expression node.
   * @param propsParamName The name of the property being tracked.
   */
  const markAsUsedForVariableDeclarator = (
    node: TSESTree.VariableDeclarator,
    propsParamName: string
  ): void => {
    // NOTE: Check for destructuring assignment: const { prop1, prop2 } = props
    if (
      node.id.type !== AST_NODE_TYPES.ObjectPattern ||
      node.init?.type !== AST_NODE_TYPES.Identifier ||
      node.init.name !== propsParamName
    ) {
      return;
    }

    const propertyNames = getPropertyNames(node.id.properties);
    for (const name of propertyNames) {
      markAsUsed(name);
    }
  };

  /**
   * Marks a property as used when it is assigned in an expression.
   *
   * @param node The assignment expression node.
   * @param propsParamName The name of the property being tracked.
   */
  const markAsUsedForAssignmentExpression = (
    node: TSESTree.AssignmentExpression,
    propsParamName: string
  ): void => {
    // NOTE: Check for this.property = props.property pattern
    if (
      node.right.type !== AST_NODE_TYPES.MemberExpression ||
      node.right.object.type !== AST_NODE_TYPES.Identifier ||
      node.right.object.name !== propsParamName ||
      node.right.property.type !== AST_NODE_TYPES.Identifier
    ) {
      return;
    }

    markAsUsed(node.right.property.name);

    // NOTE: this.props = props pattern doesn't mark all properties as used
    // because we still need to check which properties are actually accessed later
  };

  /**
   * Marks all properties in an object pattern as used.
   *
   * @param node The object pattern node.
   */
  const markAsUsedForObjectPattern = (node: TSESTree.ObjectPattern): void => {
    for (const propName of getPropertyNames(node.properties)) {
      markAsUsed(propName);
    }
  };

  // ===============================================
  // Return tracker
  // ===============================================
  if (!propUsages.size) return null;
  return {
    getUnusedProperties,
    markAsUsedForMemberExpression,
    markAsUsedForVariableDeclarator,
    markAsUsedForAssignmentExpression,
    markAsUsedForObjectPattern,
  };
};
