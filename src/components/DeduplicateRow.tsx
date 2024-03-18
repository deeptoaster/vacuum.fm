import * as React from 'react';
import { useCallback } from 'react';

import type { Entity, PossibleDuplicate, Track } from '../defs';

import './DeduplicateRow.css';

export default function DeduplicateRow(props: {
  entities: ReadonlyArray<Entity>;
  possibleDuplicate: PossibleDuplicate;
  remappings: Record<number, number | null>;
  setRemappings: (remappings: Record<number, number | null>) => void;
  tracks: ReadonlyArray<Track>;
}): JSX.Element | null {
  const {
    entities,
    possibleDuplicate: { leftIndex, referenceEntityName, rightIndex },
    remappings,
    setRemappings,
    tracks
  } = props;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.checked) {
        setRemappings({
          ...remappings,
          [leftIndex]: event.target.value === 'right' ? rightIndex : null,
          [rightIndex]: event.target.value === 'left' ? leftIndex : null
        });
      }
    },
    [leftIndex, remappings, rightIndex, setRemappings]
  );

  const groupName = `${leftIndex}-${rightIndex}`;
  const leftEntity = entities[leftIndex];
  const rightEntity = entities[rightIndex];

  return (remappings[leftIndex] == null ||
    remappings[leftIndex] === rightIndex) &&
    (remappings[rightIndex] == null || remappings[rightIndex] === leftIndex) ? (
    <tr className="deduplicate-row">
      {referenceEntityName != null ? <td>{referenceEntityName}</td> : null}
      <td>
        <input
          checked={remappings[rightIndex] === leftIndex}
          id={`${groupName}-left`}
          name={groupName}
          onChange={handleChange}
          type="radio"
          value="left"
        />
        <label htmlFor={`${groupName}-left`}>
          {leftEntity.name} <small>({leftEntity.count})</small>
          {'tracks' in leftEntity ? (
            <ul>
              {leftEntity.tracks.slice(0, 3).map(
                (trackIndex: number): JSX.Element => (
                  <li key={trackIndex}>{tracks[trackIndex].name}</li>
                )
              )}
            </ul>
          ) : null}
        </label>
      </td>
      <td>
        <input
          checked={remappings[leftIndex] === rightIndex}
          id={`${groupName}-right`}
          name={groupName}
          onChange={handleChange}
          type="radio"
          value="right"
        />
        <label htmlFor={`${groupName}-right`}>
          {rightEntity.name} <small>({rightEntity.count})</small>
          {'tracks' in rightEntity ? (
            <ul>
              {rightEntity.tracks.slice(0, 3).map(
                (trackIndex: number): JSX.Element => (
                  <li key={trackIndex}>{tracks[trackIndex].name}</li>
                )
              )}
            </ul>
          ) : null}
        </label>
      </td>
      <td className="deduplicate-row-separate">
        <input
          checked={
            remappings[leftIndex] == null && remappings[rightIndex] == null
          }
          id={`${groupName}-both`}
          name={groupName}
          onChange={handleChange}
          type="radio"
          value="both"
        />
        <label htmlFor={`${groupName}-both`}>Keep separate</label>
      </td>
    </tr>
  ) : null;
}
