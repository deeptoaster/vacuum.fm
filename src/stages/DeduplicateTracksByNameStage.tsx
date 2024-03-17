import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Artist, Database, PossibleDuplicate, Track } from '../defs';
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
      database.artists
        .map((artist: Artist): ReadonlyArray<PossibleDuplicate> => {
          const trackIndices = Object.keys(artist.tracks).map(Number);

          return VacuumUtils.findPossibleDuplicatesByName(
            trackIndices.map(
              (trackIndex: number): Track => database.tracks[trackIndex]
            )
          ).map(
            (possibleDuplicate: PossibleDuplicate): PossibleDuplicate => ({
              leftIndex: trackIndices[possibleDuplicate.leftIndex],
              referenceEntityName: artist.name,
              rightIndex: trackIndices[possibleDuplicate.rightIndex]
            })
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
      stage={Stage.DEDUPLICATE_TRACKS_BY_NAME}
    >
      <DeduplicateStageContents
        entities={database.tracks}
        entityLabel="track"
        possibleDuplicates={possibleDuplicates}
        referenceEntityLabel={null}
        remappings={trackRemappings}
        setRemappings={setTrackRemappings}
      />
    </StageContainer>
  );
}
