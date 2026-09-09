import type { CorsaTypeCheckerShape } from "corsa-oxlint";

/**
 * Resolves a value once per key for the lifetime of the checker it is asked through.
 */
export type TypeQueryMemo<Result> = (
  checker: CorsaTypeCheckerShape,
  key: string,
  resolve: () => Result,
) => Result;

type MemoEntry<Result> = { readonly value: Result };

/**
 * Creates a memo for a single pure type query.
 *
 * NOTE: corsa answers checker queries over the transport to the TypeScript process. Its session
 * serves some of them from its own per-snapshot caches, but the rest cost a round trip, and asking
 * the same question once per AST node pays that repeatedly even when the answer depends only on the
 * type. `create()` runs once per rule per file and builds one checker, so keying the memo on that
 * checker scopes it to a single rule instance on a single file: never longer than the snapshot the
 * types were resolved from, and empty again on the next `create()` call. Keys are built from
 * `CorsaType.id`, the same identity corsa caches base types and symbols by.
 * @returns A query wrapper that resolves each key at most once per checker
 */
export const createTypeQueryMemo = <Result>(): TypeQueryMemo<Result> => {
  const entriesByChecker = new WeakMap<CorsaTypeCheckerShape, Map<string, MemoEntry<Result>>>();

  const findEntries = (checker: CorsaTypeCheckerShape): Map<string, MemoEntry<Result>> => {
    const entries = entriesByChecker.get(checker);
    if (entries) return entries;
    const created = new Map<string, MemoEntry<Result>>();
    entriesByChecker.set(checker, created);
    return created;
  };

  return (checker, key, resolve) => {
    const entries = findEntries(checker);
    const entry = entries.get(key);
    if (entry) return entry.value;
    const value = resolve();
    entries.set(key, { value });
    return value;
  };
};
