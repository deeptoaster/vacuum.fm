import * as React from 'react';
import { Button, Card } from 'squiffles-components';

import './StageContainer.css';

export default function StageContainer(props: {
  children: React.ReactNode;
  onSubmit: () => void;
  subtitle: string;
  title: string;
}): JSX.Element {
  const { children, onSubmit, subtitle, title } = props;

  return (
    <div className="stage">
      <h2>{title}</h2>
      <Card width={40}>
        <h3>{subtitle}</h3>
        {children}
        <figure>
          <Button onClick={onSubmit} variant="primary">
            Continue
          </Button>
        </figure>
      </Card>
    </div>
  );
}
