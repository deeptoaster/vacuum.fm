import * as React from 'react';
import { Footer } from 'squiffles-components';

import type { Database } from './defs';

export default function VacuumFooter(props: {
  database: Database | null;
  error: Error | null;
}): JSX.Element {
  const { error, database } = props;

  return (
    <Footer error={error} visible={database != null}>
      {null}
    </Footer>
  );
}
