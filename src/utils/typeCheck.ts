import { Type } from "typescript";

type SuperClassType = "Construct" | "Stack";

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class or Stack Class but do not want to be treated as Construct Class or Stack Class
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: Type,
  ignoredClasses: readonly string[] = ["App", "Stage"] as const,
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isTargetSuperClassType(
    type,
    ["Construct", "Stack"],
    isConstructOrStackType,
  );
};

/**
 * Check if the type extends Construct
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class but do not want to be treated as Construct Class
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: Type,
  ignoredClasses: readonly string[] = ["App", "Stage", "Stack"] as const,
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isTargetSuperClassType(type, ["Construct"], isConstructType);
};

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param targetSuperClasses - The target super classes
 * @returns True if the type extends target super class, otherwise false
 */
const isTargetSuperClassType = (
  type: Type,
  targetSuperClasses: SuperClassType[],
  typeCheckFunction: (type: Type) => boolean,
): boolean => {
  if (!type.symbol) return false;

  // NOTE: Check if the current type ends in target super class
  if (targetSuperClasses.some((suffix) => type.symbol.name.endsWith(suffix))) {
    return true;
  }

  // NOTE: Check the base type
  const baseTypes = type.getBaseTypes() ?? [];
  return baseTypes.some((baseType) => typeCheckFunction(baseType));
};
