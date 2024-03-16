import * as React from 'react';
import { useCallback } from 'react';

import type { EntityWithName } from '../defs';

import './DeduplicateRow.css';

export default function DeduplicateRow(props: {
  entities: ReadonlyArray<EntityWithName>;
  leftIndex: number;
  remappings: Record<number, number | null>;
  rightIndex: number;
  setRemappings: (remappings: Record<number, number | null>) => void;
}): JSX.Element | null {
  const { entities, leftIndex, remappings, rightIndex, setRemappings } = props;

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

  return (remappings[leftIndex] == null ||
    remappings[leftIndex] === rightIndex) &&
    (remappings[rightIndex] == null || remappings[rightIndex] === leftIndex) ? (
    <tr className="deduplicate-row">
      <td>
        <input
          checked={remappings[rightIndex] === leftIndex}
          id={`${groupName}-left`}
          name={groupName}
          onChange={handleChange}
          type="radio"
          value="left"
        />
        <label htmlFor={`${groupName}-left`}>{entities[leftIndex].name}</label>
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
          {entities[rightIndex].name}
        </label>
      </td>
      <td>
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
