import * as React from 'react';
import { useCallback } from 'react';

import type { ArtistSplit, ArtistSplitPart } from '../defs';

export default function SplitArtistRow(props: {
  setReplacement: (replacement: string) => void;
  split: ArtistSplit;
  togglePart: (partIndex: number) => void;
}): JSX.Element {
  const { setReplacement, split, togglePart } = props;

  const updateReplacement = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setReplacement(event.target.value);
    },
    [setReplacement]
  );

  return (
    <tr>
      <td>
        {split.parts.map(
          (part: ArtistSplitPart, partIndex: number): JSX.Element => (
            <>
              <label className="button button-stub">
                <input
                  checked={part.included}
                  onChange={(): void => togglePart(partIndex)}
                  type="checkbox"
                />{' '}
                {part.name}
              </label>{' '}
              {part.joiner}
            </>
          )
        )}
      </td>
      <td className="input-group">
        <input
          type="text"
          onChange={updateReplacement}
          value={split.replacement}
        />
      </td>
    </tr>
  );
}
