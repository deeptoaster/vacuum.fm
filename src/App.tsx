import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TRANSITION_DURATION } from 'squiffles-components';

import * as VacuumUtils from './utils';
import type { Database, DateSpan } from './defs';
import ConfigureStage from './stages/ConfigureStage';
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

  useEffect((): void => {
    setDatabaseByStage([
      {
        artists: [
          {
            count: 0,
            duplicates: [],
            name: 'Alice, Bob, and Charlie',
            albums: [],
            tracks: []
          }
        ],
        artistCount: 1,
        albums: [],
        albumCount: 0,
        tracks: [],
        trackCount: 0
      }
    ]);
  }, []);

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
            ) : null}
          </CSSTransition>
        </SwitchTransition>
        <VacuumFooter
          error={error}
          setError={setError}
          stage={stage}
          visible={databaseByStage.length !== 0}
        />
      </section>
    </>
  );
}
