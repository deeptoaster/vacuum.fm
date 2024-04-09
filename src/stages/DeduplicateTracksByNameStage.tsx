import * as React from 'react';
import { useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type {
  Album,
  Database,
  PossibleDuplicate,
  Remappings,
  Track,
  TrackIndex
} from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import useSubmitTrackDeduplications from '../hooks/useSubmitTrackDeduplications';

export default function DeduplicateTracksByNameStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [trackRemappings, setTrackRemappings] = useState<Remappings<'track'>>(
    {}
  );

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate<'track'>> =>
      database.albums
        .map(
          (album: Album): ReadonlyArray<PossibleDuplicate<'track'>> =>
            VacuumUtils.findPossibleDuplicatesByName<'track'>(
              album.tracks.map(
                (trackIndex: TrackIndex): Track => database.tracks[trackIndex]
              )
            ).map(
              (
                possibleDuplicate: PossibleDuplicate<'track'>
              ): PossibleDuplicate<'track'> => ({
                leftIndex: album.tracks[possibleDuplicate.leftIndex],
                mandatory: possibleDuplicate.mandatory,
                referenceEntityName: database.artists[album.artistIndex].name,
                rightIndex: album.tracks[possibleDuplicate.rightIndex]
              })
            )
        )
        .flat(),
    [database]
  );

  const submitTrackDeduplications = useSubmitTrackDeduplications(
    trackRemappings,
    database,
    incrementStage
  );

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
