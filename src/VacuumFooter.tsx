import * as React from 'react';
import { Footer } from 'squiffles-components';

export default function VacuumFooter(props: {
  error: Error | null;
  setError: (error: Error | null) => void;
  visible: boolean;
}): JSX.Element {
  const { error, setError, visible } = props;

  return (
    <Footer error={error} setError={setError} visible={visible}>
      {null}
    </Footer>
  );
}
