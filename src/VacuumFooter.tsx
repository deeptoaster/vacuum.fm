import * as React from 'react';
import { Button, Footer, Tooltip } from 'squiffles-components';

import { DONATION_URL, STAGE_NAMES, Stage } from './defs';

import './VacuumFooter.css';

export default function VacuumFooter(props: {
  error: Error | null;
  setError: (error: Error | null) => void;
  setStage: (stage: Stage) => void;
  showHelp: () => void;
  stage: Stage;
  visible: boolean;
}): JSX.Element {
  const { error, setError, setStage, showHelp, stage, visible } = props;

  return (
    <Footer error={error} setError={setError} visible={visible}>
      <div>
        <Button onClick={showHelp}>Show Help</Button>
        <Button external={true} href={DONATION_URL}>
          Buy Me a Beer
        </Button>
      </div>
      <div>
        <ul className="timeline">
          {Array.from(new Array(Stage.length).keys()).map(
            (stageIndex: Exclude<Stage, Stage.length>): JSX.Element => (
              <li
                className={stageIndex === stage ? 'active' : ''}
                key={stageIndex}
              >
                <Tooltip message={STAGE_NAMES[stageIndex]}>
                  <Button
                    disabled={stageIndex >= stage}
                    onClick={() => setStage(stageIndex)}
                    variant="stub"
                  />
                </Tooltip>
              </li>
            )
          )}
        </ul>
      </div>
    </Footer>
  );
}
