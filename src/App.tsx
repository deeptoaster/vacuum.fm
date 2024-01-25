import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { ERROR_DURATION, TRANSITION_DURATION } from 'squiffles-components';
import { useEffect, useRef, useState } from 'react';

import ConfigureStage from './stages/ConfigureStage';
import type { Database } from './defs';
import SplitArtistsStage from './stages/SplitArtistsStage';
import { Stage } from './defs';
import VacuumFooter from './VacuumFooter';

import './App.css';

export default function App(): JSX.Element {
  const [database] = useState<Database | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const errorTimeout = useRef<number>();
  const [stage] = useState<Stage>(Stage.SPLIT_ARTISTS);

  useEffect((): void => {
    if (error != null) {
      window.clearTimeout(errorTimeout.current);

      errorTimeout.current = window.setTimeout(
        () => setError(null),
        ERROR_DURATION
      );
    }
  }, [error]);

  return (
    <section>
      <SwitchTransition>
        <CSSTransition
          appear={true}
          classNames="stage"
          key={database == null ? null : stage}
          timeout={TRANSITION_DURATION}
        >
          {database == null ? (
            <ConfigureStage setError={setError} />
          ) : stage === Stage.SPLIT_ARTISTS ? (
            <SplitArtistsStage />
          ) : null}
        </CSSTransition>
      </SwitchTransition>
      <VacuumFooter database={database} error={error} />
    </section>
  );
}
