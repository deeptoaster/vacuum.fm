import * as React from 'react';
import { useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Database, PossibleDuplicate } from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import useSubmitAlbumDeduplications from '../hooks/useSubmitAlbumDeduplications';

export default function DeduplicateAlbumsByTracksStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [albumRemappings, setAlbumRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate> =>
      VacuumUtils.findPossibleDuplicatesByTracks(
        database.tracks,
        'albumIndex',
        database.artists,
        'artistIndex'
      ),
    [database]
  );

  const submitAlbumDeduplications = useSubmitAlbumDeduplications(
    albumRemappings,
    database,
    incrementStage
  );

  return (
    <StageContainer
      onSubmit={submitAlbumDeduplications}
      stage={Stage.DEDUPLICATE_ARTISTS_BY_TRACKS}
    >
      <DeduplicateStageContents
        entities={database.artists}
        entityLabel="album"
        possibleDuplicates={possibleDuplicates}
        referenceEntityLabel="artist"
        remappings={albumRemappings}
        setRemappings={setAlbumRemappings}
      />
    </StageContainer>
  );
}
