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
        const artistAlbumsToRemove = artists[artistIndexToRemove].albums;
        const remappedArtistAlbums = [...artists[remappedArtistIndex].albums];
        const artistTracksToRemove = artists[artistIndexToRemove].tracks;
        const remappedArtistTracks = [...artists[remappedArtistIndex].tracks];

        for (
          let albumIndexIndex = 0;
          albumIndexIndex < artistAlbumsToRemove.length;
          albumIndexIndex += 1
        ) {
          const albumIndex = artistAlbumsToRemove[albumIndexIndex];

          albums[albumIndex] = {
            ...albums[albumIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistAlbums.push(albumIndex);
        }

        for (
          let trackIndexIndex = 0;
          trackIndexIndex < artists[artistIndexToRemove].tracks.length;
          trackIndexIndex += 1
        ) {
          const trackIndex = artistTracksToRemove[trackIndexIndex];

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
