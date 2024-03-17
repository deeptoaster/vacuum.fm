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

    for (let albumIndex = 0; albumIndex < albums.length; albumIndex += 1) {
      const remappedAlbumIndex = VacuumUtils.remapDuplicates(
        albumRemappings,
        albumIndex
      );

      if (remappedAlbumIndex !== albumIndex) {
        const { [albumIndex]: artistIgnored, ...otherArtistAlbums } =
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
}
