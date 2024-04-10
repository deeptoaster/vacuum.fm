export default function makeKey(
  ...entityIndices: ReadonlyArray<number | string>
): string {
  return `:${entityIndices.join(':')}`;
}
