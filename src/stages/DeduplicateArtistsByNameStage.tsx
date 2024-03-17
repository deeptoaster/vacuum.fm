import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Database, PossibleDuplicate } from '../defs';
import DeduplicateByNameStageContents from '../components/DeduplicateByNameStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';

export default function DeduplicateArtistsByNameStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [artistRemappings, setArtistRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<PossibleDuplicate> =>
      VacuumUtils.findPossibleDuplicatesByName(database.artists),
    [database]
  );

  const submitArtistDeduplications = useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (let artistIndex = 0; artistIndex < artists.length; artistIndex += 1) {
      const remappedArtistIndex = VacuumUtils.remapDuplicates(
        artistRemappings,
        artistIndex
      );

      if (remappedArtistIndex !== artistIndex) {
        const remappedArtistAlbums = { ...artists[remappedArtistIndex].albums };
        const remappedArtistTracks = { ...artists[remappedArtistIndex].tracks };

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const albumIndex in artists[artistIndex].albums) {
          albums[albumIndex] = {
            ...albums[albumIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistAlbums[albumIndex] = true;
        }

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const trackIndex in artists[artistIndex].tracks) {
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            artistIndex: remappedArtistIndex
          };

          remappedArtistTracks[trackIndex] = true;
        }

        artists[remappedArtistIndex] = {
          ...artists[remappedArtistIndex],
          albums: remappedArtistAlbums,
          count:
            artists[remappedArtistIndex].count + artists[artistIndex].count,
          tracks: remappedArtistTracks
        };

        artists[artistIndex] = {
          ...artists[artistIndex],
          albums: {},
          count: 0,
          tracks: {}
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [artistRemappings, database, incrementStage]);

  return (
    <StageContainer
      onSubmit={submitArtistDeduplications}
      stage={Stage.DEDUPLICATE_ARTISTS}
    >
      <DeduplicateByNameStageContents
        artists={null}
        entities={database.artists}
        entityLabel="artist"
        possibleDuplicates={possibleDuplicates}
        remappings={artistRemappings}
        setRemappings={setArtistRemappings}
      />
    </StageContainer>
  );
}
