import * as React from 'react';
import { useMemo } from 'react';

import type { Entity, PossibleDuplicate } from '../defs';
import DeduplicateRow from './DeduplicateRow';

export default function DeduplicateStageContents(props: {
  entities: ReadonlyArray<Entity>;
  entityLabel: string;
  possibleDuplicates: ReadonlyArray<PossibleDuplicate>;
  referenceEntityLabel: string | null;
  remappings: Record<number, number | null>;
  setRemappings: (remappings: Record<number, number | null>) => void;
}): JSX.Element {
  const {
    entities,
    entityLabel,
    possibleDuplicates,
    referenceEntityLabel,
    remappings,
    setRemappings
  } = props;

  const capitalizedEntityLabel = useMemo(
    (): string => entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1),
    [entityLabel]
  );

  const capitalizedReferenceEntityLabel = useMemo(
    (): string | null =>
      referenceEntityLabel != null
        ? referenceEntityLabel.charAt(0).toUpperCase() +
          referenceEntityLabel.slice(1)
        : null,
    [referenceEntityLabel]
  );

  return (
    <>
      {referenceEntityLabel != null ? (
        <>
          <p>
            Different music services may also credit the same track to different{' '}
            {entityLabel}s.
          </p>
          <p>
            You can use this tool to merge them by choosing a canonical{' '}
            {entityLabel} to assign to each track.
          </p>
        </>
      ) : (
        <>
          <p>
            Different music services may report the same {entityLabel} with
            slightly different names.
          </p>
          <p>
            You can use this tool to merge them by choosing a canonical name for
            each {entityLabel}.
          </p>
        </>
      )}
      {possibleDuplicates.length !== 0 ? (
        <table>
          <thead>
            <tr>
              {capitalizedReferenceEntityLabel != null ? (
                <th>{capitalizedReferenceEntityLabel}</th>
              ) : possibleDuplicates[0].referenceEntityName != null ? (
                <th>Artist</th>
              ) : null}
              <th>{capitalizedEntityLabel} 1</th>
              <th>{capitalizedEntityLabel} 2</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {possibleDuplicates.map(
              (possibleDuplicate: PossibleDuplicate): JSX.Element => (
                <DeduplicateRow
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
      ) : (
        <h4>No potential duplicates found! Go ahead and hit Continue.</h4>
      )}
    </>
  );
}
