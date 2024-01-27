import * as React from 'react';
import { Footer } from 'squiffles-components';

import type { Database } from './defs';

export default function VacuumFooter(props: {
  database: Database | null;
  error: Error | null;
  setError: (error: Error | null) => void;
}): JSX.Element {
  const { error, database, setError } = props;

  return (
    <Footer error={error} setError={setError} visible={database != null}>
      {null}
    </Footer>
  );
}
