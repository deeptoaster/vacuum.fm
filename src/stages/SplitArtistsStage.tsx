import * as React from 'react';
import { useCallback, useState } from 'react';

import * as VacuumUtils from '../utils';
import type { Artist, ArtistSplit, ArtistSplitPart, Database } from '../defs';
import { STAGE_NAMES, Stage, StageError } from '../defs';
import SplitArtistRow from '../components/SplitArtistRow';
import StageContainer from '../components/StageContainer';

import './SplitArtistsStage.css';

export default function SplitArtistsStage(props: {
  database: Database;
  incrementStage: (updatedDatabase: Database) => void;
  setError: (error: Error) => void;
}): JSX.Element {
  const { database, incrementStage, setError } = props;

  const [artistSplits, setArtistSplits] = useState<ReadonlyArray<ArtistSplit>>(
    Object.entries(database.artists)
      .map(
        ([artistIndex, artist]: [string, Artist]): ArtistSplit =>
          VacuumUtils.splitArtist(artist.name, parseInt(artistIndex, 10))
      )
      .filter((split: ArtistSplit): boolean => split.parts.length > 1)
  );

  const [stageError, setStageError] = useState<StageError | null>(null);

  const setReplacement = useCallback(
    (splitIndexToChange: number, replacement: string): void => {
      setArtistSplits(
        artistSplits.map(
          (split: ArtistSplit, splitIndex: number): ArtistSplit => {
            if (splitIndex === splitIndexToChange) {
              const replacementParts = VacuumUtils.splitArtist(
                replacement,
                split.artistIndex
              ).parts;
              let replacementPartIndex = 0;

              const parts = split.parts.map(
                (part: ArtistSplitPart): ArtistSplitPart => {
                  if (
                    replacementPartIndex === replacementParts.length ||
                    part.name !== replacementParts[replacementPartIndex].name
                  ) {
                    return { ...part, included: false };
                  } else {
                    replacementPartIndex += 1;
                    return { ...part, included: true };
                  }
                }
              );

              return replacementPartIndex === replacementParts.length
                ? { ...split, parts, replacement }
                : { ...split, replacement };
            } else {
              return split;
            }
          }
        )
      );
    },
    [artistSplits]
  );

  const submitArtistSplits = useCallback((): void => {
    try {
      incrementStage({
        ...database,
        artists: artistSplits.reduce(
          (
            updatedArtists: Array<Artist>,
            split: ArtistSplit
          ): Array<Artist> => {
            const artist = updatedArtists[split.artistIndex];
            const replacement = split.replacement.trim();

            if (replacement === '') {
              throw new StageError(
                'Replacement artist name cannot be empty.',
                split.artistIndex
              );
            } else if (artist.name !== split.replacement) {
              updatedArtists[split.artistIndex] = {
                ...artist,
                name: split.replacement
              };
            }

            return updatedArtists;
          },
          [...database.artists]
        )
      });
    } catch (error) {
      if ((error as Error).name === 'StageError') {
        setError(error as StageError);
        setStageError(error as StageError);
      } else {
        throw error;
      }
    }
  }, [artistSplits, database, incrementStage, setError]);

  const togglePart = useCallback(
    (splitIndexToChange: number, partIndexToToggle: number): void => {
      setArtistSplits(
        artistSplits.map(
          (split: ArtistSplit, splitIndex: number): ArtistSplit => {
            if (splitIndex === splitIndexToChange) {
              const parts = split.parts.map(
                (part: ArtistSplitPart, partIndex: number): ArtistSplitPart =>
                  partIndex === partIndexToToggle
                    ? { ...part, included: !part.included }
                    : part
              );

              return {
                ...split,
                parts,
                replacement: VacuumUtils.makeArtistName(parts)
              };
            } else {
              return split;
            }
          }
        )
      );
    },
    [artistSplits]
  );

  return (
    <StageContainer
      onSubmit={submitArtistSplits}
      subtitle={STAGE_NAMES[Stage.SPLIT_ARTISTS]}
      title="Part 1: Artist Names"
    >
      <p>
        Some scrobblers (such as those that scrobble from "Now Playing"
        services) may report multiple artist names for a track, separated by
        commas.
      </p>
      <p>
        For consistency with scrobbles from typical music apps and Last.fm data,
        you can use this tool to assign a single artist name in these cases.
      </p>
      <p>
        There may be mistakes in the way we've split up the artist names below,
        so make sure to check the <label>Replacement</label> column to see if it
        looks right&mdash;or just type in the correct name yourself!
      </p>
      <table className="split-artists-table">
        <tr>
          <th>Original</th>
          <th>Replacement</th>
        </tr>
        {artistSplits.map(
          (split: ArtistSplit, splitIndex: number): JSX.Element => (
            <SplitArtistRow
              key={split.artistIndex}
              setReplacement={(replacement: string): void =>
                setReplacement(splitIndex, replacement)
              }
              split={split}
              stageError={stageError}
              togglePart={(partIndex: number): void =>
                togglePart(splitIndex, partIndex)
              }
            />
          )
        )}
      </table>
    </StageContainer>
  );
}
