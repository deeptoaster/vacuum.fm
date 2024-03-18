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

    for (
      let artistIndexToRemove = 0;
      artistIndexToRemove < artists.length;
      artistIndexToRemove += 1
    ) {
      const remappedArtistIndex = VacuumUtils.remapDuplicates(
        artistRemappings,
        artistIndexToRemove
      );

      if (remappedArtistIndex !== artistIndexToRemove) {
        const remappedArtistAlbums = [...artists[remappedArtistIndex].albums];
        const remappedArtistTracks = [...artists[remappedArtistIndex].tracks];

        for (
          let albumIndex = 0;
          albumIndex < artists[artistIndexToRemove].albums.length;
          albumIndex += 1
        ) {
          albums[albumIndex] = {
            ...albums[albumIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistAlbums.push(albumIndex);
        }

        for (
          let trackIndex = 0;
          trackIndex < artists[artistIndexToRemove].tracks.length;
          trackIndex += 1
        ) {
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistTracks.push(trackIndex);
        }

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        remappedArtistAlbums.sort();
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        remappedArtistTracks.sort();

        artists[remappedArtistIndex] = {
          ...artists[remappedArtistIndex],
          albums: remappedArtistAlbums,
          count:
            artists[remappedArtistIndex].count +
            artists[artistIndexToRemove].count,
          tracks: remappedArtistTracks
        };

        artists[artistIndexToRemove] = {
          ...artists[artistIndexToRemove],
          albums: [],
          count: 0,
          tracks: []
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [artistRemappings, database, incrementStage]);
}
