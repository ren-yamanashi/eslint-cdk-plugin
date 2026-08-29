import type { CorsaTypeCheckerShape, ESTree, ParserServices } from "corsa-oxlint";

import { AST_NODE_TYPES, SignatureKind } from "corsa-oxlint";

/**
 * Find the type of a member access receiver.
 *
 * NOTE: both checks below are mitigations for receiver shapes the pinned corsa-oxlint
 * mis-resolves, not permanent behaviour. They are meant to be removed once the pinned version
 * resolves those receivers, at which point the rule can resolve every receiver directly.
 *
 * `parserServices.getTypeAtLocation()` can resolve a computed member expression to the type of the
 * object it indexes rather than to the indexed member, and it resolves a call to an overloaded
 * callee to the return type of the *last* declared overload whatever the arguments are. Such
 * receivers are reported as unresolvable instead of resolved to the wrong type; every other
 * expression is resolved directly.
 * @param node - The receiver expression to resolve
 * @param parserServices - The corsa-oxlint parser services
 * @param checker - The corsa-oxlint type checker
 * @returns The receiver type, or undefined when it cannot be resolved
 */
export const findReceiverType = (
  node: ESTree.Node,
  parserServices: ParserServices,
  checker: CorsaTypeCheckerShape,
) => {
  if (isMisresolvedComputedMember(node, parserServices)) return undefined;
  if (node.type !== AST_NODE_TYPES.CallExpression) return parserServices.getTypeAtLocation(node);

  // NOTE: a call through a mis-resolved computed member inherits the same wrong type.
  if (isMisresolvedComputedMember(node.callee, parserServices)) return undefined;
  if (!hasUnambiguousReturnType(node.callee, parserServices, checker)) return undefined;

  return parserServices.getTypeAtLocation(node);
};

/**
 * Check whether a computed member expression resolves to the type of the object it indexes, which
 * is the symptom of the mis-resolution rather than the shape of the syntax. Testing the symptom
 * keeps the receivers the runtime resolves correctly (an array or tuple element under a literal
 * index, a `Record` value) usable as the runtime improves, and skips only the ones it still gets
 * wrong.
 *
 * NOTE: the two types are compared by their `id`, which is type identity. Repeated
 * `getTypeAtLocation()` calls hand back distinct objects, so reference equality never holds, and
 * `typeToString` would collide for distinct types that print the same name.
 */
const isMisresolvedComputedMember = (
  node: ESTree.Node,
  parserServices: ParserServices,
): boolean => {
  if (node.type !== AST_NODE_TYPES.MemberExpression || !node.computed) return false;

  const memberType = parserServices.getTypeAtLocation(node);
  const objectType = parserServices.getTypeAtLocation(node.object);
  if (!memberType || !objectType) return true;

  return memberType.id === objectType.id;
};

/**
 * Check whether every call signature of a callee returns the same type.
 * This rule does not resolve which overload a call selects, so an overload set whose signatures
 * disagree on the return type is treated as unresolvable rather than guessed at.
 */
const hasUnambiguousReturnType = (
  calleeNode: ESTree.Node,
  parserServices: ParserServices,
  checker: CorsaTypeCheckerShape,
): boolean => {
  const calleeType = parserServices.getTypeAtLocation(calleeNode);
  if (!calleeType) return true;

  const signatures = checker.getSignaturesOfType(calleeType, SignatureKind.Call);
  if (signatures.length < 2) return true;

  const returnTypeIds = signatures.map((signature) => {
    return checker.getReturnTypeOfSignature(signature)?.id;
  });
  return returnTypeIds.every((id) => id !== undefined && id === returnTypeIds[0]);
};
