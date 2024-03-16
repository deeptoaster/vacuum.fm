export default function remapDuplicates(
  remappings: Record<number, number | null>,
  index: number
): number {
  let mappedIndex = index;
  let remappedIndex = remappings[mappedIndex];

  while (remappedIndex != null) {
    mappedIndex = remappedIndex;
    remappedIndex = remappings[mappedIndex];
  }

  return mappedIndex;
}
