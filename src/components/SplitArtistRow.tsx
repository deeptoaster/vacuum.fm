import * as React from 'react';
import { Fragment, useCallback, useEffect, useRef } from 'react';

import type { ArtistSplit, ArtistSplitPart, StageError } from '../defs';

export default function SplitArtistRow(props: {
  setReplacement: (replacement: string) => void;
  split: ArtistSplit;
  stageError: StageError | null;
  togglePart: (partIndex: number) => void;
}): JSX.Element {
  const { setReplacement, split, stageError, togglePart } = props;
  const replacementInput = useRef<HTMLInputElement>(null);

  const updateReplacement = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setReplacement(event.target.value);
    },
    [setReplacement]
  );

  useEffect((): void => {
    if (stageError?.artistIndex === split.artistIndex) {
      replacementInput.current?.focus();
    }
  }, [split, stageError]);

  return (
    <tr>
      <td>
        {split.parts.map(
          (part: ArtistSplitPart, partIndex: number): JSX.Element => (
            <Fragment key={partIndex}>
              <label className="button button-stub" key={partIndex}>
                <input
                  checked={part.included}
                  onChange={(): void => togglePart(partIndex)}
                  type="checkbox"
                />{' '}
                {part.name}
              </label>{' '}
              {part.joiner}
            </Fragment>
          )
        )}
      </td>
      <td className="input-group">
        <input
          type="text"
          onChange={updateReplacement}
          ref={replacementInput}
          value={split.replacement}
        />
      </td>
    </tr>
  );
}
