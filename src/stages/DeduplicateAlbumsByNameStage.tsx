import * as React from 'react';
import { useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Album, Artist, Database, PossibleDuplicate } from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import useSubmitAlbumDeduplications from '../hooks/useSubmitAlbumDeduplications';

export default function DeduplicateAlbumsByNameStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [albumRemappings, setAlbumRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate> =>
      database.artists
        .map((artist: Artist): ReadonlyArray<PossibleDuplicate> => {
          const albumIndices = Object.keys(artist.albums).map(Number);

          return VacuumUtils.findPossibleDuplicatesByName(
            albumIndices.map(
              (albumIndex: number): Album => database.albums[albumIndex]
            )
          ).map(
            (possibleDuplicate: PossibleDuplicate): PossibleDuplicate => ({
              leftIndex: albumIndices[possibleDuplicate.leftIndex],
              referenceEntityName: artist.name,
              rightIndex: albumIndices[possibleDuplicate.rightIndex]
            })
          );
        })
        .flat(),
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
      stage={Stage.DEDUPLICATE_ALBUMS_BY_NAME}
    >
      <DeduplicateStageContents
        entities={database.albums}
        entityLabel="album"
        possibleDuplicates={possibleDuplicates}
        referenceEntityLabel={null}
        remappings={albumRemappings}
        setRemappings={setAlbumRemappings}
      />
    </StageContainer>
  );
}
