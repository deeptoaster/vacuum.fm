import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Album, Artist, Database, PossibleDuplicate } from '../defs';
import DeduplicateByNameStageContents from '../components/DeduplicateByNameStageContents';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';

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
              rightIndex: albumIndices[possibleDuplicate.rightIndex],
              score: possibleDuplicate.score
            })
          );
        })
        .flat(),
    [database]
  );

  const submitAlbumDeduplications = useCallback((): void => {
    const albums = [...database.albums];
    const artists = [...database.artists];
    const tracks = [...database.tracks];

    for (let albumIndex = 0; albumIndex < albums.length; albumIndex += 1) {
      const remappedAlbumIndex = VacuumUtils.remapDuplicates(
        albumRemappings,
        albumIndex
      );

      if (remappedAlbumIndex !== albumIndex) {
        const { [albumIndex]: artistIgnored, ...otherArtistAlbums } =
          artists[albums[albumIndex].artistIndex].albums;
        const remappedAlbumTracks = { ...albums[remappedAlbumIndex].tracks };

        artists[albums[albumIndex].artistIndex] = {
          ...artists[albums[albumIndex].artistIndex],
          albums: { ...otherArtistAlbums }
        };

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const trackIndex in albums[albumIndex].tracks) {
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            albumIndex: remappedAlbumIndex
          };

          remappedAlbumTracks[trackIndex] = true;
        }

        albums[remappedAlbumIndex] = {
          ...albums[remappedAlbumIndex],
          count: albums[remappedAlbumIndex].count + albums[albumIndex].count,
          tracks: remappedAlbumTracks
        };

        albums[albumIndex] = {
          ...albums[albumIndex],
          count: 0,
          tracks: {}
        };
      }
    }

    incrementStage({ ...database, albums, artists, tracks });
  }, [albumRemappings, database, incrementStage]);

  return (
    <StageContainer
      onSubmit={submitAlbumDeduplications}
      stage={Stage.DEDUPLICATE_ALBUMS}
    >
      <DeduplicateByNameStageContents
        artists={database.artists}
        entities={database.albums}
        entityLabel="album"
        possibleDuplicates={possibleDuplicates}
        remappings={albumRemappings}
        setRemappings={setAlbumRemappings}
      />
    </StageContainer>
  );
}
