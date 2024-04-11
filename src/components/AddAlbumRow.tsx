import * as React from 'react';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';

import type { AlbumTitleSetting } from '../defs';

import './AddAlbumRow.css';

export default function AddAlbumRow(props: {
  albumTitleSetting: AlbumTitleSetting;
  setAlbumTitle: (albumName: string) => void;
}): JSX.Element {
  const { albumTitleSetting, setAlbumTitle } = props;

  const updateAlbumTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setAlbumTitle(event.target.value);
    },
    [setAlbumTitle]
  );

  return (
    <tr>
      <td className="add-album-field">{albumTitleSetting.artistName}</td>
      <td className="input-group">
        <input
          onChange={updateAlbumTitle}
          type="text"
          value={albumTitleSetting.albumName}
        />
      </td>
      <td className="add-album-field">{albumTitleSetting.trackName}</td>
    </tr>
  );
}
