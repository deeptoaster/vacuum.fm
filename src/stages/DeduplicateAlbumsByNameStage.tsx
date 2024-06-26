import * as React from 'react';
import { useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type {
  Album,
  AlbumIndex,
  Artist,
  Database,
  PossibleDuplicate,
  Remappings
} from '../defs';
import DeduplicateStageContents from '../components/DeduplicateStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import useSubmitAlbumDeduplications from '../hooks/useSubmitAlbumDeduplications';

export default function DeduplicateAlbumsByNameStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [albumRemappings, setAlbumRemappings] = useState<Remappings<'album'>>(
    {}
  );

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate<'album'>> =>
      database.artists
        .map(
          (artist: Artist): ReadonlyArray<PossibleDuplicate<'album'>> =>
            VacuumUtils.findPossibleDuplicatesByName<'album'>(
              artist.albums.map(
                (albumIndex: AlbumIndex): Album => database.albums[albumIndex]
              )
            ).map(
              (
                possibleDuplicate: PossibleDuplicate<'album'>
              ): PossibleDuplicate<'album'> => ({
                leftIndex: artist.albums[possibleDuplicate.leftIndex],
                mandatory: possibleDuplicate.mandatory,
                referenceEntityName: artist.name,
                rightIndex: artist.albums[possibleDuplicate.rightIndex]
              })
            )
        )
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
        tracks={database.tracks}
      />
    </StageContainer>
  );
}
