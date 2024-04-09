import type { Entities, PossibleDuplicate, Track } from '../defs';
import makeIndex from './makeIndex';
import makeKey from './makeKey';

export default function findPossibleDuplicatesByTracks<
  Brand extends Exclude<keyof Entities, 'track'>,
  ReferenceBrand extends Exclude<keyof Entities, Brand | 'track'>
>(
  tracks: ReadonlyArray<Track>,
  field: 'albumIndex' | 'artistIndex',
  referenceEntities: ReadonlyArray<Entities[ReferenceBrand]>,
  referenceField: 'albumIndex' | 'artistIndex'
): ReadonlyArray<PossibleDuplicate<Brand>> {
  const possibleDuplicates: Record<string, PossibleDuplicate<Brand>> = {};

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
            const key = makeKey(leftTrack[field], rightTrack[field]);

            if (!(key in possibleDuplicates)) {
              possibleDuplicates[key] = {
                leftIndex: makeIndex(leftTrack[field]),
                mandatory: false,
                referenceEntityName: leftReferenceEntityName,
                rightIndex: makeIndex(rightTrack[field])
              };
            }
          }
        }
      }
    }
  }

  return Object.values(possibleDuplicates);
}
