import * as React from 'react';
import { useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Database, PossibleDuplicate, Remappings } from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import useSubmitArtistDeduplications from '../hooks/useSubmitArtistDeduplications';

export default function DeduplicateArtistsByNameStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [artistRemappings, setArtistRemappings] = useState<
    Remappings<'artist'>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate<'artist'>> =>
      VacuumUtils.findPossibleDuplicatesByName(database.artists),
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
      stage={Stage.DEDUPLICATE_ARTISTS_BY_NAME}
    >
      <DeduplicateStageContents
        entities={database.artists}
        entityLabel="artist"
        possibleDuplicates={possibleDuplicates}
        referenceEntityLabel={null}
        remappings={artistRemappings}
        setRemappings={setArtistRemappings}
        tracks={database.tracks}
      />
    </StageContainer>
  );
}
