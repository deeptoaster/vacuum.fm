import { useCallback } from 'react';

import * as VacuumUtils from '../utils';
import type { Database, Remappings, TrackIndex } from '../defs';

export default function useSubmitArtistDeduplications(
  trackRemappings: Remappings<'track'>,
  database: Database,
  incrementStage: (database: Database) => void
): () => void {
  return useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (
      let trackIndexToRemove = 0;
      trackIndexToRemove < tracks.length;
      trackIndexToRemove += 1
    ) {
      const remappedTrackIndex = VacuumUtils.remapDuplicates(
        trackRemappings,
        VacuumUtils.makeIndex<'track'>(trackIndexToRemove)
      );

      if (remappedTrackIndex !== trackIndexToRemove) {
        const { albumIndex, artistIndex } = tracks[trackIndexToRemove];

        albums[albumIndex] = {
          ...albums[albumIndex],
          tracks: albums[albumIndex].tracks.filter(
            (trackIndex: TrackIndex): boolean =>
              trackIndex !== trackIndexToRemove
          )
        };

        artists[artistIndex] = {
          ...artists[artistIndex],
          tracks: artists[artistIndex].tracks.filter(
            (trackIndex: TrackIndex): boolean =>
              trackIndex !== trackIndexToRemove
          )
        };

        tracks[remappedTrackIndex] = {
          ...tracks[remappedTrackIndex],
          count:
            tracks[remappedTrackIndex].count + tracks[trackIndexToRemove].count
        };

        tracks[trackIndexToRemove] = {
          ...tracks[trackIndexToRemove],
          count: 0
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [database, incrementStage, trackRemappings]);
}
