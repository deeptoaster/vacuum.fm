import { useCallback } from 'react';

import * as VacuumUtils from '../utils';
import type { AlbumIndex, Database, Remappings } from '../defs';

export default function useSubmitAlbumDeduplications(
  albumRemappings: Remappings<'album'>,
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
        VacuumUtils.makeIndex<'album'>(albumIndexToRemove)
      );

      if (remappedAlbumIndex !== albumIndexToRemove) {
        const { artistIndex, tracks: albumTracksToRemove } =
          albums[albumIndexToRemove];
        const remappedAlbumTracks = [...albums[remappedAlbumIndex].tracks];

        artists[artistIndex] = {
          ...artists[artistIndex],
          albums: artists[artistIndex].albums.filter(
            (albumIndex: AlbumIndex): boolean =>
              albumIndex !== albumIndexToRemove
          )
        };

        for (
          let trackIndexIndex = 0;
          trackIndexIndex < albumTracksToRemove.length;
          trackIndexIndex += 1
        ) {
          const trackIndex = albumTracksToRemove[trackIndexIndex];

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
