import * as React from 'react';
import { useCallback, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Album, AlbumIndex, AlbumTitleSetting, Database } from '../defs';
import AddAlbumRow from '../components/AddAlbumRow';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';

export default function AddAlbumsStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [albumTitleSettings, setAlbumTitleSettings] = useState<
    ReadonlyArray<AlbumTitleSetting>
  >(
    Object.entries(database.albums)
      .map(
        ([albumIndex, album]: [string, Album]): AlbumTitleSetting => ({
          albumIndex: VacuumUtils.makeIndex<'album'>(Number(albumIndex)),
          albumName: album.name,
          artistName: database.artists[album.artistIndex].name,
          trackName: database.tracks[album.tracks[0]].name
        })
      )
      .filter(
        (albumTitleSetting: AlbumTitleSetting): boolean =>
          albumTitleSetting.albumName === ''
      )
  );

  const setAlbumTitle = useCallback(
    (albumIndexToChange: AlbumIndex, albumName: string): void =>
      setAlbumTitleSettings(
        albumTitleSettings.map(
          (albumTitleSetting: AlbumTitleSetting): AlbumTitleSetting =>
            albumTitleSetting.albumIndex === albumIndexToChange
              ? { ...albumTitleSetting, albumName }
              : albumTitleSetting
        )
      ),
    [albumTitleSettings]
  );

  const submitAlbumTitles = useCallback(
    (): void =>
      incrementStage({
        ...database,
        albums: albumTitleSettings.reduce(
          (
            updatedAlbums: Array<Album>,
            albumTitleSetting: AlbumTitleSetting
          ): Array<Album> => {
            updatedAlbums[albumTitleSetting.albumIndex] = {
              ...updatedAlbums[albumTitleSetting.albumIndex],
              name: albumTitleSetting.albumName
            };
            return updatedAlbums;
          },
          [...database.albums]
        )
      }),
    [albumTitleSettings, database, incrementStage]
  );

  return (
    <StageContainer onSubmit={submitAlbumTitles} stage={Stage.ADD_ALBUMS}>
      <p>Some scrobblers don't provide album information.</p>
      <p>You can use this tool to add album titles to scrobbles.</p>
      <p>
        This is optional&mdash;you can always hit <label>Continue</label> to
        move to the next step.
      </p>
      {albumTitleSettings.length !== 0 ? (
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Album</th>
              <th>Track</th>
            </tr>
          </thead>
          <tbody>
            {albumTitleSettings.map(
              (albumTitleSetting: AlbumTitleSetting): JSX.Element => (
                <AddAlbumRow
                  albumTitleSetting={albumTitleSetting}
                  key={albumTitleSetting.albumIndex}
                  setAlbumTitle={(albumName: string): void =>
                    setAlbumTitle(albumTitleSetting.albumIndex, albumName)
                  }
                />
              )
            )}
          </tbody>
        </table>
      ) : (
        <h4>No albums without titles found! Go ahead and hit Continue.</h4>
      )}
    </StageContainer>
  );
}
