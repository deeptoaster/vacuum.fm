import type { Entity, PossibleDuplicate, Track } from '../defs';

export default function findPossibleDuplicatesByTracks(
  tracks: ReadonlyArray<Track>,
  field: 'albumIndex' | 'artistIndex',
  referenceEntities: ReadonlyArray<Entity>,
  referenceField: 'albumIndex' | 'artistIndex'
): ReadonlyArray<PossibleDuplicate> {
  const possibleDuplicates: Record<string, PossibleDuplicate> = {};

  for (let leftIndex = 0; leftIndex < tracks.length; leftIndex += 1) {
    const leftTrack = tracks[leftIndex];

    if (leftTrack.count !== 0) {
      const leftReferenceEntityName =
        referenceEntities[leftTrack[referenceField]].name;

      for (
        let rightIndex = leftIndex + 1;
        rightIndex < tracks.length;
        rightIndex += 1
      ) {
        const rightTrack = tracks[rightIndex];

        if (rightTrack.count !== 0) {
          const rightReferenceEntityName =
            referenceEntities[rightTrack[referenceField]].name;

          if (
            leftReferenceEntityName === rightReferenceEntityName &&
            leftTrack.name === rightTrack.name
          ) {
            const key = `${leftTrack[field]}-${rightTrack[field]}`;

            if (!(key in possibleDuplicates)) {
              possibleDuplicates[key] = {
                leftIndex: leftTrack[field],
                mandatory: false,
                referenceEntityName: leftReferenceEntityName,
                rightIndex: rightTrack[field]
              };
            }
          }
        }
      }
    }
  }

  return Object.values(possibleDuplicates);
}
