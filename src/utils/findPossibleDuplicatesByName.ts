import type { Entities, PossibleDuplicate } from '../defs';
import makeIndex from './makeIndex';

function normalizeName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/^ | $/g, '')
    .toLowerCase()
    .replace(/ \(.*\)| - .*$| \[.*\]| feat\.? .*$/i, '')
    .replace(/ and /g, ' & ')
    .replace(/[!-%'-/:-@[-`{-~]/gu, '')
    .replace(/ +/g, ' ');
}

export default function findPossibleDuplicatesByName<
  Brand extends keyof Entities
>(
  entities: ReadonlyArray<Entities[Brand]>
): ReadonlyArray<PossibleDuplicate<Brand>> {
  const possibleDuplicates: Array<PossibleDuplicate<Brand>> = [];

  for (let leftIndex = 0; leftIndex < entities.length; leftIndex += 1) {
    const leftName = entities[leftIndex].name;
    const leftNormalizedName = normalizeName(leftName);

    for (
      let rightIndex = leftIndex + 1;
      rightIndex < entities.length;
      rightIndex += 1
    ) {
      const rightName = entities[rightIndex].name;
      const rightNormalizedName = normalizeName(rightName);

      if (leftNormalizedName === rightNormalizedName) {
        possibleDuplicates.push({
          leftIndex: makeIndex<Brand>(leftIndex),
          mandatory: leftName === rightName,
          referenceEntityName: null,
          rightIndex: makeIndex<Brand>(rightIndex)
        });
      }
    }
  }

  return possibleDuplicates;
}
