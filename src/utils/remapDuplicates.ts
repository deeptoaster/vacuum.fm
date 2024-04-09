import type { Entities, EntityIndices, Remappings } from '../defs';

export default function remapDuplicates<Brand extends keyof Entities>(
  remappings: Remappings<Brand>,
  index: EntityIndices[Brand]
): EntityIndices[Brand] {
  let mappedIndex = index;
  let remappedIndex = remappings[mappedIndex];

  while (remappedIndex != null) {
    mappedIndex = remappedIndex;
    remappedIndex = remappings[mappedIndex];
  }

  return mappedIndex;
}
