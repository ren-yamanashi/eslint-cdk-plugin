import {
  ClassDeclaration,
  ConstructorDeclaration,
  Declaration,
  Node,
  Type,
} from "typescript";

import { SYNTAX_KIND } from "../constants/tsInternalFlags";

/**
 * Parses type to get the property names of the class constructor.
 * @returns The property names of the class constructor.
 */
export const getConstructorPropertyNames = (type: Type): string[] => {
  const declarations = type.symbol?.declarations;
  if (!declarations?.length) return [];

  const classDeclaration = declarations[0];
  if (!isClassDeclaration(classDeclaration)) return [];

  const constructor = classDeclaration.members.find((member) =>
    isConstructorDeclaration(member),
  );
  if (!constructor?.parameters.length) return [];

  return constructor.parameters.map((param) => param.name.getText());
};

/**
 * Implementing `isClassDeclaration` defined in typescript on your own, in order not to include TypeScript in dependencies
 */
const isClassDeclaration = (
  declaration: Declaration,
): declaration is ClassDeclaration => {
  // NOTE: In order not to make it dependent on the typescript library, it defines its own unions.
  //       Therefore, the type information structures do not match.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  return declaration.kind === SYNTAX_KIND.CLASS_DECLARATION;
};

/**
 * Implementing `isConstructorDeclaration` defined in typescript on your own, in order not to include TypeScript in dependencies
 */
const isConstructorDeclaration = (
  node: Node,
): node is ConstructorDeclaration => {
  // NOTE: In order not to make it dependent on the typescript library, it defines its own unions.
  //       Therefore, the type information structures do not match.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  return node.kind === SYNTAX_KIND.CONSTRUCTOR;
};
