import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { SignatureKind } from "corsa-oxlint";

import { createTypeQueryMemo } from "../memo/type-query-memo";

const memoizePropertyNames = createTypeQueryMemo<string[]>();

/**
 * Parses type to get the property names of the class constructor.
 * @returns The property names of the class constructor.
 */
export const findConstructorPropertyNames = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): string[] => {
  if (!type) return [];

  // NOTE: Resolving a construct signature is one of the most expensive corsa queries, and the
  // construct id rules ask for it once per `new` expression even though a file instantiates only a
  // handful of distinct classes.
  return memoizePropertyNames(checker, type.id, () => resolvePropertyNames(type, checker));
};

const resolvePropertyNames = (type: CorsaType, checker: CorsaTypeCheckerShape): string[] => {
  const signature = checker.getSignaturesOfType(type, SignatureKind.Construct)[0];
  if (!signature?.parameterSymbols) return [];

  return signature.parameterSymbols.map((symbol) => symbol.name);
};
