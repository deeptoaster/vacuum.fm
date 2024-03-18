import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Album, Database, PossibleDuplicate, Track } from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';

export default function DeduplicateTracksByNameStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [trackRemappings, setTrackRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate> =>
      database.albums
        .map(
          (album: Album): ReadonlyArray<PossibleDuplicate> =>
            VacuumUtils.findPossibleDuplicatesByName(
              album.tracks.map(
                (trackIndex: number): Track => database.tracks[trackIndex]
              )
            ).map(
              (possibleDuplicate: PossibleDuplicate): PossibleDuplicate => ({
                leftIndex: album.tracks[possibleDuplicate.leftIndex],
                referenceEntityName: database.artists[album.artistIndex].name,
                rightIndex: album.tracks[possibleDuplicate.rightIndex]
              })
            )
        )
        .flat(),
    [database]
  );

  const submitTrackDeduplications = useCallback((): void => {
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
        trackIndexToRemove
      );

      if (remappedTrackIndex !== trackIndexToRemove) {
        const { albumIndex, artistIndex } = tracks[trackIndexToRemove];

        albums[albumIndex] = {
          ...albums[albumIndex],
          tracks: albums[albumIndex].tracks.filter(
            (trackIndex: number): boolean => trackIndex !== trackIndexToRemove
          )
        };

        artists[artistIndex] = {
          ...artists[artistIndex],
          tracks: artists[artistIndex].tracks.filter(
            (trackIndex: number): boolean => trackIndex !== trackIndexToRemove
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

  return (
    <StageContainer
      onSubmit={submitTrackDeduplications}
      stage={Stage.DEDUPLICATE_TRACKS_BY_NAME}
    >
      <DeduplicateStageContents
        entities={database.tracks}
        entityLabel="track"
        possibleDuplicates={possibleDuplicates}
        referenceEntityLabel={null}
        remappings={trackRemappings}
        setRemappings={setTrackRemappings}
        tracks={database.tracks}
      />
    </StageContainer>
  );
}
