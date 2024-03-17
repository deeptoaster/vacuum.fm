import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Artist, Database, Track } from '../defs';
import { STAGE_NAMES, Stage } from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import StageContainer from '../components/StageContainer';

export default function DeduplicateTracksStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [trackRemappings, setTrackRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<[number, number]> =>
      database.artists
        .map((artist: Artist): ReadonlyArray<[number, number]> => {
          const trackIndices = Object.keys(artist.tracks).map(Number);

          return VacuumUtils.findPossibleDuplicates(
            trackIndices.map(
              (trackIndex: number): Track => database.tracks[trackIndex]
            )
          ).map(
            ([leftIndex, rightIndex]: [number, number]): [number, number] => [
              trackIndices[leftIndex],
              trackIndices[rightIndex]
            ]
          );
        })
        .flat(),
    [database]
  );

  const submitTrackDeduplications = useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex += 1) {
      const remappedTrackIndex = VacuumUtils.remapDuplicates(
        trackRemappings,
        trackIndex
      );

      if (remappedTrackIndex !== trackIndex) {
        const { [trackIndex]: albumIgnored, ...otherAlbumTracks } =
          albums[tracks[trackIndex].albumIndex].tracks;
        const { [trackIndex]: artistIgnored, ...otherArtistTracks } =
          artists[tracks[trackIndex].artistIndex].tracks;

        albums[tracks[trackIndex].albumIndex] = {
          ...albums[tracks[trackIndex].albumIndex],
          tracks: { ...otherAlbumTracks }
        };

        artists[tracks[trackIndex].artistIndex] = {
          ...artists[tracks[trackIndex].artistIndex],
          tracks: { ...otherArtistTracks }
        };

        tracks[remappedTrackIndex] = {
          ...tracks[remappedTrackIndex],
          count: tracks[remappedTrackIndex].count + tracks[trackIndex].count
        };

        tracks[trackIndex] = {
          ...tracks[trackIndex],
          count: 0
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [database, incrementStage, trackRemappings]);

  return (
    <StageContainer
      onSubmit={submitTrackDeduplications}
      subtitle={STAGE_NAMES[Stage.DEDUPLICATE_ALBUMS]}
      title="Part 3: Track Names"
    >
      <DeduplicateStageContents
        artists={database.artists}
        entities={database.entities}
        entityLabel="track"
        possibleDuplicates={possibleDuplicates}
        remappings={trackRemappings}
        setRemappings={setTrackRemappings}
      />
    </StageContainer>
  );
}
