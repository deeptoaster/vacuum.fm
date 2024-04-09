import * as React from 'react';
import { useCallback } from 'react';

import * as VacuumUtils from '../utils';
import type {
  Entities,
  PossibleDuplicate,
  Remappings,
  Track,
  TrackIndex
} from '../defs';

import './DeduplicateRow.css';

export default function DeduplicateRow<Brand extends keyof Entities>(props: {
  entities: ReadonlyArray<Entities[Brand]>;
  possibleDuplicate: PossibleDuplicate<Brand>;
  remappings: Remappings<Brand>;
  setRemappings: (remappings: Remappings<Brand>) => void;
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

  const groupName = VacuumUtils.makeKey(leftIndex, rightIndex);
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
                (trackIndex: TrackIndex): JSX.Element => (
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
                (trackIndex: TrackIndex): JSX.Element => (
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
