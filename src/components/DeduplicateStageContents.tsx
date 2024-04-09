import * as React from 'react';
import { useEffect, useMemo } from 'react';

import * as VacuumUtils from '../utils';
import type { Entities, PossibleDuplicate, Remappings, Track } from '../defs';
import DeduplicateRow from './DeduplicateRow';

export default function DeduplicateStageContents<
  Brand extends keyof Entities
>(props: {
  entities: ReadonlyArray<Entities[Brand]>;
  entityLabel: string;
  possibleDuplicates: ReadonlyArray<PossibleDuplicate<Brand>>;
  referenceEntityLabel: string | null;
  remappings: Remappings<Brand>;
  setRemappings: (remappings: Remappings<Brand>) => void;
  tracks: ReadonlyArray<Track>;
}): JSX.Element {
  const {
    entities,
    entityLabel,
    possibleDuplicates,
    referenceEntityLabel,
    remappings,
    setRemappings,
    tracks
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

  const nonMandatoryPossibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate<Brand>> =>
      possibleDuplicates.filter(
        (possibleDuplicate: PossibleDuplicate<Brand>) =>
          !possibleDuplicate.mandatory
      ),
    [possibleDuplicates]
  );

  useEffect(
    () =>
      setRemappings(
        possibleDuplicates.reduce(
          (
            newRemappings: Remappings<Brand>,
            possibleDuplicate: PossibleDuplicate<Brand>
          ) => {
            if (possibleDuplicate.mandatory) {
              newRemappings[possibleDuplicate.rightIndex] =
                possibleDuplicate.leftIndex;
            }

            return newRemappings;
          },
          // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
          {} as Remappings<Brand>
        )
      ),
    [possibleDuplicates, setRemappings]
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
      {nonMandatoryPossibleDuplicates.length !== 0 ? (
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
            {nonMandatoryPossibleDuplicates
              .filter(
                (possibleDuplicate: PossibleDuplicate<Brand>) =>
                  !possibleDuplicate.mandatory
              )
              .map(
                (possibleDuplicate: PossibleDuplicate<Brand>): JSX.Element => (
                  <DeduplicateRow
                    entities={entities}
                    key={VacuumUtils.makeKey(
                      possibleDuplicate.leftIndex,
                      possibleDuplicate.rightIndex
                    )}
                    possibleDuplicate={possibleDuplicate}
                    remappings={remappings}
                    setRemappings={setRemappings}
                    tracks={tracks}
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
