import type { ArtistSplitPart } from '../defs';

export default function makeArtistName(
  parts: ReadonlyArray<ArtistSplitPart>
): string {
  const partsToKeep = parts.filter(
    (part: ArtistSplitPart): boolean => part.included
  );

  return partsToKeep
    .map(
      (part: ArtistSplitPart, partIndex: number): string =>
        part.name +
        (partIndex === partsToKeep.length - 1
          ? ''
          : partIndex === partsToKeep.length - 2
            ? /^, (&|and) $/.test(parts[parts.length - 2].joiner) &&
              partsToKeep.length === 2
              ? parts[parts.length - 2].joiner.slice(1)
              : parts[parts.length - 2].joiner
            : part.joiner)
    )
    .join('');
}
