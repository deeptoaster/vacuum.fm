import type { EntityIndex } from '../defs';

export default function makeKey(
  ...entityIndices: ReadonlyArray<EntityIndex>
): string {
  return `:${entityIndices.join(':')}`;
}
