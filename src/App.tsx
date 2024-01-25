import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { TRANSITION_DURATION } from 'squiffles-components';
import { useState } from 'react';

import ConfigureStage from './stages/ConfigureStage';
import type { Database } from './defs';
import SplitArtistsStage from './stages/SplitArtistsStage';
import { Stage } from './defs';

import './App.css';

export default function App(): JSX.Element {
  const [database] = useState<Database | null>(null);
  const [stage] = useState<Stage>(Stage.SPLIT_ARTISTS);

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
            <ConfigureStage />
          ) : stage === Stage.SPLIT_ARTISTS ? (
            <SplitArtistsStage />
          ) : null}
        </CSSTransition>
      </SwitchTransition>
    </section>
  );
}
