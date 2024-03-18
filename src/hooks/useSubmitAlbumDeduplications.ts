import { useCallback } from 'react';

import * as VacuumUtils from '../utils';
import type { Database } from '../defs';

export default function useSubmitAlbumDeduplications(
  albumRemappings: Record<number, number | null>,
  database: Database,
  incrementStage: (database: Database) => void
): () => void {
  return useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (
      let albumIndexToRemove = 0;
      albumIndexToRemove < albums.length;
      albumIndexToRemove += 1
    ) {
      const remappedAlbumIndex = VacuumUtils.remapDuplicates(
        albumRemappings,
        albumIndexToRemove
      );

      if (remappedAlbumIndex !== albumIndexToRemove) {
        const { artistIndex } = albums[albumIndexToRemove];
        const remappedAlbumTracks = [...albums[albumIndexToRemove].tracks];

        artists[artistIndex] = {
          ...artists[artistIndex],
          albums: artists[artistIndex].albums.filter(
            (albumIndex: number): boolean => albumIndex !== albumIndexToRemove
          )
        };

        for (
          let trackIndex = 0;
          trackIndex < albums[albumIndexToRemove].tracks.length;
          trackIndex += 1
        ) {
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            albumIndex: remappedAlbumIndex
          };

          remappedAlbumTracks.push(trackIndex);
        }

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        remappedAlbumTracks.sort();

        albums[remappedAlbumIndex] = {
          ...albums[remappedAlbumIndex],
          count:
            albums[remappedAlbumIndex].count + albums[albumIndexToRemove].count,
          tracks: remappedAlbumTracks
        };

        albums[albumIndexToRemove] = {
          ...albums[albumIndexToRemove],
          count: 0,
          tracks: []
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [albumRemappings, database, incrementStage]);
}
