import type { EntityIndices } from '../defs';

export default function makeIndex<Brand extends keyof EntityIndices>(
  index: number
): EntityIndices[Brand] {
  return index as EntityIndices[Brand];
}
