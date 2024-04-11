import * as React from 'react';
import { Button, Card } from 'squiffles-components';

import { STAGE_NAMES } from '../defs';
import type { Stage } from '../defs';

import './StageContainer.css';

export default function StageContainer(props: {
  buttonHref?: string;
  buttonLabel?: string;
  children: React.ReactNode;
  onSubmit: (() => void) | null;
  stage: Exclude<Stage, Stage.length>;
}): JSX.Element {
  const {
    buttonHref,
    buttonLabel = 'Continue',
    children,
    onSubmit,
    stage
  } = props;

  return (
    <div className="stage">
      <h2>
        Part {stage + 1}: {STAGE_NAMES[stage]}
      </h2>
      <Card width={40}>
        {children}
        {onSubmit != null ? (
          <figure>
            {buttonHref != null ? (
              <Button href={buttonHref} onClick={onSubmit} variant="primary">
                {buttonLabel}
              </Button>
            ) : (
              <Button onClick={onSubmit} variant="primary">
                {buttonLabel}
              </Button>
            )}
          </figure>
        ) : null}
      </Card>
    </div>
  );
}
