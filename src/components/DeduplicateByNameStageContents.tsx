import * as React from 'react';
import { useMemo } from 'react';

import type { Artist, Entity, PossibleDuplicate } from '../defs';
import DeduplicateRow from './DeduplicateRow';

export default function DeduplicateByNameStageContents(props: {
  artists: ReadonlyArray<Artist> | null;
  entities: ReadonlyArray<Entity>;
  entityLabel: string;
  possibleDuplicates: ReadonlyArray<PossibleDuplicate>;
  remappings: Record<number, number | null>;
  setRemappings: (remappings: Record<number, number | null>) => void;
}): JSX.Element {
  const {
    artists,
    entities,
    entityLabel,
    possibleDuplicates,
    remappings,
    setRemappings
  } = props;

  const capitalizedEntityLabel = useMemo(
    (): string => entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1),
    [entityLabel]
  );

  return (
    <>
      <p>
        Different music services may report the same {entityLabel} in different
        ways.
      </p>
      <p>
        You can use this tool to merge them by choosing a canonical name for
        each {entityLabel}.
      </p>
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>{capitalizedEntityLabel} 1</th>
            <th>{capitalizedEntityLabel} 2</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {possibleDuplicates.map(
            (possibleDuplicate: PossibleDuplicate): JSX.Element => (
              <DeduplicateRow
                artists={artists}
                entities={entities}
                key={`${possibleDuplicate.leftIndex}-${possibleDuplicate.rightIndex}`}
                possibleDuplicate={possibleDuplicate}
                remappings={remappings}
                setRemappings={setRemappings}
              />
            )
          )}
        </tbody>
      </table>
    </>
  );
}
