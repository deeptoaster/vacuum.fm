import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TRANSITION_DURATION } from 'squiffles-components';

import * as VacuumUtils from './utils';
import type { Database, DateSpan } from './defs';
import ConfigureStage from './stages/ConfigureStage';
import DeduplicateAlbumsByNameStage from './stages/DeduplicateAlbumsByNameStage';
import DeduplicateAlbumsByTracksStage from './stages/DeduplicateAlbumsByTracksStage';
import DeduplicateArtistsByNameStage from './stages/DeduplicateArtistsByNameStage';
import DeduplicateArtistsByTracksStage from './stages/DeduplicateArtistsByTracksStage';
import DeduplicateTracksByNameStage from './stages/DeduplicateTracksByNameStage';
import Loading from './modals/Loading';
import SplitArtistsStage from './stages/SplitArtistsStage';
import { Stage } from './defs';
import VacuumFooter from './VacuumFooter';

import './App.css';

export default function App(): JSX.Element {
  const aborted = useRef<boolean>(false);

  const [databaseByStage, setDatabaseByStage] = useState<
    ReadonlyArray<Database>
  >([]);

  const [error, setError] = useState<Error | null>(null);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false);
  const [stage, setStage] = useState<Stage>(Stage.SPLIT_ARTISTS);
  const [, setTotalPages] = useState<number>(Infinity);

  const cancelLoad = useCallback((): void => {
    aborted.current = true;
  }, []);

  const incrementStage = useCallback(
    (updatedDatabase: Database): void => {
      setDatabaseByStage([
        ...databaseByStage.slice(0, stage + 1),
        updatedDatabase
      ]);

      setStage(stage + 1);
    },
    [databaseByStage, stage]
  );

  const loadDatabase = useCallback(
    async (username: string, dateSpan: DateSpan): Promise<void> => {
      setLoadingVisible(true);

      try {
        const database = await VacuumUtils.loadDatabase(
          username,
          dateSpan,
          setTotalPages,
          aborted
        );

        setDatabaseByStage([database]);
      } catch (loadError) {
        setError(loadError as Error);
      }

      setLoadingVisible(false);
      aborted.current = false;
    },
    []
  );

  useEffect((): void => setError(null), [stage]);

  return (
    <>
      <Loading cancelLoad={cancelLoad} visible={loadingVisible} />
      <section>
        <SwitchTransition>
          <CSSTransition
            appear={true}
            classNames="stage"
            key={databaseByStage.length === 0 ? null : stage}
            timeout={TRANSITION_DURATION}
          >
            {databaseByStage.length === 0 ? (
              <ConfigureStage loadDatabase={loadDatabase} setError={setError} />
            ) : stage === Stage.SPLIT_ARTISTS ? (
              <SplitArtistsStage
                database={databaseByStage[stage]}
                incrementStage={incrementStage}
                setError={setError}
              />
            ) : stage === Stage.DEDUPLICATE_ARTISTS_BY_NAME ? (
              <DeduplicateArtistsByNameStage
                database={databaseByStage[stage]}
                incrementStage={incrementStage}
              />
            ) : stage === Stage.DEDUPLICATE_ALBUMS_BY_NAME ? (
              <DeduplicateAlbumsByNameStage
                database={databaseByStage[stage]}
                incrementStage={incrementStage}
              />
            ) : stage === Stage.DEDUPLICATE_TRACKS_BY_NAME ? (
              <DeduplicateTracksByNameStage
                database={databaseByStage[stage]}
                incrementStage={incrementStage}
              />
            ) : stage === Stage.DEDUPLICATE_ARTISTS_BY_TRACKS ? (
              <DeduplicateArtistsByTracksStage
                database={databaseByStage[stage]}
                incrementStage={incrementStage}
              />
            ) : stage === Stage.DEDUPLICATE_ALBUMS_BY_TRACKS ? (
              <DeduplicateAlbumsByTracksStage
                database={databaseByStage[stage]}
                incrementStage={incrementStage}
              />
            ) : null}
          </CSSTransition>
        </SwitchTransition>
        <VacuumFooter
          error={error}
          setError={setError}
          setStage={setStage}
          stage={stage}
          visible={databaseByStage.length !== 0}
        />
      </section>
    </>
  );
}
