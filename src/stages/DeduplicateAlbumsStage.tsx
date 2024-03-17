import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Album, Artist, Database } from '../defs';
import { STAGE_NAMES, Stage } from '../defs';
import DeduplicateRow from '../components/DeduplicateRow';
import StageContainer from '../components/StageContainer';

export default function DeduplicateAlbumsStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [albumRemappings, setAlbumRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<[number, number]> =>
      database.artists
        .map((artist: Artist): ReadonlyArray<[number, number]> => {
          const albumIndices = Object.keys(artist.albums).map(Number);

          return VacuumUtils.findPossibleDuplicates(
            albumIndices.map(
              (albumIndex: number): Album => database.albums[albumIndex]
            )
          ).map(
            ([leftIndex, rightIndex]: [number, number]): [number, number] => [
              albumIndices[leftIndex],
              albumIndices[rightIndex]
            ]
          );
        })
        .flat(),
    [database]
  );

  const submitAlbumDeduplications = useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (let albumIndex = 0; albumIndex < albums.length; albumIndex += 1) {
      const remappedAlbumIndex = VacuumUtils.remapDuplicates(
        albumRemappings,
        albumIndex
      );

      if (remappedAlbumIndex !== albumIndex) {
        const { [albumIndex]: ignored, ...otherArtistAlbums } =
          artists[albums[albumIndex].artistIndex].albums;
        const remappedAlbumTracks = { ...albums[remappedAlbumIndex].tracks };

        artists[albums[albumIndex].artistIndex] = {
          ...artists[albums[albumIndex].artistIndex],
          albums: { ...otherArtistAlbums }
        };

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const trackIndex in albums[albumIndex].tracks) {
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            albumIndex: remappedAlbumIndex
          };

          remappedAlbumTracks[trackIndex] = true;
        }

        albums[remappedAlbumIndex] = {
          ...albums[remappedAlbumIndex],
          count: albums[remappedAlbumIndex].count + albums[albumIndex].count,
          tracks: remappedAlbumTracks
        };

        albums[albumIndex] = {
          ...albums[albumIndex],
          count: 0,
          tracks: {}
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [albumRemappings, database, incrementStage]);

  return (
    <StageContainer
      onSubmit={submitAlbumDeduplications}
      subtitle={STAGE_NAMES[Stage.DEDUPLICATE_ALBUMS]}
      title="Part 2: Album Names"
    >
      <p>
        Different music services may report the same album in different ways.
      </p>
      <p>
        You can use this tool to merge them by choosing a canonical name for
        each album.
      </p>
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Album 1</th>
            <th>Album 2</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {possibleDuplicates.map(
            ([leftIndex, rightIndex]: [number, number]): JSX.Element => (
              <DeduplicateRow
                artists={database.artists}
                entities={database.albums}
                key={`${leftIndex}-${rightIndex}`}
                leftIndex={leftIndex}
                remappings={albumRemappings}
                rightIndex={rightIndex}
                setRemappings={setAlbumRemappings}
              />
            )
          )}
        </tbody>
      </table>
    </StageContainer>
  );
}
