import * as React from 'react';
import { Button, Card } from 'squiffles-components';

import { STAGE_NAMES } from '../defs';
import type { Stage } from '../defs';

import './StageContainer.css';

export default function StageContainer(props: {
  actionLabel?: string;
  children: React.ReactNode;
  onSubmit: () => void;
  stage: Exclude<Stage, Stage.length>;
}): JSX.Element {
  const { actionLabel = 'Continue', children, onSubmit, stage } = props;

  return (
    <div className="stage">
      <h2>
        Part {stage + 1}: {STAGE_NAMES[stage]}
      </h2>
      <Card width={40}>
        {children}
        <figure>
          <Button onClick={onSubmit} variant="primary">
            {actionLabel}
          </Button>
        </figure>
      </Card>
    </div>
  );
}
