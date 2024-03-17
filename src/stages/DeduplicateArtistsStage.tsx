import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import { STAGE_NAMES, Stage } from '../defs';
import type { Database } from '../defs';
import DeduplicateRow from '../components/DeduplicateRow';
import StageContainer from '../components/StageContainer';

export default function DeduplicateArtistsStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
}): JSX.Element {
  const { database, incrementStage } = props;

  const [artistRemappings, setArtistRemappings] = useState<
    Record<number, number | null>
  >({});

  const possibleDuplicates = useMemo(
    (): ReadonlyArray<[number, number]> =>
      VacuumUtils.findPossibleDuplicates(database.artists),
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
      subtitle={STAGE_NAMES[Stage.DEDUPLICATE_ARTISTS]}
      title="Part 1: Artist Names"
    >
      <p>
        Different music services may report the same artist in different ways.
      </p>
      <p>
        You can use this tool to merge them by choosing a canonical name for
        each artist.
      </p>
      <table>
        <thead>
          <tr>
            <th>Artist 1</th>
            <th>Artist 2</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {possibleDuplicates.map(
            ([leftIndex, rightIndex]: [number, number]): JSX.Element => (
              <DeduplicateRow
                entities={database.artists}
                key={`${leftIndex}-${rightIndex}`}
                leftIndex={leftIndex}
                remappings={artistRemappings}
                rightIndex={rightIndex}
                setRemappings={setArtistRemappings}
              />
            )
          )}
        </tbody>
      </table>
    </StageContainer>
  );
}
