import * as React from 'react';
import { useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Database, PossibleDuplicate, Remappings } from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import useSubmitArtistDeduplications from '../hooks/useSubmitArtistDeduplications';

export default function DeduplicateArtistsByTracksStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [artistRemappings, setArtistRemappings] = useState<
    Remappings<'artist'>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate<'artist'>> =>
      VacuumUtils.findPossibleDuplicatesByTracks(
        database.tracks,
        'artistIndex',
        database.albums,
        'albumIndex'
      ),
    [database]
  );

  const submitArtistDeduplications = useSubmitArtistDeduplications(
    artistRemappings,
    database,
    incrementStage
  );

  return (
    <StageContainer
      onSubmit={submitArtistDeduplications}
      stage={Stage.DEDUPLICATE_ARTISTS_BY_TRACKS}
    >
      <DeduplicateStageContents
        entities={database.artists}
        entityLabel="artist"
        possibleDuplicates={possibleDuplicates}
        referenceEntityLabel="album"
        remappings={artistRemappings}
        setRemappings={setArtistRemappings}
        tracks={database.tracks}
      />
    </StageContainer>
  );
}
