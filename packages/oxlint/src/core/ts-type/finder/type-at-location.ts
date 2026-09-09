import type { CorsaType, ParserServices } from "corsa-oxlint";

type TypedNode = Parameters<ParserServices["getTypeAtLocation"]>[0];

type ResolvedType = { readonly value: CorsaType | undefined };

const typesByServices = new WeakMap<ParserServices, WeakMap<TypedNode, ResolvedType>>();

/**
 * Resolves the type of an AST node through corsa, reusing the answer when the same node is asked
 * for again through the same parser services.
 *
 * NOTE: a resolution corsa cannot serve from its own per-snapshot caches costs a transport round
 * trip, and rules re-resolve the same node repeatedly (the enclosing class of each `new` expression,
 * for example). The memo is keyed on the parser services, which oxlint builds per `create()` call,
 * so it is scoped to a single rule instance on a single file and never outlives the snapshot the
 * types were resolved from. Keying on the AST node object lets entries disappear together with the
 * parsed file.
 * @param node - The AST node to resolve
 * @param parserServices - The corsa-oxlint parser services
 * @returns The type of the node, or undefined when it cannot be resolved
 */
export const findTypeAtLocation = (
  node: TypedNode,
  parserServices: ParserServices,
): CorsaType | undefined => {
  const types = findTypes(parserServices);
  const resolved = types.get(node);
  if (resolved) return resolved.value;
  const value = parserServices.getTypeAtLocation(node);
  types.set(node, { value });
  return value;
};

const findTypes = (parserServices: ParserServices): WeakMap<TypedNode, ResolvedType> => {
  const types = typesByServices.get(parserServices);
  if (types) return types;
  const created = new WeakMap<TypedNode, ResolvedType>();
  typesByServices.set(parserServices, created);
  return created;
};
