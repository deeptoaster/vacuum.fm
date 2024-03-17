import { useCallback } from 'react';

import * as VacuumUtils from '../utils';
import type { Database } from '../defs';

export default function useSubmitArtistDeduplications(
  artistRemappings: Record<number, number | null>,
  database: Database,
  incrementStage: (database: Database) => void
): () => void {
  return useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (let artistIndex = 0; artistIndex < artists.length; artistIndex += 1) {
      const remappedArtistIndex = VacuumUtils.remapDuplicates(
        artistRemappings,
        artistIndex
      );

      if (remappedArtistIndex !== artistIndex) {
        const remappedArtistAlbums = { ...artists[remappedArtistIndex].albums };
        const remappedArtistTracks = { ...artists[remappedArtistIndex].tracks };

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const albumIndex in artists[artistIndex].albums) {
          albums[albumIndex] = {
            ...albums[albumIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistAlbums[albumIndex] = true;
        }

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const trackIndex in artists[artistIndex].tracks) {
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistTracks[trackIndex] = true;
        }

        artists[remappedArtistIndex] = {
          ...artists[remappedArtistIndex],
          albums: remappedArtistAlbums,
          count:
            artists[remappedArtistIndex].count + artists[artistIndex].count,
          tracks: remappedArtistTracks
        };

        artists[artistIndex] = {
          ...artists[artistIndex],
          albums: {},
          count: 0,
          tracks: {}
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [artistRemappings, database, incrementStage]);
}
