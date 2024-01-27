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
  const [database, setDatabase] = useState<Database | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false);
  const [stage] = useState<Stage>(Stage.SPLIT_ARTISTS);
  const [, setTotalPages] = useState<number>(Infinity);

  const cancelLoad = useCallback((): void => {
    aborted.current = true;
  }, []);

  const loadDatabase = useCallback(
    async (username: string, dateSpan: DateSpan): Promise<void> => {
      setLoadingVisible(true);
      await VacuumUtils.loadDatabase(username, dateSpan, setTotalPages, aborted)
        .then(setDatabase)
        .catch(setError);
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
            key={database == null ? null : stage}
            timeout={TRANSITION_DURATION}
          >
            {database == null ? (
              <ConfigureStage loadDatabase={loadDatabase} setError={setError} />
            ) : stage === Stage.SPLIT_ARTISTS ? (
              <SplitArtistsStage />
            ) : null}
          </CSSTransition>
        </SwitchTransition>
        <VacuumFooter database={database} error={error} setError={setError} />
      </section>
    </>
  );
}
