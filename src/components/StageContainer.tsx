import * as React from 'react';

import './StageContainer.css';

export default function StageContainer(props: {
  children: React.ReactNode;
}): JSX.Element {
  const { children } = props;

  return <div className="stage">{children}</div>;
}
