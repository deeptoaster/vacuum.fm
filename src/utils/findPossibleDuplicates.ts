import type { Entity } from '../defs';

function normalizeName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/^ | $/g, '')
    .toLowerCase()
    .replace(/ \(.*\)| - .*$| \[.*\]| feat\.? .*$/i, '')
    .replace(/ and /g, ' & ')
    .replace(/[^ &0-9a-z]/g, '')
    .replace(/ +/g, ' ');
}

export default function findPossibleDuplicates(
  entities: ReadonlyArray<Entity>
): ReadonlyArray<[number, number]> {
  const possibleDuplicates: Array<[number, number]> = [];

  for (let leftIndex = 0; leftIndex < entities.length; leftIndex += 1) {
    const leftName = normalizeName(entities[leftIndex].name);

    for (
      let rightIndex = leftIndex + 1;
      rightIndex < entities.length;
      rightIndex += 1
    ) {
      const rightName = normalizeName(entities[rightIndex].name);

      if (leftName === rightName) {
        possibleDuplicates.push([leftIndex, rightIndex]);
      }
    }
  }

  return possibleDuplicates;
}
